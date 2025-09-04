"use client";

import { useState } from "react";
import { ResourcesGrid } from "./resources-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface ResourcesPageClientProps {
  resources: Resource[];
  title?: string;
  description?: string;
}

const resourceTypes = [
  { value: "all", label: "All" },
  { value: "course", label: "Course" },
  { value: "exam", label: "Exam" },
  { value: "tp_exercise", label: "TP Exercise" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
];

export function ResourcesPageClient({ resources, title, description }: ResourcesPageClientProps) {
  const [selectedType, setSelectedType] = useState("all");

  const filteredResources = selectedType === "all"
    ? resources
    : resources.filter((resource) => resource.type === selectedType);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-heading">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {resourceTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <ResourcesGrid resources={filteredResources} title="" description="" />
    </div>
  );
}
