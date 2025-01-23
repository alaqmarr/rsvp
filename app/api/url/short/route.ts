import { NextResponse } from "next/server";
import axios from "axios";

const BITLY_ACCESS_TOKEN = "56453ee52c12fab4be6fb4aed66f80fba7050155"; // Store this securely in an environment variable for better security.

export async function POST(req: Request) {
  console.log(req)
  try {
    const { longUrl } = await req.json(); // Parse the input request body
    if (!longUrl) {
      return NextResponse.json(
        { error: "longUrl is required" },
        { status: 400 }
      );
    }

    // Make the POST request to Bitly's API to shorten the URL
    const response = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: longUrl,
        domain: "bit.ly", // Default domain; you can use others like "j.mp"
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the shortened URL from the response
    const shortenedUrl = response.data.link;

    return NextResponse.json({ shortUrl: shortenedUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error shortening URL:", error.message);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          "Failed to shorten the URL. Please try again.",
      },
      { status: 500 }
    );
  }
}
