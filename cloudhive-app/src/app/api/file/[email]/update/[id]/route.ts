import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  try {
    const { email, id } = await params;
    const body = await req.json();
    const { name, starred, trashed, restore, permanentlyDelete } = body;

    const drive = await createOAuthClient(email);

    if (permanentlyDelete) {
      await drive.files.delete({ fileId: id });
      return NextResponse.json({ success: true, deleted: true });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (starred !== undefined) updateData.starred = starred;
    if (trashed !== undefined) updateData.trashed = trashed;
    if (restore) updateData.trashed = false;

    const response = await drive.files.update({
      fileId: id,
      requestBody: updateData,
      fields: "id, name, starred, trashed, modifiedTime",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to update/delete file:", error);
    return NextResponse.json(
      { error: "Failed to update/delete file" },
      { status: 500 }
    );
  }
}
