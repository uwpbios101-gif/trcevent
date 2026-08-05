// Private brainstorming tool for Marlon (Jerky Jerk) to develop new weekly
// events by talking through ideas out loud. Uses the browser's native
// SpeechRecognition API for speech-to-text (no server round-trip, no new
// dependency) -- Chrome/Edge only, degrades to plain typing elsewhere.
//
// Guided Brainstorm mode exists because Marlon doesn't like reading and
// spends a lot of time driving: it reads each planning question out loud
// (SpeechSynthesis) one at a time -- who/what/where/when/times/day-or-
// evening/price/hook/repeat-visits/business-impact -- listens for his
// spoken answer, and auto-advances once he stops talking (a silence timer
// that resets on any new speech), so he never has to look at or touch the
// screen mid-answer. Free-form typing/talking below still works if he'd
// rather just riff without the guided structure.
//
// Backed by event_brainstorm_sessions (open anon RLS, same "unlisted URL is
// the gate" model as plate-cost -- see supabase/sql/event_brainstorm_schema.sql)
// and the generate-event-concept Edge Function, which calls Claude to turn
// the raw transcript into a fleshed-out event concept.
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Mic, MicOff, Save, Sparkles, Square, Wand2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventSlug = "karaoke-thursdays" | "mingles-tuesdays" | "just-laugh-wednesday";

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: { 0: { transcript: string }; isFinal: boolean };
  };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function isTtsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// The "stones to turn" -- every angle a real weekly event needs answered
// before it's actually plannable, read aloud one at a time.
const GUIDED_QUESTIONS: { key: string; prompt: string }[] = [
  {
    key: "WHO",
    prompt: "Who is this event for? Picture the exact kind of person walking through the door.",
  },
  { key: "WHAT", prompt: "What actually happens, minute to minute? Walk me through the format." },
  { key: "WHERE", prompt: "Which Jerky Jerk location — Western Avenue, Taylor Street, or both?" },
  { key: "WHEN", prompt: "What day of the week is this, and is it happening every single week?" },
  { key: "START TIME", prompt: "What time does it start?" },
  { key: "END TIME", prompt: "What time does it wrap up?" },
  { key: "DAY OR EVENING", prompt: "Is this a daytime hangout or an evening event?" },
  { key: "FOOD AND PRICE", prompt: "What food is included, and what does it cost to get in?" },
  { key: "THE HOOK", prompt: "What's the one thing that makes someone tell a friend about it?" },
  { key: "WHY THEY COME BACK", prompt: "Why would the same person come back again next week?" },
  {
    key: "BUSINESS IMPACT",
    prompt: "How does this turn into real food and drink sales for Jerky Jerk?",
  },
  { key: "ANYTHING ELSE", prompt: "Anything else on your mind about this one?" },
];

const GUIDED_SILENCE_MS = 3500;

