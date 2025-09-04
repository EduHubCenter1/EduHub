import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface MinimalistResourceCardProps {
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
  course: { label: "Course", className: "bg-blue-100 text-blue-800" },
  exam: { label: "Exam", className: "bg-red-100 text-red-800" },
  tp_exercise: { label: "TP/Exercise", className: "bg-green-100 text-green-800" },
  project: { label: "Project", className: "bg-purple-100 text-purple-800" },
  presentation: { label: "Presentation", className: "bg-yellow-100 text-yellow-800" },
  report: { label: "Report", className: "bg-indigo-100 text-indigo-800" },
  other: { label: "Other", className: "bg-gray-100 text-gray-800" },
};

export function MinimalistResourceCard({ resource }: MinimalistResourceCardProps) {
  const Icon = getFileIcon(resource.mimeType);
  const { label, className } = typeInfo[resource.type] || typeInfo.other;

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm hover:bg-muted/50 transition-colors duration-200 flex items-center space-x-4">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", className)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-card-foreground">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">
          <span>{label}</span>
          <span className="mx-2">•</span>
          <span>{formatFileSize(resource.sizeBytes)}</span>
          <span className="mx-2">•</span>
          <span className="uppercase font-mono text-xs">{resource.fileExt}</span>
        </p>
      </div>
      <div className="flex-shrink-0">
        <Button asChild size="sm">
          <Link href={`/api/files/${resource.id}/download`}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Link>
        </Button>
      </div>
    </div>
  );
}
