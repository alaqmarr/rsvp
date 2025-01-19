import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const body = await req.json();
  const rsvpId = (await params).rsvpId;

  const { first, last, willAttend } = body;

  try {
    const data = await prismadb.attendee.create({
      data: {
        name: first + " " + last,
        willAttend: willAttend,
        rsvpid: rsvpId,
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "RSVP found",
      },
      rsvpid: rsvpId,
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: {
        error: error.message,
      },
    });
  }
}
