import { useCallback, useRef, useState } from "react";
import { FileText, Plus, Trash2, Upload, X } from "lucide-react";
import { TechnologyChips } from "@/features/onboarding/components/TechnologyChips";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { ProjectDocument } from "@/types/document";
import {
  ACCEPTED_EXTENSIONS,
  isAcceptedDocument,
} from "@/features/projects/utils/documentValidation";

const MAX_JOB_FILES = 10;

interface CreateJobProps {
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onRemove?: () => void;
  pendingFiles?: File[];
  onAddFiles?: (files: File[]) => void;
  onRemovePendingFile?: (index: number) => void;
  existingDocuments?: ProjectDocument[];
  onDeleteExistingDocument?: (documentId: number) => void;
}

export function CreateJob({
  jobTitle,
  onJobTitleChange,
  skills,
  onSkillsChange,
  onRemove,
  pendingFiles = [],
  onAddFiles,
  onRemovePendingFile,
  existingDocuments = [],
  onDeleteExistingDocument,
}: CreateJobProps) {
  const [skillInput, setSkillInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingDocuments.length + pendingFiles.length;
  const remainingSlots = MAX_JOB_FILES - totalCount;

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !onAddFiles) return;
      const validFiles = Array.from(fileList).filter((f) => isAcceptedDocument(f));
      const toAdd = validFiles.slice(0, remainingSlots);
      if (toAdd.length > 0) {
        onAddFiles(toAdd);
      }
    },
    [remainingSlots, onAddFiles],
  );

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

  function handleJobTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="rounded-xl border border-border bg-surface-muted p-4">
      <div className="mb-4 flex justify-end">
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-text-secondary transition hover:text-text-primary"
            aria-label="Remove job"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.currentTarget.value)}
            onKeyDown={handleJobTitleKeyDown}
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
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-text-secondary">Documentation (Optional)</p>
            <span className="text-[10px] text-text-secondary">
              {totalCount}/{MAX_JOB_FILES}
            </span>
          </div>

          {/* Drop zone */}
          {remainingSlots > 0 && onAddFiles && (
            <div
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed p-4 transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload job documents"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
            >
              <Upload size={16} className="text-text-secondary" />
              <p className="text-[11px] text-text-secondary">Drop files or click to browse</p>
              <p className="text-[10px] text-text-secondary">
                .txt, .md, .csv, .pdf, .json, .doc, .docx
              </p>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED_EXTENSIONS}
                multiple
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          )}

          {/* Existing documents */}
          {existingDocuments.length > 0 && (
            <ul className="space-y-1">
              {existingDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-2 py-1.5"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <FileText size={12} className="shrink-0 text-text-secondary" />
                    <span className="truncate text-[11px] text-text-primary">
                      {doc.originalName}
                    </span>
                  </div>
                  {onDeleteExistingDocument && (
                    <button
                      type="button"
                      onClick={() => onDeleteExistingDocument(doc.id)}
                      className="ml-1 shrink-0 rounded p-0.5 text-text-secondary hover:text-red-500"
                      aria-label={`Remove ${doc.originalName}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Pending files */}
          {pendingFiles.length > 0 && (
            <ul className="space-y-1">
              {pendingFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2 py-1.5"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <FileText size={12} className="shrink-0 text-primary" />
                    <span className="truncate text-[11px] text-text-primary">{file.name}</span>
                    <span className="shrink-0 text-[10px] text-text-secondary">
                      {formatSize(file.size)}
                    </span>
                  </div>
                  {onRemovePendingFile && (
                    <button
                      type="button"
                      onClick={() => onRemovePendingFile(index)}
                      className="ml-1 shrink-0 rounded p-0.5 text-text-secondary hover:text-red-500"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
