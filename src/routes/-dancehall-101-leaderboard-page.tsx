// Shared by src/routes/dancehall-101_.leaderboard.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) --
// see src/routes/README.md. The trailing underscore opts this route out of
// nesting under dancehall-101.tsx -- see -charly-black-comp-page.tsx for why
// that matters.
//
// Migrated from selassiefest.com/dancehall101/leaderboard.html -- public
// ambassador leaderboard, zero signup PII (dh101_ambassador_leaderboard view
// only ever exposes counts). ?ambassador=<code> highlights that ambassador's
// own row and shows their personal shareable referral link.
import { useEffect, useState } from "react";

import { fetchDh101Leaderboard, type Dh101LeaderboardRow } from "@/lib/dancehall101";
import {
  DH101_BG,
  DH101_BORDER,
  DH101_CARD,
  DH101_FONT_LINKS,
  DH101_TEXT_DIM,
  Dh101Footer,
  Dh101Topbar,
  SITE_URL,
  dh101Vars,
} from "./-dancehall-101-shared";

export function dancehall101LeaderboardHead() {
  return {
    meta: [
      { title: "Ambassador Leaderboard | Dancehall 101" },
      {
        name: "description",
        content:
          "Dancehall 101 ambassador leaderboard — see who's bringing the most students out to Uptown Lounge on Wednesdays.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/dancehall-101/leaderboard` },
      ...DH101_FONT_LINKS,
    ],
  };
}

export function Dancehall101LeaderboardPage() {
  const [rows, setRows] = useState<Dh101LeaderboardRow[] | null>(null);
  const [error, setError] = useState(false);
  const [myCode, setMyCode] = useState<string | null>(null);

  useEffect(() => {
    setMyCode(new URLSearchParams(window.location.search).get("ambassador"));
    fetchDh101Leaderboard()
      .then(setRows)
      .catch((err) => {
        console.error("Leaderboard load failed:", err);
        setError(true);
      });
  }, []);

  const me = rows?.find((r) => myCode && r.code === myCode) ?? null;

  return (
    <div className="w-full" style={{ background: DH101_BG, color: "#f5f5f5", ...dh101Vars(me) }}>
      <Dh101Topbar tagline="Ambassador Leaderboard" />
      <main>
        <div className="px-6 pt-12 pb-8 text-center">
          <h1 className="font-[Anton] text-[clamp(2rem,6vw,3.4rem)] uppercase leading-[1.05] tracking-[0.02em]">
            Ambassador <span style={{ color: "var(--school-primary)" }}>Leaderboard</span>
          </h1>
          <p
            className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem]"
            style={{ color: DH101_TEXT_DIM }}
          >
            See who&rsquo;s bringing the most students out to Uptown Lounge on Wednesdays.
          </p>
        </div>

        <div className="mx-auto max-w-[640px] px-5 pb-15">
          {me && (
            <div
              className="mb-6 rounded-[14px] border px-5 py-4.5 text-center"
              style={{ background: DH101_CARD, borderColor: "var(--school-secondary)" }}
            >
              <div className="text-2xl font-bold" style={{ color: "var(--school-secondary)" }}>
                #{rows!.findIndex((r) => r.code === myCode) + 1}
              </div>
              <div>
                {me.display_name} &mdash; {me.signup_count} signup{me.signup_count === 1 ? "" : "s"}
              </div>
              <div className="mt-3 rounded-lg bg-white/5 p-2.5 font-mono text-[0.8rem] break-all">
                {`${window.location.origin}/dancehall-101?school=${encodeURIComponent(me.school_slug)}&ref=${encodeURIComponent(me.code)}`}
              </div>
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#", "Ambassador", "School", "Signups"].map((h) => (
                  <th
                    key={h}
                    className="border-b px-2 py-2.5 text-left text-[0.75rem] font-normal tracking-[0.05em] uppercase"
                    style={{ borderColor: DH101_BORDER, color: "var(--school-secondary)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 py-2.5 text-[0.9rem]"
                    style={{ color: "#e08585" }}
                  >
                    Could not load leaderboard.
                  </td>
                </tr>
              ) : rows === null ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 py-2.5 text-[0.9rem]"
                    style={{ color: DH101_TEXT_DIM }}
                  >
                    Loading&hellip;
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 py-2.5 text-[0.9rem]"
                    style={{ color: DH101_TEXT_DIM }}
                  >
                    No ambassadors yet.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => {
                  const isYou = !!myCode && r.code === myCode;
                  return (
                    <tr key={r.ambassador_id} className={isYou ? "bg-white/[0.04]" : undefined}>
                      <td
                        className="border-b px-2 py-2.5 text-[0.9rem]"
                        style={{ borderColor: DH101_BORDER, color: DH101_TEXT_DIM }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="border-b px-2 py-2.5 text-[0.9rem]"
                        style={{ borderColor: DH101_BORDER }}
                      >
                        {r.display_name}
                        {isYou ? " (You)" : ""}
                      </td>
                      <td
                        className="border-b px-2 py-2.5 text-[0.9rem]"
                        style={{ borderColor: DH101_BORDER }}
                      >
                        {r.school_name}
                      </td>
                      <td
                        className="border-b px-2 py-2.5 text-[0.9rem]"
                        style={{ borderColor: DH101_BORDER }}
                      >
                        {r.signup_count}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Dh101Footer />
    </div>
  );
}
