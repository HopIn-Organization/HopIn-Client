import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useSetPasswordMutation } from "@/features/auth/hooks/useAuthMutations";
import { useRegistrationStore } from "@/store/registration.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function SetPasswordPage() {
  const navigate = useNavigate();
  const email = useRegistrationStore((state) => state.email);
  const setPasswordInStore = useRegistrationStore((state) => state.setPassword);
  const setPasswordMutation = useSetPasswordMutation();
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    await setPasswordMutation.mutateAsync({ email, password });
    setPasswordInStore(password);
    navigate("/register/profile");
  }

  return (
    <AuthLayout title="Create an account" subtitle="Enter your password" compact>
      <Card className="p-6 shadow-soft">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" required />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Re-enter Password" placeholder="••••••••" required />

          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

          <Button type="submit" className="mt-2 h-12 w-full" disabled={setPasswordMutation.isPending}>
            {setPasswordMutation.isPending ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
