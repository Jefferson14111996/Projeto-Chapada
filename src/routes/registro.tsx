import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Mail, KeyRound, CheckCircle2, XCircle, Info, User } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, ChapadaLogo } from "@/components/AuthLayout";
import { LightInput, FieldLabel } from "./login";
import { isAllowedEmail, DOMAIN_ERROR } from "@/lib/auth-domain";
import { setProfile, capitalize } from "@/lib/profileStore";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Cadastro — CHAPADA" }] }),
  component: RegistroPage,
});

type Step = "email" | "code" | "password" | "done";
const DEMO_CODE = "123456";

function RegistroPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const trimmed = email.trim().toLowerCase();
    if (!isAllowedEmail(trimmed)) {
      setEmailError(DOMAIN_ERROR);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setEmail(trimmed);
      setStep("code");
      setSubmitting(false);
      toast.success("Código enviado!");
    }, 400);
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== DEMO_CODE) {
      toast.error("Código inválido.");
      return;
    }
    setStep("password");
  };

  const match = pwd.length >= 8 && pwd === pwd2;
  const canCreate = firstName.trim() && lastName.trim() && match;

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    setSubmitting(true);
    setTimeout(() => {
      setProfile(email, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: pwd,
      });
      setSubmitting(false);
      setStep("done");
    }, 500);
  };

  useEffect(() => {
    if (step !== "done") return;
    const t = setTimeout(() => navigate({ to: "/login", search: { msg: "registered" } }), 3000);
    return () => clearTimeout(t);
  }, [step, navigate]);

  const leftMessage =
    step === "email"
      ? "Cadastre seu e-mail institucional para começar."
      : step === "code"
      ? "Insira o código de 6 dígitos enviado para seu e-mail."
      : step === "password"
      ? "Complete seus dados e crie uma senha segura."
      : "Tudo pronto! Redirecionando…";

  return (
    <AuthLayout
      left={
        <div className="flex flex-col items-center gap-6">
          <ChapadaLogo />
          <p className="max-w-xs text-center text-sm text-white/90">
            Cadastro restrito a colaboradores com e-mail{" "}
            <span style={{ color: "#F5A623" }}>@ongchapada.org.br</span>
          </p>
          <p className="max-w-xs text-center text-xs text-white/80">{leftMessage}</p>
          <Link
            to="/login"
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 hover:underline"
          >
            ← Voltar para login
          </Link>
        </div>
      }
      right={
        <>
          {step === "email" && (
            <form onSubmit={sendCode} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: "#1A9FD4" }}>
                  Criar conta
                </h2>
                <p className="mt-1 text-sm" style={{ color: "#6B8A9A" }}>
                  Informe seu e-mail institucional para começar.
                </p>
              </div>
              <div>
                <FieldLabel htmlFor="email">E-mail institucional</FieldLabel>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#6B8A9A" }}
                  />
                  <LightInput
                    id="email"
                    type="email"
                    placeholder="seu.nome@ongchapada.org.br"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    className="pl-10"
                    required
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-xs font-medium" style={{ color: "#d64545" }}>
                    {emailError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviar código
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: "#1A9FD4" }}>
                  Verificar código
                </h2>
              </div>

              <div
                className="flex items-start gap-3 rounded-lg border p-3 text-sm"
                style={{ backgroundColor: "#EAF4FB", borderColor: "#1A9FD4", color: "#1A3A4A" }}
              >
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#1A9FD4" }} />
                <p>
                  ✉️ Um código de 6 dígitos foi enviado para{" "}
                  <strong>{email}</strong>. Verifique sua caixa de entrada.
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="code">Código de verificação</FieldLabel>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#6B8A9A" }}
                  />
                  <LightInput
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="pl-10 text-center text-lg font-semibold tracking-[0.5em]"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                Verificar código
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="block w-full text-center text-xs hover:underline"
                style={{ color: "#6B8A9A" }}
              >
                Usar outro e-mail
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={createAccount} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: "#1A9FD4" }}>
                  Complete seu cadastro
                </h2>
                <p className="mt-1 text-sm" style={{ color: "#6B8A9A" }}>
                  Informe seus dados e crie uma senha de acesso.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "#6B8A9A" }}
                    />
                    <LightInput
                      id="firstName"
                      placeholder="Ex: Maria"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
                  <LightInput
                    id="lastName"
                    placeholder="Ex: Conceição"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="pwd">Nova senha</FieldLabel>
                <div className="relative">
                  <LightInput
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
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#6B8A9A" }}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="pwd2">Confirmar nova senha</FieldLabel>
                <LightInput
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
                        <XCircle className="h-3.5 w-3.5" style={{ color: "#d64545" }} />
                        <span style={{ color: "#d64545" }}>
                          {pwd.length < 8 ? "Mínimo de 8 caracteres" : "As senhas não coincidem"}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!canCreate || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: "#1A9FD4" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar minha conta
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                style={{ backgroundColor: "rgba(76,175,80,0.15)" }}
              >
                <CheckCircle2 className="h-7 w-7" style={{ color: "#4CAF50" }} />
              </div>
              <h2 className="font-display text-xl font-bold" style={{ color: "#1A9FD4" }}>
                ✅ Conta criada com sucesso!
              </h2>
              <p className="text-sm" style={{ color: "#1A3A4A" }}>
                Bem-vindo(a), <strong>{capitalize(firstName)} {capitalize(lastName)}</strong>!
              </p>
              <p className="text-xs" style={{ color: "#6B8A9A" }}>
                Redirecionando para o login em alguns segundos…
              </p>
              <Link
                to="/login"
                className="inline-block text-xs font-medium hover:underline"
                style={{ color: "#1A9FD4" }}
              >
                Ir para o login agora
              </Link>
            </div>
          )}
        </>
      }
    />
  );
}
