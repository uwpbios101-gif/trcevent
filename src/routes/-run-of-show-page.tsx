// Shared by src/routes/run-of-show.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Live, team-editable master production schedule (see migration 0013,
// production_schedule table). Anyone can read it with no login; editing
// needs a shared team password (PRODUCTION_SCHEDULE_PASSWORD), not
// per-member accounts -- Stephen hands that one password to whoever on
// the team needs to edit. Last write wins -- no conflict resolution if
// two people save at once, which is an acceptable tradeoff for a small
// team coordinating one show night, not a general-purpose doc editor.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Loader2, Pencil, X } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SITE_URL = "https://trcevent.com";

export function runOfShowHead() {
  return {
    meta: [
      { title: "Master Production Schedule | TRC Events" },
      { name: "description", content: "Live show-night run of show for TRC Events." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/run-of-show` }],
  };
}

type Schedule = {
  event_name: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
};

export function RunOfShowPage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [password, setPassword] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [draft, setDraft] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("production_schedule")
      .select("event_name, content, updated_at, updated_by")
      .single();
    if (error) {
      toast.error("Couldn't load the schedule.");
    } else {
      setSchedule(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEditing() {
    setDraft(schedule?.content ?? "");
    setPassword("");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-production-schedule", {
        body: { password, content: draft, updatedBy: updatedBy.trim() || undefined },
      });
      if (error || !data?.ok) {
        toast.error(data?.error ?? "Couldn't save. Try again.");
        return;
      }
      setSchedule((prev) =>
        prev
          ? {
              ...prev,
              content: data.content,
              updated_at: data.updated_at,
              updated_by: data.updated_by,
            }
          : prev,
      );
      setPassword("");
      setEditing(false);
      toast.success("Schedule updated.");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Ras Tafari Inc — TRC Events</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Master Production Schedule</h1>
        {schedule && <p className="mt-2 text-sm text-muted-foreground">{schedule.event_name}</p>}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-gold" />
        </div>
      ) : schedule ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" />
              Last updated {new Date(schedule.updated_at).toLocaleString()}
              {schedule.updated_by ? ` by ${schedule.updated_by}` : ""}
            </div>
            {!editing && (
              <Button variant="goldOutline" size="sm" onClick={startEditing}>
                <Pencil className="size-3.5" /> Edit
              </Button>
            )}
          </div>

          {!editing ? (
            <pre className="whitespace-pre-wrap rounded-xl border border-border bg-card p-6 font-sans text-sm leading-relaxed text-foreground">
              {schedule.content}
            </pre>
          ) : (
            <form
              onSubmit={handleSave}
              className="space-y-4 rounded-xl border border-border bg-card p-6"
            >
              <div>
                <Label htmlFor="ros-content">Schedule</Label>
                <Textarea
                  id="ros-content"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={20}
                  className="mt-1.5 font-mono text-sm"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ros-name">Your name (optional)</Label>
                  <Input
                    id="ros-name"
                    value={updatedBy}
                    onChange={(e) => setUpdatedBy(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="ros-password">Team password</Label>
                  <Input
                    id="ros-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gold" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save
                </Button>
                <Button
                  type="button"
                  variant="goldOutline"
                  onClick={() => setEditing(false)}
                  disabled={busy}
                >
                  <X className="size-3.5" /> Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">No schedule found.</p>
      )}
    </div>
  );
}
