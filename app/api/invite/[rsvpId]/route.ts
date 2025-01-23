import prismadb from "@/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";

const BITLY_ACCESS_TOKEN = "56453ee52c12fab4be6fb4aed66f80fba7050155";

async function shortenUrl(longUrl: string) {
  try {
    const response = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: longUrl,
        domain: "bit.ly",
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      shortUrl: response.data.link,
      status: 200,
    };
  } catch (error: any) {
    return null;
  }
}
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
        invites: count,
      },
    });

    if (data) {
      const shortUrl = await shortenUrl(
        `https://rsvp.alaqmar.dev/rsvp/invite/${data.id}/${rsvpId}`
      );

      if (shortUrl) {
        const updateInvite = await prismadb.invites.update({
          where: {
            id: data.id,
          },
          data: {
            link: shortUrl.shortUrl,
          },
        });

        if (!updateInvite) {
          return NextResponse.json({
            status: 200,
            body: {
              error: "Invite added",
            },
          });
        } else {
          return NextResponse.json({
            status: 200,
            body: {
              error: "Invite added",
            },
          });
        }
      }
    }

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
