import prismadb from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.name ||
    !body.description ||
    !body.venue ||
    !body.date ||
    !body.time ||
    !body.organiser ||
    !body.by
  ) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "All fields are required",
      },
    });
  }
  try {
    const event = await prismadb.rsvp.create({
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

    if (event) {
      return NextResponse.json({
        status: 200,
        body: {
          message: "Event created successfully",
        },
        event: event,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: {
        error: error.message,
      },
    });
  }
}
