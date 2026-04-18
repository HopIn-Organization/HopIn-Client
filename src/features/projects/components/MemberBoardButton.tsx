import { WandSparkles } from "lucide-react";
import { Button } from "@/ui/Button";

interface MemberBoardButtonProps {
  progress: number;
}

export function MemberBoardButton({ progress }: MemberBoardButtonProps) {
  const isStarted = progress > 0;

  return (
    <Button
      type="button"
      variant={isStarted ? "outline" : "primary"}
      className={isStarted ? "h-9 px-4 text-xs" : "h-9 min-w-[156px] px-5 text-xs"}
    >
      {isStarted ? (
        "View Board"
      ) : (
        <>
          <WandSparkles size={12} />
          Generate Onboarding
        </>
      )}
    </Button>
  );
}
