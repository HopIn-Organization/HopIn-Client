import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login });
}

export function useLoginWithGoogleMutation() {
  return useMutation({ mutationFn: authService.loginWithGoogle });
}

export function useStartRegistrationMutation() {
  return useMutation({ mutationFn: authService.startRegistration });
}

export function useVerifyEmailMutation() {
  return useMutation({ mutationFn: authService.verifyEmail });
}

export function useSetPasswordMutation() {
  return useMutation({ mutationFn: authService.setPassword });
}

export function useCompleteProfileMutation() {
  return useMutation({ mutationFn: authService.completeProfile });
}
