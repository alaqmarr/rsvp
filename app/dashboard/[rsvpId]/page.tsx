import DeleteAttendee from "@/components/DeleteAttendee";
import DeleteInvite from "@/components/DeleteInvite";
import ShortenUrl from "@/components/ShortenUrl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from "@/components/ui/Countup";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prismadb from "@/lib/db";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard",
    description: "Dashboard for RSVP",
  };
}

const Dashboard = async ({
  params,
}: {
  params: Promise<{ rsvpId: string }>;
}) => {
  const query = await params;
  const rsvpId = query.rsvpId;

  const data = await prismadb.rsvp.findUnique({
    where: {
      id: rsvpId,
    },
    include: {
      invites: true,
      attendee: true,
    },
  });

  if (!data) {
    return (
      <div>
        <h1>RSVP not found</h1>
      </div>
    );
  }

  const invitedButNoRSVP = data.invites.filter(
    (invite) => !data.attendee.find((attendee) => attendee.id === invite.id)
  );

  const countOfInvitedButNoRSVP = invitedButNoRSVP.length;

  let totalInvites = 0;
  for (const invite of data.invites) {
    totalInvites += invite.invites;
  }

  let attendees = 0;

  for (const attendee of data.attendee) {
    attendees += attendee.count;
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 gap-y-3">
      <div className="min-w-[50vw] max-w-[80vw] flex justify-around gap-y-3 flex-wrap">
        <Card className="max-w-[80vw] min-w-[300px] shadow-md bg-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <p>Total Invites</p>

              <Link href={`/dashboard/${rsvpId}/invitations`}>
                <Button variant={"default"}>
                  <PlusCircle /> Invite
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={totalInvites}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl"
            />
            &nbsp;({totalInvites / 8} Thaals)
          </CardContent>
        </Card>

        <Card className="max-w-[80vw] min-w-[300px] shadow-md bg-slate-100">
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={attendees}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl"
            />
            &nbsp;({attendees / 8} Thaals)
          </CardContent>
        </Card>

        <Card className="max-w-[80vw] min-w-[300px] shadow-md bg-slate-100">
          <CardHeader>
            <CardTitle>Invited but no RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={countOfInvitedButNoRSVP}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl"
            />
          </CardContent>
        </Card>
      </div>
      <Alert className="max-w-[80vw] bg-slate-100">
        <AlertTitle className="uppercase">
          General RSVP Link
        </AlertTitle>
        <Separator className="w-full bg-black mt-2 mb-2" />
        <AlertDescription className="break-all">
          {
            data.gen_link ? (
              <code className="break-all">
                {data.gen_link}
              </code>
            ) : (
              <div>
                https://rsvp.alaqmar.dev/rsvp/v1/{rsvpId}
                <ShortenUrl longUrl={`https://rsvp.alaqmar.dev/rsvp/v1/${rsvpId}`} />
              </div>
            )
          }
        </AlertDescription>
      </Alert>
      <Button variant="default">
        <Link href={`/dashboard/${rsvpId}/view-template`}>
          View Invitation Template
        </Link>
      </Button>

      <div className="flex flex-col gap-y-4 items-start w-full max-w-[90vw]">
        <p>Attendee Table</p>
        <Table className="w-fit max-w-[80vw] rounded-lg shadow-lg bg-slate-100">
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Will Attend</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.attendee.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.name}</TableCell>
                <TableCell>{invite.willAttend ? "Yes" : "No"}</TableCell>
                <TableCell>{invite.count}</TableCell>
                <TableCell>
                  <DeleteAttendee id={invite.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p>Invitations Table</p>
        <Table className="w-fit max-w-[80vw] shadow-lg rounded-lg bg-slate-100">
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Invites</TableCell>
              <TableCell>RSVPed?</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.name}</TableCell>
                <TableCell>{invite.phone}</TableCell>
                <TableCell>{invite.invites}</TableCell>
                <TableCell>
                  {data.attendee.find((attendee) => attendee.id === invite.id)
                    ? "Yes"
                    : "No"}
                </TableCell>
                <TableCell>
                  <button className="wa-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      aria-labelledby="title"
                      aria-describedby="desc"
                      role="img"
                    >
                      <path
                        data-name="layer1"
                        d="M30.19.031a31.753 31.753 0 0 0-26.735 46.12L.085 62.509A1.235 1.235 0 0 0 1.58 63.96l16.029-3.8A31.744 31.744 0 1 0 30.19.031zM49.316 49.31A24.871 24.871 0 0 1 20.68 54l-2.232-1.112-9.828 2.326 2.069-10.042-1.1-2.154a24.874 24.874 0 0 1 4.578-28.857A24.854 24.854 0 0 1 49.316 49.31zm0 0"
                        fill="#7ad06d"
                      ></path>
                      <path
                        data-name="layer1"
                        d="M47.147 38.619L41 36.854a2.292 2.292 0 0 0-2.267.6l-1.5 1.531a2.239 2.239 0 0 1-2.435.514C31.883 38.32 25.765 32.88 24.2 30.16a2.239 2.239 0 0 1 .177-2.483l1.312-1.7a2.292 2.292 0 0 0 .283-2.328L23.388 17.8a2.293 2.293 0 0 0-3.58-.82c-1.716 1.451-3.752 3.657-4 6.1-.436 4.308 1.411 9.738 8.4 16.258 8.071 7.534 14.534 8.528 18.743 7.509 2.387-.578 4.294-2.9 5.5-4.793a2.293 2.293 0 0 0-1.3-3.436z"
                        fill="#7ad06d"
                      ></path>
                    </svg>
                    <Link
                      href={`https://wa.me/${invite.phone
                        }?text=${encodeURIComponent(
                          `Reminder to fill your RSVP for ${data.name
                          } on ${new Date(data.date).toLocaleDateString()} at ${data.time
                          }.%0A Click on the link below to RSVP: %0A ${invite.link ? invite.link : `https://rsvp.alaqmar.dev/rsvp/invite/${invite.id
                            }/${rsvpId}`}`
                        )}`}
                    >
                      Message
                    </Link>
                  </button>
                </TableCell>
                <TableCell>
                  <DeleteInvite id={invite.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
