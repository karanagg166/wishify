import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, imageData, platform } = body as {
      templateId: string;
      imageData?: string;
      platform?: string;
    };

    if (!templateId) {
      return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
    }

    let renderedUrl: string | undefined;
    let cloudinaryId: string | undefined;

    // Upload rendered card to Cloudinary only if imageData is provided
    if (imageData) {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const result = await uploadToCloudinary(buffer, "wishify/shares");
      renderedUrl = result.url;
      cloudinaryId = result.publicId;
    }

    // Persist Share record
    const share = await prisma.share.create({
      data: {
        userId: session.user.id,
        templateId,
        renderedUrl: renderedUrl ?? null,
        cloudinaryId: cloudinaryId ?? null,
        platform: platform ?? "NATIVE",
      },
    });

    return NextResponse.json({ share });
  } catch (err) {
    console.error("[shares] POST error:", err);
    return NextResponse.json({ error: "Failed to create share" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shares = await prisma.share.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ shares });
  } catch (err) {
    console.error("[shares] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch shares" }, { status: 500 });
  }
}
