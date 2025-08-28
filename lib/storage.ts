import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

export interface StorageService {
  saveFile(buffer: Buffer, originalName: string, resourcePath: string): Promise<string>
  deleteFile(filePath: string): Promise<void>
  getFileStream(filePath: string): Promise<ReadableStream>
}

export class LocalStorageService implements StorageService {
  private uploadsDir: string

  constructor(uploadsDir = "./uploads") {
    this.uploadsDir = uploadsDir
  }

  async saveFile(buffer: Buffer, originalName: string, resourcePath: string): Promise<string> {
    // Create directory structure
    const fullDir = path.join(this.uploadsDir, resourcePath)
    await fs.mkdir(fullDir, { recursive: true })

    // Generate unique filename
    const ext = path.extname(originalName)
    const hash = crypto.randomBytes(16).toString("hex")
    const filename = `${hash}${ext}`
    const fullPath = path.join(fullDir, filename)

    // Save file
    await fs.writeFile(fullPath, buffer)

    return path.join(resourcePath, filename)
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadsDir, filePath)
    await fs.unlink(fullPath)
  }

  async getFileStream(filePath: string): Promise<ReadableStream> {
    const fullPath = path.join(this.uploadsDir, filePath)
    const file = await fs.readFile(fullPath)
    return new ReadableStream({
      start(controller) {
        controller.enqueue(file)
        controller.close()
      },
    })
  }
}

export const storageService = new LocalStorageService(process.env.UPLOADS_DIR)
