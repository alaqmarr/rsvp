import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import Link from "next/link";
import React from "react";

const Template = async ({
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
  });
  if (!data) {
    return (
      <div>
        <h1>RSVP not found</h1>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center p-5 gap-y-3">
      <Card className="bg-gradient-to-r from-amber-200 to-yellow-400 max-w-[80vw] min-w-[300px] shadow-md gap-y-3 rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-center w-full">
            <p>{data.name}</p>
          </CardTitle>
        </CardHeader>
        <Separator className=" mb-3" />
        <CardContent className="flex flex-col items-center justify-center w-full gap-y-3">
          <div className="flex items-center justify-center w-full text-center">
            <p className="font-[kanz] font-bold text-3xl">
              بسم الله الرحمان الرحيم
            </p>
          </div>

          <div className="flex flex-col items-start justify-center w-full">
            <p className="font-semibold text-xl underline">To: John Doe</p>
          </div>

          <div className="flex flex-col items-end justify-center w-full">
            <p className="font-[marjaan] font-semibold text-xl text-end">
              , السلام و عليكم و رحمة الله و بركاته
            </p>
          </div>

          <div className="flex flex-col items-start justify-center w-full">
            <p className="font-bold text-wrap break-all">{data.description}</p>
          </div>

          <div className="flex flex-col items-start justify-center w-full uppercase">
            <p>
              Venue: <strong>{data.venue}</strong>
            </p>
            <p>
              Date: <strong>{new Date(data.date).toDateString()}</strong>
            </p>
            <p>
              Time: <strong>{data.time}</strong>
            </p>
          </div>

          <Separator />

          <div className="flex flex-col items-end justify-center w-full">
            <p className="font-[kanz] font-bold text-2xl">, والسلام</p>
            <p>
              <strong>{data.organiser}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-black" />

      <Alert
        variant={"destructive"}
        className="w-fit flex flex-col gap-y-3 bg-red-300"
      >
        <AlertTitle>Feel like your content is off point?</AlertTitle>
        <AlertDescription className="flex flex-col items-center">
          <Button variant="default">
            <Link href={`/dashboard/${rsvpId}/edit`}>
              Edit your event details
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Template;
