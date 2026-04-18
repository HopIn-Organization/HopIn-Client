import { useState } from "react";
import { Plus } from "lucide-react";
import { TechnologyChips } from "@/features/onboarding/components/TechnologyChips";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

interface CreateJobProps {
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function CreateJob({ jobTitle, onJobTitleChange, skills, onSkillsChange }: CreateJobProps) {
  const [skillInput, setSkillInput] = useState("");

  function handleAddSkill() {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      onSkillsChange(newSkills);
      setSkillInput("");
    }
  }

  function handleRemoveSkill(skill: string) {
    const newSkills = skills.filter((s) => s !== skill);
    onSkillsChange(newSkills);
  }

  function handleSkillInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  }
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.currentTarget.value)}
            label="Job Title"
            placeholder="e.g Fullstack Developer"
          />
          <label htmlFor="skillInput" className="block space-y-2 text-sm">
            <span className="text-xs font-medium text-text-secondary">Required Skills</span>
            <div className="flex gap-2">
              <input
                id="skillInput"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
                className="flex-1 h-11 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="e.g React, PostgreSQL"
              />
              <Button type="button" onClick={handleAddSkill} className="h-11 px-4">
                <Plus size={16} />
              </Button>
            </div>
          </label>
          <TechnologyChips items={skills} onRemove={handleRemoveSkill} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary">Documentation (Optional)</p>
          <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border bg-surface text-xs text-text-secondary">
            Click to upload files - coming soon!
          </div>
        </div>
      </div>
    </div>
  );
}
