import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { uploadToCloudinary, cloudinaryConfigured, type UploadResourceType } from "@/lib/cloudinary";
import { z } from "zod";

const schema = z.object({
  file: z.string().min(1), // data URL
  type: z.enum(["IMAGE", "VIDEO", "AUDIO"]),
  filename: z.string().trim().min(1).max(200),
});

const resourceTypeMap: Record<string, UploadResourceType> = { IMAGE: "image", VIDEO: "video", AUDIO: "video" };

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });

  if (!cloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary isn't configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  try {
    const { url, publicId } = await uploadToCloudinary(
      parsed.data.file,
      `krakenfall/${parsed.data.type.toLowerCase()}`,
      resourceTypeMap[parsed.data.type]
    );

    const asset = await prisma.mediaAsset.create({
      data: { url, publicId, type: parsed.data.type, filename: parsed.data.filename, uploadedBy: user.id },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (err) {
    console.error("[upload] Failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
