import { General } from "@/components/General";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import { CalendarCheck, ClockIcon, LocateFixedIcon, LocateIcon, PinIcon, StarIcon, StarsIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rsvpId: string }>;
}): Promise<Metadata> {
  const query = await params;
  const rsvpId = query.rsvpId;

  const data = await prismadb.rsvp.findUnique({
    where: {
      id: rsvpId,
    },
  });

  if (!data) {
    return {
      title: "RSVP not found",
      description: "RSVP not found",
    };
  }

  return {
    title: `Invite from ${data.organiser} for ${data.name}`,
    description: `Venue : ${data.venue} Date : ${new Date(
      data.date
    ).toDateString()} Time : ${data.time}`,
  };
}

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
          <div className="flex items-center justify-center w-full text-center">
            <p className="font-[marjaan] font-bold text-3xl">
            بسم الله الرحمٰن الرحيم
            </p>
          </div>
          </CardTitle>
        </CardHeader>
        <Separator className="bg-black mb-3" />
        <CardContent className="flex flex-col items-center justify-center w-full gap-y-3">

          <div className="flex flex-col items-end justify-center w-full">
            <p className="font-[marjaan] font-semibold text-xl text-end">
              , السلام و عليكم و رحمة الله و بركاته
            </p>
          </div>

          <div className="flex flex-col items-start justify-center w-full">
            <p className="font-bold text-wrap break-all">{data.description}</p>
          </div>

          <div className="flex flex-col items-start justify-center w-full uppercase gap-y-2">
            <div className="flex items-center justify-start w-full">
              <span className="mr-3">
              <StarsIcon/>
              </span>
              <p>
                <strong>{data.name}</strong>
              </p>
            </div>
            <div className="flex items-center justify-start w-full">
              <span className="mr-3">
              <LocateFixedIcon/>
              </span>
              <p>
                <strong>{data.venue}</strong>
              </p>
            </div>
            <div className="flex items-center justify-start w-full">
              <span className="mr-3">
              <CalendarCheck/>
              </span>
              <p>
                <strong>{new Date(data.date).toDateString()}</strong>
              </p>
            </div>
            <div className="flex items-center justify-start w-full">
              <span className="mr-3">
              <ClockIcon/>
              </span>
              <p>
                <strong>{data.time}</strong>
              </p>
            </div>
          </div>

          <Separator className="bg-black mt-2"/>

          <div className="flex flex-col items-end justify-center w-full">
            <p className="font-[kanz] font-bold text-2xl">, والسلام</p>
            <p>
              <strong>{data.organiser}</strong>
            </p>
          </div>
        </CardContent>
        <Separator className="bg-black mb-3" />
        <CardFooter className="flex flex-col items-center justify-center w-full">
          <General />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Template;
