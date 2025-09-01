'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// Define types for what we need
type Submodule = {
  id: string;
  name: string;
};

const resourceTypes = ["Course", "TD", "TP", "Exam", "Other"];

export function SimpleUploadForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('');
  const [submoduleId, setSubmoduleId] = React.useState('');
  const [submodules, setSubmodules] = React.useState<Submodule[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch submodules to populate the dropdown
    const fetchSubmodules = async () => {
      try {
        const res = await fetch('/api/submodules');
        if (!res.ok) throw new Error('Failed to fetch submodules');
        const data = await res.json();
        setSubmodules(data);
      } catch (err) {
        toast.error('Could not load submodules for selection.');
      }
    };
    fetchSubmodules();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title || !type || !submoduleId) {
      setError('All fields are required to test the upload.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('submoduleId', submoduleId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setSuccess(`File uploaded successfully! Resource ID: ${result.resource.id}`)
      toast.success('File uploaded successfully!');
      // Reset form
      setTitle('');
      setType('');
      setSubmoduleId('');
      setFile(null);
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if(fileInput) fileInput.value = '';

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="title">1. Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Chapter 1 Slides"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">2. Resource Type</Label>
        <Select onValueChange={setType} value={type} disabled={isLoading}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="submodule">3. Submodule</Label>
        <Select onValueChange={setSubmoduleId} value={submoduleId} disabled={isLoading || submodules.length === 0}>
          <SelectTrigger id="submodule">
            <SelectValue placeholder="Select a submodule" />
          </SelectTrigger>
          <SelectContent>
            {submodules.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">4. File</Label>
        <Input id="file" type="file" onChange={handleFileChange} disabled={isLoading} />
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload File'}
      </Button>
    </form>
  );
}
