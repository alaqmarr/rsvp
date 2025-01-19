import prismadb from "@/lib/db";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountUp from "@/components/ui/Countup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default async function Home() {
  const rsvps = await prismadb.rsvp.findMany({
    include: {
      invites: true,
      attendee: true,
    },
  });

  let totalrsvps = 0;

  for (const rsvp of rsvps) {
    totalrsvps += rsvp.attendee.length;
  }

  return (
    <section className="p-5 flex flex-col items-center justify-center w-full gap-y-4">
      <div className="grid gap-y-3 gap-x-3 sm:grid-cols-1 md:gris-cols-1 lg:grid-cols-3">
        <Card className="max-w-[80vw] min-w-[300px] shadow-md">
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
            {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={rsvps.length}
              separator=","
              direction="up"
              duration={2}
              className="count-up-text"
            />
          </CardContent>
        </Card>
        <Card className="max-w-[80vw] min-w-[300px] shadow-md">
          <CardHeader>
            <CardTitle>Total RSVPS</CardTitle>
            {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={totalrsvps}
              separator=","
              direction="up"
              duration={2}
              className="count-up-text"
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Button variant="default">
          <Link href="/create">Create Event</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center max-w-[80vw]">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">By</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>On</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Invited</TableHead>
              <TableHead className="text-right">RSVPed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rsvps.map((rsvp) => (
              <TableRow key={rsvp.id}>
                <TableCell>{rsvp.organiser}</TableCell>
                <TableCell className="font-medium">{rsvp.name}</TableCell>
                <TableCell>{format(rsvp.date, "dd-MM-yy")}</TableCell>
                <TableCell>{rsvp.time}</TableCell>
                <TableCell className="text-right">
                  {rsvp.invites.length}
                </TableCell>
                <TableCell>{rsvp.attendee.length}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/${rsvp.id}`}>
                    <Button variant="default">Dashboard</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
