import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";

export function LoginPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUserEmail = useAuthStore((state) => state.setCurrentUserEmail);
  const loginMutation = useLoginMutation();
  const googleMutation = useLoginWithGoogleMutation();
  const [googleError, setGoogleError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "");
    try {
      const { accessToken } = await loginMutation.mutateAsync({
        email,
        password: String(formData.get("password") ?? ""),
      });

      setAccessToken(accessToken);
      setCurrentUserEmail(email);
      navigate("/projects");
    } catch {}
  }

  return (
    <AuthLayout
      title="Hop back in"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerActionText="Sign up"
      footerActionHref="/register"
    >
      <Card className="px-10 py-8 shadow-soft">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="name@company.com"
            required
            className="h-12 text-base"
            labelClassName="text-sm"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            className="h-12 text-base"
            labelClassName="text-sm"
          />

          {loginMutation.isError && (
            <p className="text-sm text-red-500">Login failed. Please try again.</p>
          )}

          <Button
            type="submit"
            className="mt-4 h-12 w-full text-base"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4 text-sm text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          <span>Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (!credentialResponse.credential) return;
              setGoogleError("");
              googleMutation.mutate(
                { token: credentialResponse.credential, mode: "login" },
                {
                  onSuccess: (data) => {
                    setAccessToken(data.accessToken);
                    setCurrentUserEmail(data.user.email);
                    navigate("/projects");
                  },
                  onError: (err) => setGoogleError(err.message ?? "Google login failed"),
                },
              );
            }}
            onError={() => setGoogleError("Google login failed")}
          />
        </div>
        {googleError && <p className="mt-2 text-sm text-red-500 text-center">{googleError}</p>}
      </Card>
    </AuthLayout>
  );
}
