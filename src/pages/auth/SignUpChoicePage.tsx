import { useState } from "react";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useLoginWithGoogleMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

export function SignUpChoicePage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const signIn = useAuthStore((state) => state.signIn);
  const googleMutation = useLoginWithGoogleMutation();
  const [googleError, setGoogleError] = useState('');

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Choose how you want to get started"
      footerText="Already have an account?"
      footerActionText="Sign in"
      footerActionHref="/login"
    >
      <Card className="p-8 shadow-soft">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (!credentialResponse.credential) return;
              setGoogleError('');
              googleMutation.mutate(
                { token: credentialResponse.credential, mode: 'register' },
                {
                  onSuccess: (data) => {
                    setAccessToken(data.accessToken);
                    signIn({ email: data.user.email });
                    navigate('/register/profile');
                  },
                  onError: (err) => setGoogleError(err.message ?? 'Google sign up failed'),
                }
              );
            }}
            onError={() => setGoogleError('Google sign up failed')}
          />
        </div>
        {googleError && <p className="mt-2 text-sm text-red-500 text-center">{googleError}</p>}

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
