// Shared by src/routes/dancehall-101_.ticket.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) -- see
// src/routes/README.md. The trailing underscore in the route file's name
// opts this route out of nesting under dancehall-101.tsx -- see
// -charly-black-comp-page.tsx for why that matters.
//
// Migrated from selassiefest.com/dancehall101/ticket.html -- shows the
// branded digital ticket (QR + redemption code) a student gets after
// verifying their .edu email via dh101_verify_and_get_ticket. Reached from
// the verification email's link (see formatDh101VerificationEmail in the
// selassiefest repo's notify-submission function) -- that link still points
// at selassiefest.com/dancehall101/ticket.html until it's cut over.
import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { verifyDh101Ticket, type Dh101Ticket } from "@/lib/dancehall101";
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

export function dancehall101TicketHead() {
  return {
    meta: [
      { title: "Your Dancehall 101 Ticket" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dancehall-101/ticket` }, ...DH101_FONT_LINKS],
  };
}

function LoadingOrMessage({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <h1 className="font-[Anton] text-3xl uppercase">{title}</h1>
      {sub && (
        <p className="mx-auto mt-3.5 max-w-[560px]" style={{ color: DH101_TEXT_DIM }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function TicketCard({ t }: { t: Dh101Ticket }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!t.ticket_id) return;
    QRCode.toDataURL(`${t.ticket_id} ${t.redemption_code}`, { width: 180, margin: 1 })
      .then(setQrDataUrl)
      .catch((err) => console.error("QR generation failed:", err));
  }, [t.ticket_id, t.redemption_code]);

  useEffect(() => {
    document.title = `Your Dancehall 101 Ticket — ${t.school_name}`;
  }, [t.school_name]);

  const schoolLike = {
    logo_url: t.school_logo_url,
    logo_bg: (t.school_logo_bg as "light" | "dark") ?? "light",
    short_code: (t.ticket_id ?? "").split("-")[0],
    name: t.school_name ?? "",
  };

  return (
    <div className="mx-auto max-w-[460px] px-5 pt-8 pb-15">
      <div
        className="overflow-hidden rounded-[20px] border"
        style={{ borderColor: DH101_BORDER, background: DH101_CARD }}
      >
        <div
          className="px-6 pt-6.5 pb-5.5 text-center text-white"
          style={{
            background:
              "linear-gradient(160deg, var(--school-primary), color-mix(in srgb, var(--school-primary) 60%, black))",
          }}
        >
          <div className="font-[Anton] text-base tracking-[0.1em] opacity-85">
            DANCEHALL 101 &mdash; LESSONS IN DANCEHALL CULTURE
          </div>
          <SchoolWordmark school={schoolLike} size="lg" />
          <h1 className="font-[Anton] text-2xl uppercase">{t.school_mascot || t.school_name}</h1>
          {t.school_mascot && (
            <div className="mt-0.5 text-[0.78rem] opacity-85">{t.school_name}</div>
          )}
          <div className="mt-0.5 text-[0.78rem] opacity-85">{t.school_slug} Edition</div>
          <div className="mt-3.5 text-[0.68rem] tracking-[0.08em] uppercase opacity-90">
            Uptown Lounge &middot; Wednesday Nights &middot; Chicago&rsquo;s #1 Dancehall Experience
            &middot; 21+ Event
          </div>
          <div className="mt-3.5 rounded-[10px] bg-black/25 px-3.5 py-2.5 text-[0.82rem] font-semibold">
            Your Exclusive FREE TICKET &mdash; Presented exclusively to {t.school_name} Students
            (21+)
          </div>
        </div>

        <div className="px-6 pt-6 pb-7 text-center">
          <ul
            className="mb-5.5 grid grid-cols-2 gap-2.5 text-left text-[0.82rem]"
            style={{ color: DH101_TEXT_DIM }}
          >
            {[
              "Live DJs & MCs",
              'Dance Lessons "Outta Yawd"',
              "Drink Specials",
              "VIP Giveaways",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <span style={{ color: "var(--school-secondary)" }}>&#10022;</span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mx-auto mb-2 size-[180px] overflow-hidden rounded-[10px]">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Scan for door access" className="size-full" />
            ) : null}
          </div>
          <div
            className="text-[0.72rem] font-bold tracking-[0.15em] uppercase"
            style={{ color: "var(--school-secondary)" }}
          >
            Scan for Access
          </div>
          <div className="mb-5 mt-1.5 font-mono text-[1.1rem] tracking-[0.15em]">
            {t.redemption_code}
          </div>

          <div
            className="grid grid-cols-2 gap-3 border-t pt-4 text-left"
            style={{ borderColor: DH101_BORDER }}
          >
            <div>
              <div
                className="text-[0.68rem] tracking-[0.06em] uppercase"
                style={{ color: DH101_TEXT_DIM }}
              >
                Ticket ID
              </div>
              <div className="text-[0.9rem] font-semibold">{t.ticket_id}</div>
            </div>
            <div>
              <div
                className="text-[0.68rem] tracking-[0.06em] uppercase"
                style={{ color: DH101_TEXT_DIM }}
              >
                Campaign
              </div>
              <div className="text-[0.9rem] font-semibold">{t.campaign_code || "—"}</div>
            </div>
            <div>
              <div
                className="text-[0.68rem] tracking-[0.06em] uppercase"
                style={{ color: DH101_TEXT_DIM }}
              >
                Student Segment
              </div>
              <div className="text-[0.9rem] font-semibold">{t.student_segment || "—"}</div>
            </div>
            <div>
              <div
                className="text-[0.68rem] tracking-[0.06em] uppercase"
                style={{ color: DH101_TEXT_DIM }}
              >
                Name
              </div>
              <div className="text-[0.9rem] font-semibold">{t.full_name}</div>
            </div>
          </div>

          <div
            className="mt-5 border-t pt-4 text-[0.78rem]"
            style={{ borderColor: DH101_BORDER, color: DH101_TEXT_DIM }}
          >
            {t.school_name} Takes Wednesdays &middot; Uptown Lounge, Chicago IL
          </div>
        </div>
      </div>
      <p
        className="mx-auto mt-4.5 max-w-[460px] px-1 text-center text-[0.85rem]"
        style={{ color: DH101_TEXT_DIM }}
      >
        Save this page &mdash; show it at the door. Bring a physical photo ID (21+).
      </p>
    </div>
  );
}

export function Dancehall101TicketPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [result, setResult] = useState<Dh101Ticket | null | "error" | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
  }, []);

  useEffect(() => {
    if (token === undefined) return;
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    verifyDh101Ticket(token)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch((err) => {
        console.error("Ticket verification failed:", err);
        if (!cancelled) setResult("error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  let body: React.ReactNode;
  if (token === undefined || loading) {
    body = <LoadingOrMessage title="Verifying…" />;
  } else if (!token) {
    body = (
      <LoadingOrMessage
        title="Missing Ticket Link"
        sub="This page needs a valid ticket link from your confirmation email."
      />
    );
  } else if (result === "error" || !result || result.status === "not_found") {
    body = (
      <LoadingOrMessage
        title="Ticket Not Found"
        sub="We couldn't find a signup matching this link."
      />
    );
  } else if (result.status === "expired") {
    body = (
      <LoadingOrMessage
        title="Link Expired"
        sub="This verification link has expired. Please sign up again at Dancehall 101."
      />
    );
  } else {
    body = <TicketCard t={result} />;
  }

  const school =
    result && result !== "error"
      ? { color_primary: result.color_primary, color_secondary: result.color_secondary }
      : null;

  return (
    <div
      className="w-full"
      style={{ background: DH101_BG, color: DH101_TEXT, ...dh101Vars(school) }}
    >
      <Dh101Topbar tagline="Lessons in Dancehall Culture" />
      <main>{body}</main>
      <Dh101Footer />
    </div>
  );
}
