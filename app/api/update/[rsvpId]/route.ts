import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const body = await req.json();

  const rsvpId = (await params).rsvpId;

  try {
    const data = await prismadb.rsvp.update({
      where: {
        id: rsvpId,
      },
      data: {
        name: body.name,
        description: body.description,
        venue: body.venue,
        date: body.date,
        time: body.time,
        organiser: body.organiser,
        by: body.by,
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "RSVP found",
      },
      rsvpid: rsvpId,
      data: body,
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
