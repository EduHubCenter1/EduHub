
import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(request: Request) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString || !containerName) {
    return NextResponse.json(
      { error: 'Azure Storage connection string or container name is not configured.' },
      { status: 500 }
    );
  }

  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Ensure container exists
    await containerClient.createIfNotExists({ access: 'blob' });

    const blobName = `${new Date().getTime()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload data
    await blockBlobClient.upload(buffer, buffer.length);

    return NextResponse.json(
      { message: 'Upload successful', filename: blobName, url: blockBlobClient.url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload failed', error);
    // Check if error is an object and has a message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Upload failed', details: errorMessage }, { status: 500 });
  }
}
