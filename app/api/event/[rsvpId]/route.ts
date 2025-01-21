import prismadb from "@/lib/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const rsvpId = (await params).rsvpId;

  console.log(rsvpId);
  if (!rsvpId) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "RSVP ID is required",
      },
    });
  }

  try {
    const data = await prismadb.rsvp.findUnique({
      where: {
        id: rsvpId,
      },
      include: {
        invites: true,
        attendee: true,
      }
    });

    if (!data) {
      return NextResponse.json({
        status: 404,
        body: {
          error: "RSVP not found",
        },
      });
    }

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
