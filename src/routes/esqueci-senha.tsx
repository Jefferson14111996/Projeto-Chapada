import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Mail, KeyRound, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, ChapadaLogo } from "@/components/AuthLayout";
import { DarkInput, FieldLabel } from "./login";
import { isAllowedEmail, DOMAIN_ERROR } from "@/lib/auth-domain";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({ meta: [{ title: "Recuperar senha — CHAPADA" }] }),
  component: EsqueciSenhaPage,
});

type Step = "email" | "code" | "password";

function EsqueciSenhaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const trimmed = email.trim().toLowerCase();
    if (!isAllowedEmail(trimmed)) {
      setEmailError(DOMAIN_ERROR);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/esqueci-senha`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Código enviado! Verifique seu e-mail.");
    setEmail(trimmed);
    setStep("code");
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("O código deve ter 6 dígitos.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Código inválido ou expirado.");
      return;
    }
    setStep("password");
  };

  const match = pwd.length >= 8 && pwd === pwd2;

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      setSubmitting(false);
      toast.error(error.message);
      return;
    }
    await supabase.auth.signOut();
    setSubmitting(false);
    navigate({ to: "/login", search: { msg: "password_reset" } });
  };

  return (
    <AuthLayout
      left={
        <div className="flex flex-col items-center gap-6">
          <ChapadaLogo />
          <p className="max-w-xs text-center text-sm text-white/70">
            {step === "email" && "Enviaremos um código de 6 dígitos para o seu e-mail institucional."}
            {step === "code" && "Insira o código que enviamos para o seu e-mail."}
            {step === "password" && "Escolha uma nova senha de acesso."}
          </p>
          <Link to="/login" className="text-xs font-medium text-white/70 hover:underline">
            ← Voltar para login
          </Link>
        </div>
      }
      right={
        <>
          {step === "email" && (
            <form onSubmit={sendCode} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Recuperar senha</h2>
                <p className="mt-1 text-sm text-white/60">Informe seu e-mail cadastrado.</p>
              </div>
              <div>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <DarkInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                    placeholder="seu.nome@ongchapada.org.br"
                    className="pl-10"
                    required
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-xs font-medium" style={{ color: "#ff8a8a" }}>{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviar código de recuperação
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Insira o código</h2>
                <p className="mt-1 text-sm text-white/60">
                  Código de 6 dígitos enviado para <strong className="text-white">{email}</strong>.
                </p>
              </div>
              <div>
                <FieldLabel htmlFor="code">Código de verificação</FieldLabel>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <DarkInput
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="pl-10 text-center tracking-[0.5em] text-lg font-semibold"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Validar código
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="block w-full text-center text-xs text-white/60 hover:underline"
              >
                Não recebeu? Reenviar código
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={savePassword} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Nova senha</h2>
                <p className="mt-1 text-sm text-white/60">Escolha uma senha segura.</p>
              </div>
              <div>
                <FieldLabel htmlFor="pwd">Nova senha</FieldLabel>
                <div className="relative">
                  <DarkInput
                    id="pwd"
                    type={show ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="pwd2">Confirmar nova senha</FieldLabel>
                <DarkInput
                  id="pwd2"
                  type={show ? "text" : "password"}
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  minLength={8}
                  required
                />
                {pwd2.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {match ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#4CAF50" }} />
                        <span style={{ color: "#4CAF50" }}>As senhas coincidem</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" style={{ color: "#ff8a8a" }} />
                        <span style={{ color: "#ff8a8a" }}>
                          {pwd.length < 8 ? "Mínimo de 8 caracteres" : "As senhas não coincidem"}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!match || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar nova senha
              </button>
            </form>
          )}
        </>
      }
    />
  );
}
