import prismadb from "@/lib/db";
import { count } from "console";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  res: NextResponse,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  const body = await req.json();
  const inviteId = (await params).inviteId;

  const data = await prismadb.invites.findUnique({
    where: {
      id: inviteId,
    },
  });

  if (!data) {
    return {
      status: 404,
      body: {
        error: "Invite not found",
      },
    };
  }

  const bodyData = body.data;

  const invitedName = data.name;
  const rsvpId = data.rsvpid;

  const willAttend = bodyData.count > 0 ? true : false;

  try {
    if (willAttend) {
      const attendee = await prismadb.attendee.create({
        data: {
          id: inviteId,
          name: invitedName,
          rsvpid: rsvpId,
          willAttend: willAttend,
          count: bodyData.count,
        },
      });

      if (attendee) {
        const invite = await prismadb.invites.update({
          where: {
            id: inviteId,
          },
          data: {
            rspved: true,
          },
        });

        if (invite) {
          return {
            status: 200,
            body: {
              message: "Attendee added successfully",
            },
            data: attendee,
          };
        }
      }
    } else {
      const invite = await prismadb.invites.update({
        where: {
          id: inviteId,
        },
        data: {
          rspved: true,
        },
      });

      if (invite) {
        return {
          status: 200,
          body: {
            message: "Attendee added successfully",
          },
          data: invite,
        };
      }
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {
        error: error.message,
      },
    };
  }
}
