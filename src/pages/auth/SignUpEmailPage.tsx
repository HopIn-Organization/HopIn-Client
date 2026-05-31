import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useRegisterMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { useRegistrationStore } from "@/store/registration.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function SignUpEmailPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUserEmail = useAuthStore((state) => state.setCurrentUserEmail);
  const setEmail = useRegistrationStore((state) => state.setEmail);
  const registerMutation = useRegisterMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const { accessToken } = await registerMutation.mutateAsync({ email, password });
      setAccessToken(accessToken);
      setCurrentUserEmail(email);
      setEmail(email);
      navigate("/register/profile");
    } catch {
      // handled by mutation error state
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your details to get started"
      footerText="Already have an account?"
      footerActionText="Sign in"
      footerActionHref="/login"
    >
      <Card className="p-8 shadow-soft">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input id="email" name="email" type="email" label="Email address" placeholder="name@company.com" required />
          <Input id="password" name="password" type="password" label="Password" placeholder="At least 6 characters" required />

          {registerMutation.isError && (
            <p className="text-sm text-red-500">
              {registerMutation.error instanceof Error ? registerMutation.error.message : "Registration failed. Please try again."}
            </p>
          )}

          <Button type="submit" className="h-14 w-full text-base" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
