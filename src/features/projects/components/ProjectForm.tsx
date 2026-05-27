import { FormEvent, useState } from "react";
import { ArrowLeft, Link2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateJob } from "@/pages/projects/CreateJob";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { DocumentUpload } from "./DocumentUpload";
import { ProjectDocument } from "@/types/document";

export interface ProjectFormValues {
  name: string;
  description: string;
  repositoryUrl: string;
  jobs: Array<{ id?: string; title: string; skills: Array<{ name: string }> }>;
  pendingFiles: File[];
  jobPendingFiles: Record<number, File[]>;
}

interface ProjectFormProps {
  backTo: string;
  backLabel: string;
  heading: string;
  subheading: string;
  defaultValues?: {
    name?: string;
    description?: string;
    repositoryUrl?: string;
    jobs?: Array<{ id?: string; title: string; skills: string[] }>;
  };
  existingDocuments?: ProjectDocument[];
  existingJobDocuments?: Record<string, ProjectDocument[]>;
  onDeleteDocument?: (documentId: number) => void;
  isDeletingDocument?: boolean;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
}

export function ProjectForm({
  backTo,
  backLabel,
  heading,
  subheading,
  defaultValues,
  existingDocuments = [],
  existingJobDocuments = {},
  onDeleteDocument,
  isDeletingDocument,
  isPending,
  submitLabel,
  onSubmit,
}: ProjectFormProps) {
  const [jobs, setJobs] = useState<Array<{ id?: string; title: string; skills: string[] }>>(
    () => defaultValues?.jobs ?? [{ title: "", skills: [] }],
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [jobPendingFiles, setJobPendingFiles] = useState<Record<number, File[]>>({});

  function handleAddJob() {
    setJobs([...jobs, { title: "", skills: [] }]);
  }

  function handleUpdateJobTitle(index: number, title: string) {
    const updated = [...jobs];
    if (updated[index]) updated[index].title = title;
    setJobs(updated);
  }

  function handleUpdateJobSkills(index: number, skills: string[]) {
    const updated = [...jobs];
    if (updated[index]) updated[index].skills = skills;
    setJobs(updated);
  }

  function handleRemoveJob(index: number) {
    setJobs((current) => current.filter((_, i) => i !== index));
    setJobPendingFiles((prev) => {
      const updated = { ...prev };
      delete updated[index];
      const reindexed: Record<number, File[]> = {};
      for (const [key, value] of Object.entries(updated)) {
        const k = Number(key);
        if (k > index) {
          reindexed[k - 1] = value;
        } else {
          reindexed[k] = value;
        }
      }
      return reindexed;
    });
  }

  function handleAddJobFiles(index: number, files: File[]) {
    setJobPendingFiles((prev) => ({
      ...prev,
      [index]: [...(prev[index] ?? []), ...files],
    }));
  }

  function handleRemoveJobPendingFile(jobIndex: number, fileIndex: number) {
    setJobPendingFiles((prev) => ({
      ...prev,
      [jobIndex]: (prev[jobIndex] ?? []).filter((_, i) => i !== fileIndex),
    }));
  }

  function handleAddFiles(files: File[]) {
    setPendingFiles((prev) => [...prev, ...files]);
  }

  function handleRemovePending(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      repositoryUrl: String(formData.get("repositoryUrl") ?? ""),
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        skills: job.skills.map((skill) => ({ name: skill })),
      })),
      pendingFiles,
      jobPendingFiles,
    });
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        {backLabel}
      </Link>

      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-text-primary">{heading}</h1>
        <p className="text-lg text-text-secondary">{subheading}</p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="space-y-5 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Project Details</h2>
          <div className="h-px bg-border" />

          <Input
            id="name"
            name="name"
            label="Project Name"
            placeholder="e.g Mobile App Redesign"
            defaultValue={defaultValues?.name ?? ""}
            required
          />

          <label htmlFor="description" className="block space-y-2 text-sm">
            <span className="text-xs font-medium text-text-secondary">Description</span>
            <textarea
              id="description"
              name="description"
              className="h-28 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Briefly describe the project goals..."
              defaultValue={defaultValues?.description ?? ""}
              required
            />
          </label>

          <label htmlFor="repositoryUrl" className="block space-y-2 text-sm">
            <span className="text-xs font-medium text-text-secondary">
              GitHub Repository (Optional)
            </span>
            <div className="relative">
              <Link2
                size={14}
                className="pointer-events-none absolute left-3 top-3.5 text-text-secondary"
              />
              <input
                id="repositoryUrl"
                name="repositoryUrl"
                className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
                placeholder="https://github.com/org/repo"
                defaultValue={defaultValues?.repositoryUrl ?? ""}
                disabled={true}
              />
            </div>
          </label>
        </Card>

        <Card className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Job Roles & Requirements</h2>
              <p className="text-sm text-text-secondary">You can also add jobs after creation</p>
            </div>
            <Button
              type="button"
              onClick={handleAddJob}
              variant="outline"
              className="h-9 px-3 text-xs"
            >
              <Plus size={14} />
              Add Job
            </Button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {jobs.map((job, index) => (
              <CreateJob
                key={index}
                jobTitle={job.title}
                onJobTitleChange={(title) => handleUpdateJobTitle(index, title)}
                skills={job.skills}
                onSkillsChange={(skills) => handleUpdateJobSkills(index, skills)}
                onRemove={() => handleRemoveJob(index)}
                pendingFiles={jobPendingFiles[index] ?? []}
                onAddFiles={(files) => handleAddJobFiles(index, files)}
                onRemovePendingFile={(fileIndex) => handleRemoveJobPendingFile(index, fileIndex)}
                existingDocuments={job.id ? (existingJobDocuments[job.id] ?? []) : []}
                onDeleteExistingDocument={onDeleteDocument}
              />
            ))}
          </div>
        </Card>

        <Card className="space-y-5 p-6">
          <DocumentUpload
            existingDocuments={existingDocuments}
            pendingFiles={pendingFiles}
            onAddFiles={handleAddFiles}
            onRemovePending={handleRemovePending}
            onDeleteExisting={onDeleteDocument ?? (() => {})}
            isDeleting={isDeletingDocument}
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="px-8 py-3 text-base" disabled={isPending}>
            {isPending ? `${submitLabel}...` : submitLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
