// Shared by src/routes/dancehall-101.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) -- see
// src/routes/README.md.
//
// Migrated from selassiefest.com/dancehall101/index.html + assets/
// dancehall101-client.js -- same backend (dh101_schools/dh101_signups
// tables, dh101_enforce_signup_rules trigger), now a proper trcevent.com
// route. Two modes on one page, chosen by the ?school= query param (kept as
// a query param rather than a path segment to match the original site's
// URLs exactly, e.g. links already shared as .../dancehall101/?school=depaul):
//   - no ?school= -> a searchable picker grid of all active partner schools
//   - ?school=<slug> -> that school's branded landing page + .edu signup form
// ?ref=<ambassadorCode> (only meaningful with ?school=) attributes the
// signup to an ambassador for the leaderboard.
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  fetchActiveSchools,
  fetchSchoolBySlug,
  submitDh101Signup,
  type Dh101School,
} from "@/lib/dancehall101";
import {
  DH101_BG,
  DH101_BORDER,
  DH101_CARD,
  DH101_FONT_LINKS,
  DH101_TEXT,
  DH101_TEXT_DIM,
  Dh101Footer,
  Dh101Topbar,
  SchoolWordmark,
  SITE_URL,
  dh101Vars,
} from "./-dancehall-101-shared";

export function dancehall101Head() {
  return {
    meta: [
      { title: "Dancehall 101 — Free Student Entry | Jerky Jerk, Chicago" },
      {
        name: "description",
        content:
          "Dancehall 101 — Friday nights at Jerky Jerk, Chicago. College students 21+ get 100% free entry with a verified .edu email.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dancehall 101" },
      { property: "og:title", content: "Dancehall 101 — Free Student Entry" },
      {
        property: "og:description",
        content:
          "Friday nights at Jerky Jerk, Chicago. 21+ college students get 100% free entry with a verified .edu email.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dancehall-101` }, ...DH101_FONT_LINKS],
  };
}

function SchoolPicker({ schools }: { schools: Dh101School[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(q));
  }, [schools, query]);

  return (
    <>
      <div className="px-6 pt-12 pb-8 text-center">
        <h1 className="font-[Anton] text-[clamp(2rem,6vw,3.4rem)] uppercase leading-[1.05] tracking-[0.02em]">
          Free Entry for <span style={{ color: "var(--school-primary)" }}>College Students</span>
        </h1>
        <p
          className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem]"
          style={{ color: DH101_TEXT_DIM }}
        >
          Every Friday night at Jerky Jerk, Chicago. 21+ students get 100% free entry — verify your
          .edu email and get your ticket in seconds.
        </p>
        <span
          className="mt-4.5 inline-block rounded-full px-4 py-1.5 text-[0.78rem] font-bold tracking-[0.08em] text-white uppercase"
          style={{ background: "var(--school-primary)" }}
        >
          21+ Event · Friday Nights
        </span>
      </div>
      <div className="mx-auto max-w-[900px] px-6 pb-15">
        <input
          type="search"
          placeholder="Find your school…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-5 w-full rounded-[10px] border px-4 py-3.5 text-base outline-none focus:border-[var(--school-secondary)]"
          style={{ background: DH101_CARD, borderColor: DH101_BORDER, color: DH101_TEXT }}
        />
        {filtered.length === 0 ? (
          <p className="py-10 text-center" style={{ color: DH101_TEXT_DIM }}>
            No schools match your search.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
            {filtered.map((s) => (
              <a
                key={s.id}
                href={`/dancehall-101?school=${encodeURIComponent(s.slug)}`}
                style={dh101Vars(s)}
                className="block rounded-2xl border p-4.5 text-center transition hover:-translate-y-0.5 hover:border-[var(--school-secondary)]"
              >
                <div style={{ backgroundColor: DH101_CARD, borderColor: DH101_BORDER }}>
                  <SchoolWordmark school={s} size="sm" />
                </div>
                <div className="mt-2.5 text-[0.92rem]" style={{ color: DH101_TEXT }}>
                  {s.name}
                </div>
                {s.mascot && (
                  <div className="mt-0.5 text-[0.75rem]" style={{ color: DH101_TEXT_DIM }}>
                    {s.mascot}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function calcAge(dob: string) {
  const d = new Date(`${dob}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function SchoolLanding({ school, ref: referralCode }: { school: Dh101School; ref: string | null }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [segment, setSegment] = useState("UNDERGRAD");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    document.title = `${school.mascot || school.name} Take Fridays — Dancehall 101`;
  }, [school]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!/@[^@]+\.edu$/i.test(email)) {
      setMsg({ text: "Please use your school .edu email address.", ok: false });
      return;
    }
    if (calcAge(dob) < 21) {
      setMsg({
        text: "Dancehall 101 is a 21+ event. You're not eligible for free entry.",
        ok: false,
      });
      return;
    }

    setBusy(true);
    try {
      const result = await submitDh101Signup({
        school,
        fullName: fullName.trim(),
        eduEmail: email.trim(),
        dob,
        studentSegment: segment,
        referralCode,
        honeypot,
      });
      setMsg({ text: "Check your email to verify and view your ticket!", ok: true });
      if (!result.skipped) {
        setFullName("");
        setEmail("");
        setDob("");
        setSegment("UNDERGRAD");
      }
    } catch (err) {
      console.error("Dancehall 101 signup failed:", err);
      const already = err instanceof Error && /duplicate key|unique/i.test(err.message);
      setMsg({
        text: already
          ? "You've already signed up with this email — check your inbox for your ticket link."
          : "Something went wrong. Please try again.",
        ok: false,
      });
    } finally {
      setBusy(false);
    }
  }

  const headline = school.mascot ? (
    <>
      <h1 className="mt-4.5 font-[Anton] text-[clamp(2rem,6vw,3.4rem)] uppercase leading-[1.05] tracking-[0.02em]">
        <span style={{ color: "var(--school-primary)" }}>{school.mascot}</span>
        <br />
        Take Fridays
      </h1>
      <div
        className="mt-2 text-[0.95rem] font-semibold tracking-[0.1em] uppercase"
        style={{ color: "var(--school-secondary)" }}
      >
        {school.name}
      </div>
    </>
  ) : (
    <h1 className="mt-4.5 font-[Anton] text-[clamp(2rem,6vw,3.4rem)] uppercase leading-[1.05] tracking-[0.02em]">
      {school.name}
      <br />
      <span style={{ color: "var(--school-primary)" }}>Takes Fridays</span>
    </h1>
  );

  return (
    <>
      <div
        className="border-b px-6 pt-12 pb-8 text-center"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--school-primary) 32%, transparent) 0%, transparent 75%)",
          borderColor: "color-mix(in srgb, var(--school-secondary) 35%, transparent)",
        }}
      >
        <SchoolWordmark school={school} size="lg" />
        {headline}
        <p
          className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem]"
          style={{ color: DH101_TEXT_DIM }}
        >
          Dancehall 101 — Fridays at Jerky Jerk. Free for {school.name} students, 21+.
        </p>
        <span
          className="mt-4.5 inline-block rounded-full px-4 py-1.5 text-[0.78rem] font-bold tracking-[0.08em] text-white uppercase"
          style={{ background: "var(--school-primary)" }}
        >
          Chicago&rsquo;s #1 Dancehall Experience
        </span>
      </div>

      <div className="mx-auto max-w-[460px] px-6 pb-15">
        <form
          onSubmit={handleSubmit}
          className="mt-0 rounded-[18px] border p-6.5"
          style={{ background: DH101_CARD, borderColor: DH101_BORDER }}
        >
          <h2
            className="mb-4.5 text-[1rem] tracking-[0.06em] uppercase"
            style={{ color: "var(--school-secondary)" }}
          >
            Claim Your Free Ticket
          </h2>

          <label
            htmlFor="dh-name"
            className="mb-1.5 block text-[0.78rem] tracking-[0.05em] uppercase"
            style={{ color: DH101_TEXT_DIM }}
          >
            Full Name
          </label>
          <input
            id="dh-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-4 w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-[var(--school-secondary)]"
            style={{ borderColor: DH101_BORDER, color: DH101_TEXT }}
          />

          <label
            htmlFor="dh-email"
            className="mb-1.5 block text-[0.78rem] tracking-[0.05em] uppercase"
            style={{ color: DH101_TEXT_DIM }}
          >
            {school.name} Email (.edu)
          </label>
          <input
            id="dh-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-[var(--school-secondary)]"
            style={{ borderColor: DH101_BORDER, color: DH101_TEXT }}
          />

          <label
            htmlFor="dh-dob"
            className="mb-1.5 block text-[0.78rem] tracking-[0.05em] uppercase"
            style={{ color: DH101_TEXT_DIM }}
          >
            Date of Birth
          </label>
          <input
            id="dh-dob"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mb-4 w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-[var(--school-secondary)]"
            style={{ borderColor: DH101_BORDER, color: DH101_TEXT }}
          />

          <label
            htmlFor="dh-segment"
            className="mb-1.5 block text-[0.78rem] tracking-[0.05em] uppercase"
            style={{ color: DH101_TEXT_DIM }}
          >
            I Am A&hellip;
          </label>
          <select
            id="dh-segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="mb-4 w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-[var(--school-secondary)]"
            style={{ borderColor: DH101_BORDER, color: DH101_TEXT }}
          >
            <option value="UNDERGRAD">Undergraduate Student</option>
            <option value="GRAD">Graduate Student</option>
            <option value="ALUMNI">Alumni</option>
          </select>

          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[10px] py-3.5 text-[0.98rem] font-bold tracking-[0.05em] text-white uppercase transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--school-primary)" }}
          >
            {busy ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Sending&hellip;
              </span>
            ) : (
              "Get My Free Ticket"
            )}
          </button>

          {msg && (
            <p
              className="mt-3.5 text-center text-[0.85rem]"
              style={{ color: msg.ok ? "#6dbe8f" : "#e08585" }}
            >
              {msg.text}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export function Dancehall101Page() {
  const [schools, setSchools] = useState<Dh101School[] | null>(null);
  const [school, setSchool] = useState<Dh101School | null | undefined>(undefined);
  const [error, setError] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("school"));
    setRef(params.get("ref"));
  }, []);

  useEffect(() => {
    if (slug === undefined) return;
    let cancelled = false;
    async function load() {
      try {
        if (slug) {
          const found = await fetchSchoolBySlug(slug);
          if (!cancelled) setSchool(found);
        } else {
          const rows = await fetchActiveSchools();
          if (!cancelled) setSchools(rows);
        }
      } catch (err) {
        console.error("Dancehall 101 load failed:", err);
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div
      className="w-full"
      style={{ background: DH101_BG, color: DH101_TEXT, ...dh101Vars(school) }}
    >
      <Dh101Topbar tagline="Lessons in Dancehall Culture" />
      <main>
        {error ? (
          <div className="px-6 py-12 text-center">
            <h1 className="font-[Anton] text-3xl uppercase">Something Went Wrong</h1>
            <p className="mt-3.5" style={{ color: DH101_TEXT_DIM }}>
              Please refresh and try again.
            </p>
          </div>
        ) : slug === undefined ? (
          <div className="px-6 py-12 text-center">
            <h1 className="font-[Anton] text-3xl uppercase">Loading&hellip;</h1>
          </div>
        ) : slug ? (
          school === undefined ? (
            <div className="px-6 py-12 text-center">
              <h1 className="font-[Anton] text-3xl uppercase">Loading&hellip;</h1>
            </div>
          ) : school === null ? (
            <div className="px-6 py-12 text-center">
              <h1 className="font-[Anton] text-3xl uppercase">School Not Found</h1>
              <p className="mt-3.5" style={{ color: DH101_TEXT_DIM }}>
                We couldn&rsquo;t find that school.{" "}
                <a href="/dancehall-101" style={{ color: "var(--school-secondary)" }}>
                  Browse all participating schools &rarr;
                </a>
              </p>
            </div>
          ) : (
            <SchoolLanding school={school} ref={ref} />
          )
        ) : schools === null ? (
          <div className="px-6 py-12 text-center">
            <h1 className="font-[Anton] text-3xl uppercase">Loading&hellip;</h1>
          </div>
        ) : (
          <SchoolPicker schools={schools} />
        )}
      </main>
      <Dh101Footer />
    </div>
  );
}
