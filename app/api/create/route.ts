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

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.name ||
    !body.description ||
    !body.venue ||
    !body.date ||
    !body.time ||
    !body.organiser ||
    !body.by
  ) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "All fields are required",
      },
    });
  }
  try {
    const event = await prismadb.rsvp.create({
      data: {
        name: body.name,
        description: body.description,
        venue: body.venue,
        date: body.date,
        time: body.time,
        organiser: body.organiser,
        by: body.by,
      },
    });

    if (event) {
      const generateUrl = await shortenUrl(
        `https://mystore.alaqmar.dev/rsvp/v1/${event.id}`
      );
      if (!generateUrl) {
        return NextResponse.json({
          status: 200,
          body: {
            message: "Event created successfully but short url failed",
          },
          event: event,
        });
      }
      if (generateUrl && generateUrl.status === 200) {
        const setUrl = await prismadb.rsvp.update({
          where: {
            id: event.id,
          },
          data: {
            gen_link: generateUrl.shortUrl,
          },
        });

        if (!setUrl) {
          return NextResponse.json({
            status: 200,
            body: {
              message: "Event created successfully but short url failed",
            },
            event: event,
          });
        }
        return NextResponse.json({
          status: 200,
          body: {
            message: "Event created successfully",
          },
          event: setUrl,
        });
      } else {
        return NextResponse.json({
          status: 200,
          body: {
            message: "Event created successfully but short url failed",
          },
          event: event,
        });
      }
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: {
        error: error.message,
      },
    });
  }
}
