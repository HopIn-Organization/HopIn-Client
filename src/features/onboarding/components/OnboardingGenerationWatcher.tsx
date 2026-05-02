import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '@/store/ui.store';
import { useOnboardingStatusQuery } from '@/features/onboarding/hooks/useOnboardingData';

export function OnboardingGenerationWatcher() {
  const { generatingOnboardingId, setGeneratingOnboardingId, setGeneratingForUserId } = useUiStore();
  const { data } = useOnboardingStatusQuery(generatingOnboardingId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handledStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!data) return;
    if (data.status === handledStatusRef.current) return;

    if (data.status === 'ready') {
      handledStatusRef.current = data.status;
      const onboardingId = generatingOnboardingId;
      setGeneratingOnboardingId(null);
      setGeneratingForUserId(null);
      queryClient.invalidateQueries({ queryKey: ['onboarding-plans'] });
      toast.success(
        (t) => (
          <span>
            Onboarding board is ready!{' '}
            <button
              className="font-semibold underline"
              onClick={() => {
                toast.dismiss(t.id);
                navigate(`/onboarding/plan/${onboardingId}`);
              }}
            >
              View Plan
            </button>
          </span>
        ),
        { duration: 8000 }
      );
    } else if (data.status === 'failed') {
      handledStatusRef.current = data.status;
      setGeneratingOnboardingId(null);
      setGeneratingForUserId(null);
      toast.error(
        `Onboarding generation failed${data.failureReason ? `: ${data.failureReason}` : ''}`,
        { duration: 8000 }
      );
    }
  }, [data, generatingOnboardingId, navigate, queryClient, setGeneratingOnboardingId]);

  return null;
}
