"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UploadFormProps {
  semesters: any[]; // Replace 'any' with actual type if available
  modules: any[]; // Replace 'any' with actual type if available
  submodules: any[]; // Replace 'any' with actual type if available
}

export function UploadForm({ semesters, modules, submodules }: UploadFormProps) {
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedSubmodule, setSelectedSubmodule] = useState(""); // New state for submodule
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredSemesters = semesters.filter(
    (s) => s.fieldId === selectedField
  );
  const filteredModules = modules.filter(
    (m) => m.semesterId === selectedSemester
  );
  const filteredSubmodules = submodules.filter(
    (sub) => sub.moduleId === selectedModule
  );

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedField || !selectedSemester || !selectedModule || !resourceTitle || !selectedType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", resourceTitle);
    formData.append("description", resourceDescription);
    formData.append("fieldId", selectedField);
    formData.append("semesterId", selectedSemester);
    formData.append("moduleId", selectedModule);
    if (selectedSubmodule) { // Only append if a submodule is selected
      formData.append("submoduleId", selectedSubmodule);
    }
    formData.append("type", selectedType); // Add the selected type

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "Your resource has been uploaded.",
        });
        // Reset form
        setSelectedField("");
        setSelectedSemester("");
        setSelectedModule("");
        setResourceTitle("");
        setResourceDescription("");
        setFile(null);
        setSelectedType(""); // Reset selected type
      } else {
        const errorData = await response.json();
        toast({
          title: "Upload Failed",
          description: errorData.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload New Resource</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
          Fill in the details below to upload a new resource to the platform.
        </p>
        <form onSubmit={handleFileUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="field">Field</Label>
              <Select onValueChange={setSelectedField} value={selectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(semesters.map((s) => s.fieldId))).map((fieldId) => (
                    <SelectItem key={fieldId} value={fieldId}>
                      {semesters.find(s => s.fieldId === fieldId)?.field?.name || fieldId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select onValueChange={setSelectedSemester} value={selectedSemester} disabled={!selectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a semester" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSemesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      Semester {s.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="module">Module</Label>
              <Select onValueChange={setSelectedModule} value={selectedModule} disabled={!selectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="submodule">Submodule (Optional)</Label>
              <Select onValueChange={setSelectedSubmodule} value={selectedSubmodule} disabled={!selectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a submodule" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubmodules.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="type">Resource Type</Label>
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="tp_exercise">TP Exercise</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Resource Title</Label>
            <Input
              id="title"
              type="text"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              placeholder="e.g., Introduction to Algorithms"
            />
          </div>

          <div>
            <Label htmlFor="description">Resource Description (Optional)</Label>
            <Textarea
              id="description"
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
              placeholder="A brief summary of the resource content."
            />
          </div>

          <div>
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Uploading..." : "Upload Resource"}
          </Button>
        </form>
      </div>
    </div>
  );
}