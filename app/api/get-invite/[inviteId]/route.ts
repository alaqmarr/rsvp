import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ inviteId: string }> }
  ) {
    const inviteId = (await params).inviteId;
  
    const data = await prismadb.invites.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        invites: true, // Ensure invites field is included
      },
    });
  
    if (!data) {
      return NextResponse.json({
        status: 404,
        body: {
          error: "Invite not found",
        },
      });
    }
  
    return NextResponse.json({
      status: 200,
      body: {
        message: "Invite found",
      },
      data: data,  // This should contain the `invites` field
    });
  }
  