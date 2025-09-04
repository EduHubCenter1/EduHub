import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, ImageIcon, Video, Archive, File as FileIcon, User, Calendar, HardDrive } from "lucide-react";
import { formatFileSize, cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string | null;
  fileExt: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
  uploadedBy: {
    name: string;
  };
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
  course: { label: "Course", className: "bg-blue-100 text-blue-800" },
  exam: { label: "Exam", className: "bg-red-100 text-red-800" },
  tp_exercise: { label: "TP/Exercise", className: "bg-green-100 text-green-800" },
  project: { label: "Project", className: "bg-purple-100 text-purple-800" },
  presentation: { label: "Presentation", className: "bg-yellow-100 text-yellow-800" },
  report: { label: "Report", className: "bg-indigo-100 text-indigo-800" },
  other: { label: "Other", className: "bg-gray-100 text-gray-800" },
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = getFileIcon(resource.mimeType);
  const { label, className } = typeInfo[resource.type] || typeInfo.other;

  return (
    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative group">
      <div className="absolute top-0 right-0 w-0 h-0 border-solid border-t-40 border-l-40 border-t-transparent border-l-background group-hover:border-l-primary/20 transition-colors duration-300"></div>
      
      <div className="flex items-start space-x-4">
        <Icon className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-card-foreground">{resource.title}</h3>
          {resource.description && (
            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-1 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <HardDrive className="w-4 h-4 mr-2" />
            <span>{formatFileSize(resource.sizeBytes)}</span>
          </div>
          <div className="flex items-center">
            <Badge variant="secondary" className={cn(className, "text-xs")}>{label}</Badge>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDistanceToNow(resource.createdAt, { addSuffix: true })}</span>
          </div>
          
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <Button asChild size="sm" className="w-full font-semibold">
          <Link href={`/api/files/${resource.id}/download`}>
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Link>
        </Button>
      </div>
    </div>
  );
}