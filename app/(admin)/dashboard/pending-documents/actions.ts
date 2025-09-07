// app/(admin)/dashboard/pending-documents/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { storageService } from "@/lib/storage";
import { generateResourcePath } from "@/lib/utils";

export async function approveResource(resourceId: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return { error: "Resource not found." };
    }

    if (resource.status === "approved") {
      return { success: "Resource is already approved." };
    }

    // Move file from pending location to final public location
    const oldPath = resource.fileUrl.split("/").slice(4).join("/"); // Extract path after container name
    const newPath = generateResourcePath(
      // Assuming you can derive these from resource.moduleId or submoduleId
      // This part needs to be adapted based on how you store module/submodule slugs
      // For now, let's assume the resource object has enough info or we fetch it.
      // For simplicity, let's assume the fileUrl contains enough info to reconstruct the path
      // Or, we fetch the full hierarchy from the DB
      (await prisma.module.findUnique({ where: { id: resource.moduleId }, include: { semester: { include: { field: true } } } }))?.semester.field.slug || "",
      (await prisma.module.findUnique({ where: { id: resource.moduleId }, include: { semester: { include: { field: true } } } }))?.semester.number || 0,
      (await prisma.module.findUnique({ where: { id: resource.moduleId }, include: { semester: { include: { field: true } } } }))?.slug || "",
      resource.submoduleId ? (await prisma.submodule.findUnique({ where: { id: resource.submoduleId } }))?.slug || "" : ""
    );

    const fileName = resource.fileUrl.split("/").pop() || "";
    const newFileUrl = await storageService.moveFile(oldPath, newPath, fileName);

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        status: "approved",
        fileUrl: newFileUrl, // Update with the new public URL
      },
    });

    revalidatePath("/admin/dashboard/pending-documents");
    revalidatePath("/fields"); // Revalidate public pages where resources are displayed
    return { success: "Resource approved successfully!" };
  } catch (error: any) {
    console.error("Error approving resource:", error);
    return { error: error.message || "Failed to approve resource." };
  }
}

export async function rejectResource(resourceId: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return { error: "Resource not found." };
    }

    if (resource.status === "rejected") {
      return { success: "Resource is already rejected." };
    }

    // Delete file from storage
    const filePath = resource.fileUrl.split("/").slice(4).join("/"); // Extract path after container name
    await storageService.deleteFile(filePath);

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        status: "rejected",
      },
    });

    revalidatePath("/admin/dashboard/pending-documents");
    return { success: "Resource rejected successfully!" };
  } catch (error: any) {
    console.error("Error rejecting resource:", error);
    return { error: error.message || "Failed to reject resource." };
  }
}
