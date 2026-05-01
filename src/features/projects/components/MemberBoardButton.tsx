import { useState } from "react";
import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/ui/Button";
import { Modal } from "@/ui/Modal";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { Job } from "@/types/job";

export interface GenerateOnboardingParams {
  daysDuration: number;
  jobId: number;
}

interface MemberBoardButtonProps {
  hasOnboarding: boolean;
  employeeName: string;
  jobs: Job[];
  defaultJobId?: number | undefined;
  onGenerate?: (params: GenerateOnboardingParams) => void;
  onViewBoard?: () => void;
  isGenerating?: boolean;
}

export function MemberBoardButton({
  hasOnboarding,
  employeeName,
  jobs,
  defaultJobId,
  onGenerate,
  onViewBoard,
  isGenerating,
}: MemberBoardButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [daysDuration, setDaysDuration] = useState<string>("14");
  const [jobId, setJobId] = useState<number | "">(defaultJobId ?? "");

  function handleSubmit() {
    const days = Number(daysDuration);
    const job = Number(jobId);
    if (!days || !job) return;
    setIsOpen(false);
    onGenerate?.({ daysDuration: days, jobId: job });
  }

  if (hasOnboarding) {
    return (
      <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={onViewBoard}>
        View Board
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className="h-11 min-w-[200px] px-3 py-6 text-sm"
        onClick={() => setIsOpen(true)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <WandSparkles size={18} />
            Generate Onboarding
          </>
        )}
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Generate onboarding for ${employeeName}`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="days-duration"
              label="Onboarding Duration (days)"
              type="number"
              min={1}
              placeholder="e.g 14"
              value={daysDuration}
              onChange={(e) => setDaysDuration(e.target.value)}
            />
            <Select
              id="job"
              label="Job Type"
              value={jobId}
              onChange={(e) => setJobId(Number(e.target.value))}
            >
              <option value="" disabled>Choose job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </Select>
          </div>
          <Button
            type="button"
            variant="primary"
            className="h-14 w-full rounded-full text-base"
            onClick={handleSubmit}
          >
            <WandSparkles size={18} />
            Generate Onboarding
          </Button>
        </div>
      </Modal>
    </>
  );
}
