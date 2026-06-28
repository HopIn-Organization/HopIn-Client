export const ACCEPTED_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/pdf",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_EXTENSIONS = ".txt,.md,.csv,.pdf,.json,.doc,.docx";

const ACCEPTED_EXTENSION_SET = new Set(ACCEPTED_EXTENSIONS.split(",").map((ext) => ext.trim()));

export const isAcceptedDocument = (file: File) => {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

  return ACCEPTED_TYPES.includes(mimeType) || ACCEPTED_EXTENSION_SET.has(extension);
};
