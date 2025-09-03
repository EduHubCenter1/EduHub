"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

interface UploadField {
  id: string
  name: string
  slug: string
  semesters: {
    id: string
    number: number
    modules: {
      id: string
      name: string
      slug: string
      submodules: {
        id: string
        name: string
        slug: string
      }[]
    }[]
  }[]
}

interface UploadFormProps {
  fields: UploadField[]
  userId: string
}

interface UploadFile {
  file: File
  id: string
  progress: number
  error?: string
}

const resourceTypes = [
  { value: "course", label: "Course Material" },
  { value: "exam", label: "Exam" },
  { value: "tp_exercise", label: "TP/Exercise" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
]

export function UploadForm({ fields, userId }: UploadFormProps) {
  const [selectedField, setSelectedField] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedModule, setSelectedModule] = useState("")
  const [selectedSubmodule, setSelectedSubmodule] = useState("")
  const [resourceType, setResourceType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  const selectedFieldData = fields.find((f) => f.id === selectedField)
  const selectedSemesterData = selectedFieldData?.semesters.find((s) => s.id === selectedSemester)
  const selectedModuleData = selectedSemesterData?.modules.find((m) => m.id === selectedModule)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSubmodule || !resourceType || !title.trim() || files.length === 0) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields and select at least one file.",
      })
      return
    }

    setIsUploading(true)

    try {
      for (const uploadFile of files) {
        const formData = new FormData()
        formData.append("file", uploadFile.file)
        formData.append("title", title)
        formData.append("type", resourceType)
        formData.append("description", description)
        formData.append("submoduleId", selectedSubmodule)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error)
        }

        // Update progress
        setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 100 } : f)))
      }

      toast.success("Upload Successful", {
        description: `${files.length} file(s) uploaded successfully.`,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setResourceType("")
      setFiles([])
      router.refresh()
    } catch (error) {
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "An error occurred during upload.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Details</CardTitle>
          <CardDescription>Select the location and provide details for your resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="field">Field</Label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFieldData?.semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      Semester {semester.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule} disabled={!selectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSemesterData?.modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submodule">Submodule</Label>
              <Select value={selectedSubmodule} onValueChange={setSelectedSubmodule} disabled={!selectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select submodule" />
                </SelectTrigger>
                <SelectContent>
                  {selectedModuleData?.submodules.map((submodule) => (
                    <SelectItem key={submodule.id} value={submodule.id}>
                      {submodule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource title"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, ZIP, DOCX, PPTX, XLSX, images, videos, and more
                </p>
                <p className="text-xs text-muted-foreground mt-1">Maximum file size: 50MB</p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Selected Files</h4>
              {files.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{uploadFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    {uploadFile.error && (
                      <div className="flex items-center text-destructive">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                    {uploadFile.progress > 0 && uploadFile.progress < 100 && (
                      <Progress value={uploadFile.progress} className="w-20" />
                    )}
                    {uploadFile.progress === 100 && <Badge variant="secondary">Uploaded</Badge>}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)} disabled={isUploading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isUploading || files.length === 0 || !selectedSubmodule || !resourceType || !title.trim()}
            className="w-full mt-6"
          >
            {isUploading ? "Uploading..." : `Upload ${files.length} file(s)`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
