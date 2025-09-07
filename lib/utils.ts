import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateResourcePath(
  fieldSlug: string,
  semesterNumber: number,
  moduleSlug: string,
  submoduleSlug: string,
): string {
  return `${fieldSlug}/S${semesterNumber}/${moduleSlug}/${submoduleSlug}`
}

export function generatePendingResourcePath(
  fieldSlug: string,
  semesterNumber: number,
  moduleSlug: string,
  submoduleSlug: string,
): string {
  return `pending/${fieldSlug}/S${semesterNumber}/${moduleSlug}/${submoduleSlug}`
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "file-text"
  if (mimeType.includes("zip")) return "archive"
  if (mimeType.includes("word")) return "file-text"
  if (mimeType.includes("presentation")) return "presentation"
  if (mimeType.includes("spreadsheet")) return "spreadsheet"
  return "file"
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens
    .trim()
}
