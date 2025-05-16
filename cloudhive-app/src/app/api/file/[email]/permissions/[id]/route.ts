import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  const { email, id } = await params;
  const body = await req.json();

  const { type, role, emailAddress } = body;

  if (!type || !role) {
    return NextResponse.json(
      { error: "'type' and 'role' are required" },
      { status: 400 }
    );
  }

  try {
    const drive = await createOAuthClient(email);
    const requestBody: any = { type, role };

    if (type === "user" && !emailAddress) {
      return NextResponse.json(
        { error: "'emailAddress' is required when type is 'user'" },
        { status: 400 }
      );
    }

    if (emailAddress) {
      requestBody.emailAddress = emailAddress;
    }

    const response = await drive.permissions.create({
      fileId: id,
      requestBody,
      fields: "id,type,role,displayName,photoLink,emailAddress",
    });

    return NextResponse.json({
      result: {
        id: response.data.id,
        type: response.data.type,
        role: response.data.role,
        displayName: response.data.displayName,
        photoLink: response.data.photoLink,
        emailAddress: response.data.emailAddress,
      },
    });
  } catch (error: any) {
    console.error("Error adding permission:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  const { email, id } = await params;
  const body = await req.json();
  const { permissionId, role } = body;

  if (!permissionId || !role) {
    return NextResponse.json(
      { error: "'permissionId' and 'role' are required" },
      { status: 400 }
    );
  }

  try {
    const drive = await createOAuthClient(email);

    await drive.permissions.update({
      fileId: id,
      permissionId,
      requestBody: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ email: string; id: string }> }
) {
  const { email, id } = await params;
  const body = await req.json();
  const { permissionId } = body;

  if (!permissionId) {
    return NextResponse.json(
      { error: "'permissionId' is required" },
      { status: 400 }
    );
  }

  try {
    const drive = await createOAuthClient(email);

    await drive.permissions.delete({
      fileId: id,
      permissionId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
