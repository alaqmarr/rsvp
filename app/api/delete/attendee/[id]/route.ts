import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const checkInvite = await prismadb.invites.findUnique({
    where: {
      id: id,
    },
  });

  try {
    if (checkInvite) {
      const deleteInvite = await prismadb.invites.delete({
        where: {
          id: id,
        },
      });

      if (!deleteInvite) {
        return NextResponse.json({
          status: 500,
          body: {
            message: "Server Error",
          },
        });
      }
    }

    const deleteAttendee = await prismadb.attendee.delete({
      where: {
        id: id,
      },
    });

    if (!deleteAttendee) {
      return NextResponse.json({
        status: 500,
        body: {
          message: "Server Error",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      body: {
        message: "Attendee Deleted Successfully",
      },
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
