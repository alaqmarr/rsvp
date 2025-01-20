import prismadb from "@/lib/db";
import { parseISO } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const body = await req.json();
  const rsvpId = (await params).rsvpId;

  try {
    // Parse incoming date and ensure it's stored in UTC
    const date = parseISO(body.date);

    const data = await prismadb.rsvp.update({
      where: {
        id: rsvpId,
      },
      data: {
        name: body.name,
        description: body.description,
        venue: body.venue,
        date: date.toISOString(), // Store date in ISO 8601 UTC format
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
