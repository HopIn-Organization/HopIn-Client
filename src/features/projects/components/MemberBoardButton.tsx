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
  progress: number;
  employeeName: string;
  jobs: Job[];
  defaultJobId?: number | undefined;
  onGenerate?: (params: GenerateOnboardingParams) => void;
  isGenerating?: boolean;
}

export function MemberBoardButton({
  progress,
  employeeName,
  jobs,
  defaultJobId,
  onGenerate,
  isGenerating,
}: MemberBoardButtonProps) {
  const isStarted = progress > 0;
  const [isOpen, setIsOpen] = useState(false);
  const [daysDuration, setDaysDuration] = useState(30);
  const [jobId, setJobId] = useState<number>(defaultJobId ?? jobs[0]?.id ?? 1);

  function handleSubmit() {
    setIsOpen(false);
    onGenerate?.({ daysDuration, jobId });
  }

  if (isStarted) {
    return (
      <Button type="button" variant="outline" className="h-9 px-4 text-xs">
        View Board
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className="h-9 min-w-[156px] px-5 text-xs"
        onClick={() => setIsOpen(true)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <WandSparkles size={12} />
            Generate Onboarding
          </>
        )}
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Generate Onboarding for - ${employeeName}`}
      >
        <div className="space-y-4">
          <Input
            id="days-duration"
            label="Onboarding Duration (days)"
            type="number"
            min={1}
            value={daysDuration}
            onChange={(e) => setDaysDuration(Number(e.target.value))}
          />
          <Select
            id="job"
            label="Job"
            value={jobId}
            onChange={(e) => setJobId(Number(e.target.value))}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </Select>
          <div className="pt-2">
            <Button type="button" variant="primary" className="w-full" onClick={handleSubmit}>
              <WandSparkles size={14} />
              Generate Onboarding
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
