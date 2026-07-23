// Shared by src/routes/contract-admin.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) -- see
// src/routes/README.md.
//
// Read-only list of signed performer contracts (talent_contracts), each
// with a link to re-download its PDF. Auth reuses the same comp_admins
// roster / is_comp_admin() RPC as /charly-black/comp-admin (see
// admin-list-contracts for why) -- sign in with the same email/password.
// No separate password-reset UI here; point people back at comp-admin's
// "Forgot password?" flow instead of duplicating it.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SITE_URL = "https://trcevent.com";

export function contractAdminHead() {
  return {
    meta: [
      { title: "Signed Contracts Admin | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contract-admin` }],
  };
}

type SignedContract = {
  id: string;
  act_name: string;
  role: string;
  performance_type: string;
  event_name: string;
  venue_name: string | null;
  performance_date: string | null;
  signer_full_legal_name: string;
  signer_business_name: string | null;
  signer_email: string;
  signer_phone: string;
  payment_methods: string[];
  payee_entity: string;
  payee_details: string | null;
  tax_form_acknowledged: boolean;
  additional_people_count: number;
  additional_people_notes: string | null;
  signature_typed_name: string;
  signed_at: string | null;
  pdf_url: string | null;
};

// supabase.functions.invoke() routes a non-2xx response into `error` rather
// than `data`, even when the function's JSON body has a perfectly good
// `.error` message (FunctionsHttpError carries the raw Response on
// `.context`). Without this, a non-2xx failure shows a generic fallback
// instead of the real reason.
async function extractFunctionErrorMessage(error: unknown): Promise<string | null> {
  if (!error || typeof error !== "object") return null;
  const context = (error as { context?: Response }).context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body && typeof body.error === "string") return body.error;
    } catch {
      // context body wasn't JSON -- fall through to error.message
    }
  }
  const message = (error as { message?: string }).message;
  return typeof message === "string" ? message : null;
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return "unknown";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "to be confirmed";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMsg("Enter both your email and password.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setMsg(`Error: ${error.message}`);
        return;
      }
      onSignedIn();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-2xl font-bold">Signed Contracts</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with the same email and password you use for the comp ticket admin page.
      </p>
      <form onSubmit={handleSignIn} className="mt-6 space-y-3 text-left">
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="gold" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Sign In
        </Button>
        {msg && <p className="text-sm text-destructive">{msg}</p>}
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        Forgot your password? Reset it from{" "}
        <a href="/charly-black/comp-admin" className="text-gold hover:underline">
          the comp admin sign-in
        </a>
        .
      </p>
    </div>
  );
}

function ContractCard({ c }: { c: SignedContract }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold">
          {c.act_name} <span className="font-normal text-muted-foreground">({c.role})</span>
        </h3>
        {c.pdf_url ? (
          <Button asChild size="sm" variant="goldOutline">
            <a href={c.pdf_url} target="_blank" rel="noreferrer">
              <Download className="size-4" /> PDF
            </a>
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">No PDF on file</span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {c.event_name}
        {c.venue_name ? ` — ${c.venue_name}` : ""} — {formatDate(c.performance_date)}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <div>
          <span className="text-xs uppercase">Signed by:</span> {c.signer_full_legal_name}
          {c.signer_business_name ? ` (${c.signer_business_name})` : ""}
        </div>
        <div>
          <span className="text-xs uppercase">Email:</span> {c.signer_email}
        </div>
        <div>
          <span className="text-xs uppercase">Phone:</span> {c.signer_phone}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <div>
          <span className="text-xs uppercase">Payment:</span> {c.payment_methods.join(", ")} to{" "}
          {c.payee_entity}
          {c.payee_details ? ` (${c.payee_details})` : ""}
        </div>
        <div>
          <span className="text-xs uppercase">W-9 acknowledged:</span>{" "}
          {c.tax_form_acknowledged ? "Yes" : "No / not required"}
        </div>
      </div>
      {c.additional_people_count > 0 && (
        <div className="mt-1 text-sm text-muted-foreground">
          <span className="text-xs uppercase">Additional people:</span> {c.additional_people_count}
          {c.additional_people_notes ? ` (${c.additional_people_notes})` : ""}
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        Signed {formatDateTime(c.signed_at)} as "{c.signature_typed_name}"
      </div>
    </div>
  );
}

export function ContractAdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<SignedContract[]>([]);
  const [search, setSearch] = useState("");

  async function handleSession(email: string | null) {
    setUserEmail(email);
    if (!email) {
      setIsAdmin(false);
      return;
    }
    const { data: adminCheck } = await supabase.rpc("is_comp_admin");
    setIsAdmin(!!adminCheck);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadContracts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list-contracts");
      if (error || data?.ok === false) {
        toast.error(
          data?.error ?? (await extractFunctionErrorMessage(error)) ?? "Couldn't load contracts.",
        );
        return;
      }
      setContracts(data.contracts ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadContracts();
  }, [isAdmin]);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (!userEmail) {
    return <SignIn onSignedIn={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-xl font-bold">Not Authorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as <strong className="text-foreground">{userEmail}</strong>, but that
          email isn't on the admin roster.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  const filtered = contracts.filter((c) =>
    `${c.act_name} ${c.event_name} ${c.signer_full_legal_name}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold">Signed Performer Contracts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {userEmail}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Input
          placeholder="Search by act, event, or signer name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline" size="sm" onClick={loadContracts} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {contracts.length === 0
              ? "No contracts signed yet."
              : "No contracts match that search."}
          </p>
        )}
        {filtered.map((c) => (
          <ContractCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
