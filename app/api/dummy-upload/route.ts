// pages/api/upload.js
import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Retrieve connection string or account details from environment variables
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING; 
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = "your-container-name"; // Replace with your container name
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Example: Uploading a blob
      const blobName = "your-blob-name";
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const data = "Hello, Azure Blob!"; // Replace with actual data (e.g., file buffer)
      await blockBlobClient.upload(data, data.length);

      res.status(200).json({ message: 'Upload successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Upload failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}