export function EventBrainstormTool({
  eventSlug,
  eventName,
}: {
  eventSlug: EventSlug;
  eventName: string;
}) {
  const [transcript, setTranscript] = useState("");
  const [concept, setConcept] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [listening, setListening] = useState(false);
  const [guidedQuestion, setGuidedQuestion] = useState<{ key: string; prompt: string } | null>(
    null,
  );
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const guidedActiveRef = useRef(false);
  const guidedIndexRef = useRef(0);
  const guidedBufferRef = useRef("");
  const advancingRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechSupported = getSpeechRecognitionCtor() !== null;
  const guidedSupported = speechSupported && isTtsSupported();

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_brainstorm_sessions")
      .select("transcript, concept")
      .eq("event_slug", eventSlug)
      .single();
    if (error) {
      toast.error("Couldn't load your saved draft.");
    } else if (data) {
      setTranscript(data.transcript ?? "");
      setConcept(data.concept ?? null);
    }
    setLoading(false);
  }, [eventSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const saveDraft = useCallback(
    async (nextTranscript: string) => {
      setSaving(true);
      const { error } = await supabase
        .from("event_brainstorm_sessions")
        .update({ transcript: nextTranscript, updated_at: new Date().toISOString() })
        .eq("event_slug", eventSlug);
      setSaving(false);
      if (error) {
        toast.error("Couldn't save your draft.");
      }
    },
    [eventSlug],
  );

  const toggleListening = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        }
      }
      if (finalChunk) {
        setTranscript((prev) => (prev ? `${prev.trim()} ${finalChunk.trim()}` : finalChunk.trim()));
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // --- Guided Brainstorm: speak a question, listen, auto-advance on silence ---

  const speak = (text: string) =>
    new Promise<void>((resolve) => {
      if (!isTtsSupported()) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const beginListeningForAnswer = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        }
      }
      if (finalChunk) {
        guidedBufferRef.current = guidedBufferRef.current
          ? `${guidedBufferRef.current} ${finalChunk.trim()}`
          : finalChunk.trim();
      }
      // Any speech activity (interim or final) means he's still answering --
      // push the auto-advance timer back out.
      clearSilenceTimer();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      silenceTimerRef.current = setTimeout(() => advanceGuidedRef.current(), GUIDED_SILENCE_MS);
    };
    recognition.onerror = () => {
      if (guidedActiveRef.current && !advancingRef.current) {
        beginListeningForAnswer();
      }
    };
    recognition.onend = () => {
      // Some browsers auto-stop recognition after a pause even mid-answer;
      // restart transparently unless we deliberately stopped it to advance.
      if (guidedActiveRef.current && !advancingRef.current) {
        beginListeningForAnswer();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    // No timer armed yet here on purpose -- wait indefinitely for him to
    // actually start answering before the silence countdown ever begins.
  }, []);

  const advanceGuided = useCallback(async () => {
    clearSilenceTimer();
    advancingRef.current = true;
    recognitionRef.current?.stop();

    const question = GUIDED_QUESTIONS[guidedIndexRef.current];
    const answer = guidedBufferRef.current.trim();
    if (answer && question) {
      const next = transcriptRef.current.trim()
        ? `${transcriptRef.current.trim()}\n\n${question.key}: ${answer}`
        : `${question.key}: ${answer}`;
      transcriptRef.current = next;
      setTranscript(next);
      saveDraft(next);
    }
    guidedBufferRef.current = "";

    const nextIndex = guidedIndexRef.current + 1;
    if (!guidedActiveRef.current || nextIndex >= GUIDED_QUESTIONS.length) {
      const finishedAll = guidedActiveRef.current && nextIndex >= GUIDED_QUESTIONS.length;
      guidedActiveRef.current = false;
      guidedIndexRef.current = 0;
      setGuidedQuestion(null);
      if (finishedAll) {
        await speak("That's everything — hit Generate event concept whenever you're ready.");
      }
      return;
    }

    guidedIndexRef.current = nextIndex;
    const next = GUIDED_QUESTIONS[nextIndex];
    setGuidedQuestion(next);
    await speak(next.prompt);
    if (!guidedActiveRef.current) return; // stopped while the question was being read
    advancingRef.current = false;
    beginListeningForAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beginListeningForAnswer, saveDraft]);

  // advanceGuided is referenced from inside beginListeningForAnswer's timer
  // callback, which is defined before advanceGuided in source order -- keep
  // a stable ref so that closure always calls the latest version.
  const advanceGuidedRef = useRef(advanceGuided);
  useEffect(() => {
    advanceGuidedRef.current = advanceGuided;
  }, [advanceGuided]);

  const startGuidedBrainstorm = async () => {
    if (!guidedSupported) {
      toast.error("Guided voice brainstorm needs Chrome or Edge.");
      return;
    }
    if (listening) recognitionRef.current?.stop();
    guidedActiveRef.current = true;
    guidedIndexRef.current = 0;
    guidedBufferRef.current = "";
    advancingRef.current = false;
    const first = GUIDED_QUESTIONS[0];
    setGuidedQuestion(first);
    await speak(`Let's walk through ${eventName}. ${first.prompt}`);
    if (!guidedActiveRef.current) return;
    beginListeningForAnswer();
  };

  const stopGuidedBrainstorm = () => {
    guidedActiveRef.current = false;
    advancingRef.current = true;
    clearSilenceTimer();
    recognitionRef.current?.stop();
    if (isTtsSupported()) window.speechSynthesis.cancel();
    setGuidedQuestion(null);
  };

  useEffect(() => {
    return () => {
      guidedActiveRef.current = false;
      clearSilenceTimer();
      recognitionRef.current?.stop();
      if (isTtsSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  // --- Copy / Generate ---

  const handleCopy = async () => {
    if (!transcript.trim()) {
      toast.error("Nothing to copy yet — talk through the idea (or type it in) first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(transcript);
      toast.success("Transcript copied — paste it into a chat with Claude to get a concept.");
    } catch {
      toast.error("Couldn't copy automatically — select the text in the box and copy it manually.");
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      toast.error("Talk through the idea (or type it in) before generating a concept.");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-event-concept", {
        body: { eventName, transcript },
      });
      if (error || !data?.concept) {
        toast.error("Couldn't generate a concept. Try again in a bit.");
        return;
      }
      setConcept(data.concept);
      const generatedAt = new Date().toISOString();
      await supabase
        .from("event_brainstorm_sessions")
        .update({ concept: data.concept, generated_at: generatedAt, updated_at: generatedAt })
        .eq("event_slug", eventSlug);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{eventName}</h1>
        <p className="mt-1 text-muted-foreground">
          Talk through your idea for this event, then turn it into a full concept.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guided Brainstorm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {guidedSupported ? (
            guidedQuestion ? (
              <div className="space-y-3">
                <div className="rounded-md border border-gold/40 bg-gold/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {guidedQuestion.key}
                  </p>
                  <p className="mt-1 text-sm">{guidedQuestion.prompt}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Listening — just answer normally, it'll move on once you stop talking.
                  </p>
                </div>
                <Button type="button" variant="destructive" onClick={stopGuidedBrainstorm}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop guided brainstorm
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't want to think of everything yourself? Hit start and it'll ask you who, what,
                  where, when, start/end times, price, and a few more — one at a time, out loud, so
                  you can answer hands-free.
                </p>
                <Button type="button" onClick={startGuidedBrainstorm}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Start guided brainstorm
                </Button>
                <p className="text-xs text-muted-foreground">
                  If you're driving, only start this at a stop — it reads questions and listens
                  automatically once going, but starting it needs a tap.
                </p>
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Guided voice brainstorm needs Chrome or Edge on this device.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brainstorm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {speechSupported ? (
            <Button
              type="button"
              variant={listening ? "destructive" : "outline"}
              onClick={toggleListening}
              disabled={!!guidedQuestion}
            >
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? "Stop listening" : "Start talking"}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Voice input needs Chrome or Edge on this device — just type your idea below instead.
            </p>
          )}
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onBlur={(e) => saveDraft(e.target.value)}
            placeholder="Start talking or typing — what's the idea for this event?"
            className="min-h-[220px]"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => saveDraft(transcript)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save draft
            </Button>
            <Button type="button" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate event concept
            </Button>
            <Button type="button" variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy transcript
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            If "Generate event concept" isn't working, hit "Copy transcript" and paste it into a
            chat with Claude instead — same result, no automation needed.
          </p>
        </CardContent>
      </Card>

      {concept && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Concept</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{concept}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
