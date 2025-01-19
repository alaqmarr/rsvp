import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    res: NextResponse,
    { params }: { params: { inviteId: string } }
) {
    const inviteId = (await params).inviteId;

    return NextResponse.json({
        message: "Invite found",
        inviteId: inviteId,
    }, {
        status: 200
    });
}
