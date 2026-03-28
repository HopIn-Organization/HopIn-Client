import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useStartRegistrationMutation } from "@/features/auth/hooks/useAuthMutations";
import { useRegistrationStore } from "@/store/registration.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function SignUpEmailPage() {
  const navigate = useNavigate();
  const setEmail = useRegistrationStore((state) => state.setEmail);
  const startRegistration = useStartRegistrationMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    await startRegistration.mutateAsync({ email });
    setEmail(email);
    navigate("/register/verify");
  }

  return (
    <AuthLayout title="Create an account" subtitle="Enter your email to start your onboarding journey">
      <Card className="p-8 shadow-soft">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <Input id="email" name="email" type="email" label="Email address" placeholder="name@company.com" required />
          <Button type="submit" className="h-14 w-full text-base" disabled={startRegistration.isPending}>
            {startRegistration.isPending ? "Sending..." : "Continue"}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
