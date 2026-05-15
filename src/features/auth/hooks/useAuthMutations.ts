import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: authService.logout });
}
