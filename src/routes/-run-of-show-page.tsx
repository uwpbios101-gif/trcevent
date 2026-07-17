// Shared by src/routes/run-of-show.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Live, team-editable master production schedule (see migration 0013,
// production_schedule table) plus a structured Show/Artist Sets lineup
// table with per-act status checkboxes (migration 0015, schedule_acts).
// Anyone can read either with no login; editing either needs one shared
// team password (PRODUCTION_SCHEDULE_PASSWORD), not per-member accounts --
// Stephen hands that one password to whoever on the team needs to edit.
// The password field at the top of the page is shared by both the
// schedule-text editor and every checkbox in the lineup table, rather than
// asking for it again per action. Last write wins -- no conflict
// resolution if two people save at once, which is an acceptable tradeoff
// for a small team coordinating one show night, not a general-purpose doc
// editor.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Loader2, Pencil, X } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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

type ScheduleAct = {
  id: string;
  position: number;
  time_slot: string;
  act_name: string;
  online_promo: boolean;
  social_media_received: boolean;
  contract_signed: boolean;
  tickets_ordered: boolean;
};

const STATUS_COLUMNS: { field: keyof ScheduleAct; label: string }[] = [
  { field: "online_promo", label: "Online Promo" },
  { field: "social_media_received", label: "Social Media Received" },
  { field: "contract_signed", label: "Contract Signed" },
  { field: "tickets_ordered", label: "Tickets Ordered" },
];

export function RunOfShowPage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [acts, setActs] = useState<ScheduleAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [teamPassword, setTeamPassword] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [draft, setDraft] = useState("");

  async function load() {
    setLoading(true);
    const [scheduleRes, actsRes] = await Promise.all([
      supabase
        .from("production_schedule")
        .select("event_name, content, updated_at, updated_by")
        .single(),
      supabase.from("schedule_acts").select("*").order("position"),
    ]);
    if (scheduleRes.error) {
      toast.error("Couldn't load the schedule.");
    } else {
      setSchedule(scheduleRes.data);
    }
    if (actsRes.error) {
      toast.error("Couldn't load the lineup table.");
    } else {
      setActs(actsRes.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEditing() {
    setDraft(schedule?.content ?? "");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-production-schedule", {
        body: { password: teamPassword, content: draft, updatedBy: updatedBy.trim() || undefined },
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
      setEditing(false);
      toast.success("Schedule updated.");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActStatus(act: ScheduleAct, field: keyof ScheduleAct, value: boolean) {
    // Optimistic -- flip it in the UI immediately, then confirm with the
    // server. A wrong password or network hiccup reverts it back.
    setActs((prev) => prev.map((a) => (a.id === act.id ? { ...a, [field]: value } : a)));
    try {
      const { data, error } = await supabase.functions.invoke("update-schedule-act", {
        body: { password: teamPassword, id: act.id, field, value },
      });
      if (error || !data?.ok) {
        setActs((prev) => prev.map((a) => (a.id === act.id ? { ...a, [field]: !value } : a)));
        toast.error(data?.error ?? "Couldn't save. Try again.");
        return;
      }
    } catch {
      setActs((prev) => prev.map((a) => (a.id === act.id ? { ...a, [field]: !value } : a)));
      toast.error("Something went wrong. Check your connection and try again.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Ras Tafari Inc — TRC Events</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Master Production Schedule</h1>
        {schedule && <p className="mt-2 text-sm text-muted-foreground">{schedule.event_name}</p>}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-gold" />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <Label htmlFor="ros-team-password">
              Team password (needed to check off items or edit below)
            </Label>
            <Input
              id="ros-team-password"
              type="password"
              value={teamPassword}
              onChange={(e) => setTeamPassword(e.target.value)}
              className="mt-1.5 max-w-xs"
              placeholder="Only needed to make changes"
            />
          </div>

          {acts.length > 0 && (
            <section>
              <h2 className="font-display mb-4 text-xl font-bold">Show &amp; Artist Sets</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card text-left">
                      <th className="p-3 font-medium">Time</th>
                      <th className="p-3 font-medium">Act</th>
                      {STATUS_COLUMNS.map((col) => (
                        <th key={col.field} className="p-3 text-center font-medium">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {acts.map((act) => (
                      <tr key={act.id} className="border-b border-border last:border-0">
                        <td className="p-3 tabular-nums text-muted-foreground">{act.time_slot}</td>
                        <td className="p-3 font-medium">{act.act_name}</td>
                        {STATUS_COLUMNS.map((col) => (
                          <td key={col.field} className="p-3 text-center">
                            <Checkbox
                              checked={act[col.field] as boolean}
                              onCheckedChange={(checked) =>
                                toggleActStatus(act, col.field, checked === true)
                              }
                              aria-label={`${col.label} — ${act.act_name}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {schedule && (
            <section className="space-y-4">
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
                      rows={16}
                      className="mt-1.5 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ros-name">Your name (optional)</Label>
                    <Input
                      id="ros-name"
                      value={updatedBy}
                      onChange={(e) => setUpdatedBy(e.target.value)}
                      className="mt-1.5 max-w-xs"
                    />
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
            </section>
          )}

          {!schedule && acts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No schedule found.</p>
          )}
        </div>
      )}
    </div>
  );
}
