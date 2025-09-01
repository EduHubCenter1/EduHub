import { DummyUploadForm } from '@/components/admin/dummy-upload-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DummyUploadTestPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Dummy Upload Test Page</CardTitle>
          <CardDescription>
            This form tests the raw file upload without saving any data to the database.
            The file will be saved to the server's local storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DummyUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
