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
  const rsvpsData = await prismadb.rsvp.findMany({
    include: {
      invites: true,
      attendee: true,
    },
  });

  //sort based on latest date first

  const rsvps = rsvpsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  let totalrsvps = 0;

  for (const rsvp of rsvpsData) {
    totalrsvps += rsvp.attendee.length;
  }

  return (
    <section className="p-5 flex flex-col items-center justify-center w-full gap-y-4">
      <div className="min-w-[50vw] max-w-[80vw] flex justify-around gap-y-3 flex-wrap">
        <div>
          <Card className="max-w-[80vw] min-w-[300px] shadow-md bg-slate-100">
            <CardHeader>
              <CardTitle>Total Events Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <CountUp
                from={0}
                to={rsvpsData.length}
                separator=","
                direction="up"
                duration={2}
                className="count-up-text text-3xl"
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="max-w-[80vw] min-w-[300px] shadow-md bg-slate-100">
            <CardHeader>
              <CardTitle>Total RSVPs Done</CardTitle>
            </CardHeader>
            <CardContent>
              <CountUp
                from={0}
                to={totalrsvps}
                separator=","
                direction="up"
                duration={2}
                className="count-up-text text-3xl"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Button variant="default">
          <Link href="/create">Create Event</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center max-w-[80vw]">
        <Table className="w-fit max-w-[80vw] bg-white rounded-md shadow-md">
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
                <TableCell>{new Date(rsvp.date).toLocaleDateString()}</TableCell>
                <TableCell>{rsvp.time}</TableCell>
                <TableCell className="text-right">
                  {rsvp.invites.length}
                </TableCell>
                <TableCell>{rsvp.attendee.length}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/${rsvp.id}`} target="_blank">
                    <Button variant="secondary">Dashboard</Button>
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
