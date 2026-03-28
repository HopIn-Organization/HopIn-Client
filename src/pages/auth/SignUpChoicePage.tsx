import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useLoginWithGoogleMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

export function SignUpChoicePage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const googleMutation = useLoginWithGoogleMutation();

  async function handleGoogleSignUp() {
    await googleMutation.mutateAsync();
    signIn();
    navigate("/projects");
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Choose how you want to get started"
      footerText="Already have an account?"
      footerActionText="Sign in"
      footerActionHref="/login"
    >
      <Card className="p-8 shadow-soft">
        <Button variant="outline" className="h-14 w-full text-base" onClick={handleGoogleSignUp}>
          <span className="text-xl leading-none">G</span>
          Sign up with Google
        </Button>

        <div className="my-8 flex items-center gap-4 text-base text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          <span>Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link to="/register/email" className="block">
          <Button className="h-14 w-full text-base">
            <Mail size={18} />
            Sign up with Email
          </Button>
        </Link>
      </Card>
    </AuthLayout>
  );
}
