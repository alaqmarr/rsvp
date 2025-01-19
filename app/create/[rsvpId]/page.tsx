import prismadb from "@/lib/db";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UsersIcon } from "lucide-react";
import CopyToClipboard from "@/components/ui/CopyToClipboard";
import { Separator } from "@/components/ui/separator";
import OpenLink from "@/components/OpenLink";
import Link from "next/link";

const Success = async ({ params }: { params: Promise<{ rsvpId: string }> }) => {
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

  const publicLink = `https://rsvp.alaqmar.com/rsvp/v1/${rsvpId}`;
  const dashboardLink = `https://rsvp.alaqmar.com/dashboard/${rsvpId}`;
  const inviteLink = `https://rsvp.alaqmar.com/dashboard/${rsvpId}/invitations`;
  return (
    <div className="flex flex-col items-center justify-center p-5 gap-y-3">
      <div className="notifications-container">
        <div className="success">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="succes-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="success-prompt-wrap">
              <p className="success-prompt-heading">
                Congratulations! Your event has been created.
              </p>
              <div className="success-prompt-prompt">
                <p>
                  Next Steps? <br />
                  Open the dashboard and start inviting people, or just share
                  the public link with all your invitees.
                </p>
              </div>
              <div className="success-button-container">
                <button type="button" className="success-button-main">
                  <Link href={`/dashboard/${rsvpId}`}>Open Dashboard</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert variant={"destructive"}>
        <AlertTitle>NOTE:</AlertTitle>
        <AlertDescription>
          Make sure to copy the dashboard link for your use, all the other links
          can be found on the dashboard. Dashboard is public, do not share
          dashboard link with anyone.
        </AlertDescription>
      </Alert>

      <Alert className="bg-gray-100">
        <UsersIcon className="h-4 w-4" />
        <AlertTitle>Dashboard</AlertTitle>
        <AlertDescription className="flex flex-col gap-y-3">
          <p className="break-all text-sm">{dashboardLink}</p>
          <Separator />
          <OpenLink url={publicLink} />
        </AlertDescription>
      </Alert>

      <Separator />
      <Alert className="bg-gray-100">
        <UsersIcon className="h-4 w-4" />
        <AlertTitle>Public Link (non-customisable)</AlertTitle>
        <AlertDescription className="flex flex-col gap-y-3">
          <p className="break-all text-sm">{publicLink}</p>
          <Separator />
          <CopyToClipboard url={publicLink} />
        </AlertDescription>
      </Alert>

      <Separator />

      <Alert className="bg-gray-100">
        <UsersIcon className="h-4 w-4" />
        <AlertTitle>Invite People (customised)</AlertTitle>
        <AlertDescription className="flex flex-col gap-y-3">
          <p className="break-all text-sm">{inviteLink}</p>
          <Separator />
          <OpenLink url={inviteLink} />
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Success;
