import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rsvpId: string }> }
) {
  const body = await req.json();
  const rsvpId = (await params).rsvpId;

  const { first, last, mobile, count } = body;

  try {
    const data = await prismadb.invites.create({
      data: {
        name: first + " " + last,
        phone: mobile,
        rsvpid: rsvpId,
        invites: count
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "Invite added.",
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
