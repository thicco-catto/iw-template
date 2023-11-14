import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({msg: "Hello world!"}, {status: 200});
}