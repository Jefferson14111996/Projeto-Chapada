import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, ChapadaLogo } from "@/components/AuthLayout";
import { DarkInput, FieldLabel } from "./login";
import { isAllowedEmail, DOMAIN_ERROR } from "@/lib/auth-domain";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Cadastro — CHAPADA" }] }),
  component: RegistroPage,
});

function RegistroPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!isAllowedEmail(trimmed)) {
      setError(DOMAIN_ERROR);
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/criar-senha`,
      },
    });
    setSubmitting(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      left={
        <div className="flex flex-col items-center gap-6">
          <ChapadaLogo />
          <p className="max-w-xs text-center text-sm text-white/70">
            Cadastro restrito a colaboradores com e-mail{" "}
            <span style={{ color: "#F5A623" }}>@ongchapada.org.br</span>
          </p>
          <Link
            to="/login"
            className="text-xs font-medium text-white/70 hover:underline"
          >
            ← Voltar para login
          </Link>
        </div>
      }
      right={
        sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: "rgba(76,175,80,0.15)" }}>
              <CheckCircle2 className="h-7 w-7" style={{ color: "#4CAF50" }} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Confirmação enviada!</h2>
            <p className="text-sm text-white/70">
              Enviamos um link de confirmação para <strong className="text-white">{email}</strong>.
              Abra o e-mail e clique no link para criar sua senha.
            </p>
            <Link
              to="/login"
              className="inline-block text-xs font-medium hover:underline"
              style={{ color: "#F5A623" }}
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Criar conta</h2>
              <p className="mt-1 text-sm text-white/60">
                Informe seu e-mail institucional para começar.
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="email">E-mail institucional</FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <DarkInput
                  id="email"
                  type="email"
                  placeholder="seu.nome@ongchapada.org.br"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="pl-10"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-xs font-medium" style={{ color: "#ff8a8a" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "#1A9FD4" }}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar confirmação
            </button>
          </form>
        )
      }
    />
  );
}
