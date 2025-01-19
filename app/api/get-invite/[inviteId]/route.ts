import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  res: NextResponse,
  { params }: { params: { inviteId: string } }
) {
  const inviteId = (await params).inviteId;

  try {
    const data = await prismadb.invites.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!data) {
      return NextResponse.json({
        status: 404,
        error: "Not Found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Success",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Internal Server Error",
    });
  }
}
