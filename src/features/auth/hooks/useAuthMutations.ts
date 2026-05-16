import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";
import { profileApiGateway } from "@/features/profile/services/profile.api";
import type { CompleteProfilePayload } from "@/types/auth";

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: authService.register });
}

export function useCompleteProfileMutation() {
  return useMutation({
    mutationFn: ({ fullName, birthDate, keySkills, workExperience }: CompleteProfilePayload) =>
      profileApiGateway.updateProfile({ fullName, birthDate, keySkills, workExperience }),
  });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: authService.logout });
}

export function useStartRegistrationMutation() {
  return useMutation({ mutationFn: async (_payload: { email: string }) => {} });
}

export function useLoginWithGoogleMutation() {
  return useMutation({
    mutationFn: ({ token, mode }: { token: string; mode: 'register' | 'login' }) =>
      authService.googleLogin(token, mode),
  });
}
