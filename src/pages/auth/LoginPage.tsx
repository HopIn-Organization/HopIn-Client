import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useLoginMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";

export function LoginPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const loginMutation = useLoginMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const { accessToken } = await loginMutation.mutateAsync({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    setAccessToken(accessToken);
    navigate("/projects");
  }

  return (
    <AuthLayout
      title="Hop back in"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerActionText="Sign up"
      footerActionHref="/register"
    >
      <Card className="p-8 shadow-soft">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="name@company.com"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
          />

          {loginMutation.isError && (
            <p className="text-sm text-red-500">Login failed. Please try again.</p>
          )}

          <Button
            type="submit"
            className="mt-2 h-14 w-full text-base"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
