import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useLoginMutation, useLoginWithGoogleMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const loginMutation = useLoginMutation();
  const googleMutation = useLoginWithGoogleMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const user = await loginMutation.mutateAsync({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    signIn(user);
    navigate("/projects");
  }

  async function handleGoogleSignIn() {
    const user = await googleMutation.mutateAsync();
    signIn(user);
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
          <Input id="email" name="email" type="email" label="Email address" placeholder="name@company.com" required />
          <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" required />

          <Button type="submit" className="mt-2 h-14 w-full text-base" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in with Email"}
          </Button>
        </form>

        <div className="my-8 flex items-center gap-4 text-base text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          <span>Or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="h-14 w-full text-base" onClick={handleGoogleSignIn}>
          <span className="text-xl leading-none">G</span>
          Google
        </Button>
      </Card>
    </AuthLayout>
  );
}
