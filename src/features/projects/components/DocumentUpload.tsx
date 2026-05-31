import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { ProjectDocument } from "@/types/document";

const MAX_FILES = 10;

const ACCEPTED_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/pdf",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = ".txt,.md,.csv,.pdf,.json,.doc,.docx";

interface DocumentUploadProps {
  existingDocuments: ProjectDocument[];
  pendingFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemovePending: (index: number) => void;
  onDeleteExisting: (documentId: number) => void;
  isDeleting?: boolean;
}

export function DocumentUpload({
  existingDocuments,
  pendingFiles,
  onAddFiles,
  onRemovePending,
  onDeleteExisting,
  isDeleting,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const totalCount = existingDocuments.length + pendingFiles.length;
  const remainingSlots = MAX_FILES - totalCount;

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const validFiles = Array.from(fileList).filter((f) => ACCEPTED_TYPES.includes(f.type));

      const toAdd = validFiles.slice(0, remainingSlots);
      if (toAdd.length > 0) {
        onAddFiles(toAdd);
      }
    },
    [remainingSlots, onAddFiles],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-primary">Project Documents (Optional)</h3>
          <p className="text-xs text-text-secondary">
            Upload text-based documents for RAG-enhanced onboarding. Max {MAX_FILES} files.
          </p>
        </div>
        <span className="text-xs text-text-secondary">
          {totalCount}/{MAX_FILES}
        </span>
      </div>

      {/* Drop zone */}
      {remainingSlots > 0 && (
        <div
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload documents"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <Upload size={20} className="text-text-secondary" />
          <p className="text-sm text-text-secondary">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-text-secondary">.txt, .md, .csv, .pdf, .json, .doc, .docx</p>
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
        <ul className="space-y-2" aria-label="Uploaded documents">
          {existingDocuments.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={16} className="shrink-0 text-text-secondary" />
                <span className="truncate text-sm text-text-primary">{doc.originalName}</span>
                <span className="shrink-0 text-xs text-text-secondary">
                  {formatSize(doc.sizeBytes)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDeleteExisting(doc.id)}
                disabled={isDeleting}
                className="ml-2 shrink-0 rounded p-1 text-text-secondary hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                aria-label={`Remove ${doc.originalName}`}
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pending files (not yet uploaded) */}
      {pendingFiles.length > 0 && (
        <ul className="space-y-2" aria-label="Files to upload">
          {pendingFiles.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={16} className="shrink-0 text-primary" />
                <span className="truncate text-sm text-text-primary">{file.name}</span>
                <span className="shrink-0 text-xs text-text-secondary">
                  {formatSize(file.size)}
                </span>
                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  New
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemovePending(index)}
                className="ml-2 shrink-0 rounded p-1 text-text-secondary hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${file.name}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
