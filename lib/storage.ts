import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
import { BlobServiceClient } from "@azure/storage-blob"

export interface StorageService {
  saveFile(buffer: Buffer, originalName: string, resourcePath: string): Promise<string>
  deleteFile(filePath: string): Promise<void>
  getFileStream(filePath: string): Promise<ReadableStream>
}

export class AzureBlobStorageService implements StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(connectionString: string, containerName: string) {
    if (!connectionString) {
      throw new Error("Azure Storage Connection String is not provided.");
    }
    if (!containerName) {
      throw new Error("Azure Storage Container Name is not provided.");
    }
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = containerName;
  }

  private async getContainerClient() {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    await containerClient.createIfNotExists();
    return containerClient;
  }

  async saveFile(buffer: Buffer, originalName: string, resourcePath: string): Promise<string> {
    const containerClient = await this.getContainerClient();
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString("hex");
    const filename = `${hash}${ext}`;
    const blobName = path.join(resourcePath, filename).replace(/\\/g, '/');

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer);

    return blobName;
  }

  async deleteFile(filePath: string): Promise<void> {
    const containerClient = await this.getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(filePath);
    await blockBlobClient.deleteIfExists();
  }

  async getFileStream(filePath: string): Promise<ReadableStream> {
    const containerClient = await this.getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(filePath);
    const downloadResponse = await blockBlobClient.download();

    if (!downloadResponse.readableStreamBody) {
      throw new Error("Blob not found or empty.");
    }

    const nodeStream = downloadResponse.readableStreamBody;
    const reader = nodeStream.getReader();

    return new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      cancel() {
        reader.cancel();
      }
    });
  }
}

export const storageService = new AzureBlobStorageService(
  process.env.AZURE_STORAGE_CONNECTION_STRING!,
  process.env.AZURE_STORAGE_CONTAINER_NAME!
);
