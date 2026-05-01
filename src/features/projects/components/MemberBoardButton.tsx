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
      className={isStarted ? "h-11 px-3 py-3 text-sm" : "h-11 min-w-[200px] px-3 py-6 text-sm"}
    >
      {isStarted ? (
        "View Board"
      ) : (
        <>
          <WandSparkles size={20} />
          Generate Onboarding
        </>
      )}
    </Button>
  );
}
