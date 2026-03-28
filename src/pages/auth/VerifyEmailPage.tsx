import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useStartRegistrationMutation, useVerifyEmailMutation } from "@/features/auth/hooks/useAuthMutations";
import { useRegistrationStore } from "@/store/registration.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

const CODE_LENGTH = 6;

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const email = useRegistrationStore((state) => state.email);
  const setEmailVerified = useRegistrationStore((state) => state.setEmailVerified);
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useStartRegistrationMutation();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");

  function updateDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = cleaned;
      return next;
    });

    if (cleaned && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await verifyMutation.mutateAsync({
      email,
      code,
    });

    setEmailVerified(true);
    navigate("/register/password");
  }

  async function handleResend() {
    if (!email) return;
    await resendMutation.mutateAsync({ email });
  }

  return (
    <AuthLayout title="Check your email" subtitle="We sent a verification code to your email. Enter it below to verify your identity." compact>
      <div className="mb-4 flex justify-center text-success">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#DDF7F4]">
          <MailCheck size={22} />
        </span>
      </div>

      <Card className="p-6 shadow-soft">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <p className="mb-2 text-left text-xs font-semibold text-text-primary">Verification Code</p>
            <div className="flex items-center gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  className="h-12 w-11 rounded-lg border border-border bg-surface text-center text-lg text-text-primary outline-none focus:border-primary"
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="h-12 w-full" disabled={verifyMutation.isPending || code.length < CODE_LENGTH}>
            {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          </Button>

          <p className="text-sm text-text-secondary">
            Didn’t receive the code?{" "}
            <button type="button" onClick={handleResend} className="font-medium text-primary" disabled={resendMutation.isPending}>
              Resend
            </button>
          </p>

          {!email && (
            <p className="text-sm text-text-secondary">
              Missing email context. <Link to="/register/email" className="text-primary">Go back</Link>
            </p>
          )}
        </form>
      </Card>
    </AuthLayout>
  );
}
