import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const body = await req.json();
  const rsvpId = (await params).rsvpId;

  try {
    // Convert date string back to Date object in UTC
    const date = new Date(body.date);

    const data = await prismadb.rsvp.update({
      where: {
        id: rsvpId,
      },
      data: {
        name: body.name,
        description: body.description,
        venue: body.venue,
        date: date,
        time: body.time,
        organiser: body.organiser,
        by: body.by,
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "RSVP updated successfully",
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
