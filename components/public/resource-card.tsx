import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileText, ImageIcon, Video, Archive, File as FileIcon } from "lucide-react";
import { formatFileSize, cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string | null;
  fileExt: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
}

interface ResourceCardProps {
  resource: Resource;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive;
  if (mimeType === "application/pdf") return FileText;
  return FileIcon;
}

const typeInfo: Record<string, { label: string; className: string }> = {
  course: { label: "Course", className: "bg-blue-500/20 text-blue-800" },
  exam: { label: "Exam", className: "bg-red-500/20 text-red-800" },
  tp_exercise: { label: "TP/Exercise", className: "bg-green-500/20 text-green-800" },
  project: { label: "Project", className: "bg-purple-500/20 text-purple-800" },
  presentation: { label: "Presentation", className: "bg-yellow-500/20 text-yellow-800" },
  report: { label: "Report", className: "bg-indigo-500/20 text-indigo-800" },
  other: { label: "Other", className: "bg-gray-500/20 text-gray-800" },
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = getFileIcon(resource.mimeType);
  const { label, className } = typeInfo[resource.type] || typeInfo.other;

  return (
    <div className="relative p-6 rounded-lg shadow-lg backdrop-blur-md bg-background/50 border border-border/20 transition-all duration-300 hover:shadow-xl hover:bg-background/70">
      <div className="flex items-center space-x-4 mb-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", className)}>
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
          <p className="text-sm text-muted-foreground">{label} • {formatFileSize(resource.sizeBytes)} • {resource.fileExt.toUpperCase()}</p>
        </div>
      </div>

      {resource.description && (
        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
      )}

      <div className="flex justify-end">
        <Button asChild size="sm" variant="secondary">
          <Link href={`/api/files/${resource.id}/download`}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Link>
        </Button>
      </div>
    </div>
  );
}
