import { SimpleUploadForm } from '@/components/admin/simple-upload-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function UploadTestPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Test Page</CardTitle>
          <CardDescription>
            A simple form to test the file upload endpoint. All fields are required by the API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
