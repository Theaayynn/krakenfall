import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

export type UploadResourceType = "image" | "video" | "raw";

export async function uploadToCloudinary(
  fileDataUrl: string,
  folder: string,
  resourceType: UploadResourceType = "image"
): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }
  const result = await cloudinary.uploader.upload(fileDataUrl, {
    folder,
    resource_type: resourceType,
    overwrite: true,
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string, resourceType: UploadResourceType = "image"): Promise<void> {
  if (!cloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType }).catch(() => null);
}

export default cloudinary;
