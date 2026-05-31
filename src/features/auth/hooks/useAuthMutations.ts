import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: authService.register });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: authService.logout });
}

export function useStartRegistrationMutation() {
  return useMutation({ mutationFn: async (payload: { email: string }) => { void payload; } });
}

export function useLoginWithGoogleMutation() {
  return useMutation({
    mutationFn: ({ token, mode }: { token: string; mode: 'register' | 'login' }) =>
      authService.googleLogin(token, mode),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; code: string }) => {
      void payload;
    },
  });
}

export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      void payload;
    },
  });
}
