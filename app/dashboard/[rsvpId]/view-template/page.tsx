import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import Link from "next/link";
import React from "react";

const Template = async ({ params }: { params: { rsvpId: string } }) => {
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
      <p className="w-full text-center font-bold text-xl">{data.name}</p>
      <Separator className="text-black border-black bg-black" />
      <p className="font-[kanz] font-bold text-3xl w-full text-center">
        بسم الله الرحمان الرحيم
      </p>
      <br />
      <div className="w-full items-start">
        <p className="underline">(If invited) TO: John Doe</p>
      </div>
      <p className="font-[kanz] text-2xl text-end w-full">
        السلام و عليكم ورحمةالله وبركاته
      </p>
      <div className="w-full flex flex-col text-start gap-y-3">
        <p className="font-bold">{data.description}</p>
      </div>

      <div className="w-full flex flex-col text-end gap-y-3">
        <p className="font-[kanz] text-2xl">والسلام</p>
        <p className="underline">
          <strong>{data.organiser}</strong>
        </p>
      </div>

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
