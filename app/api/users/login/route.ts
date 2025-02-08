import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {username, passwordHash} = body;

    if (!(username && passwordHash))
      return NextResponse.json({message: "Insufficient data"}, {status: 400});

    await connect();

    const existingUser = await UserModel.findOne({username: username});

    if (existingUser && existingUser.passwordHash === passwordHash) {
      return NextResponse.json(existingUser, {status: 200});
    }

    return NextResponse.json(
      {message: "Incorrect username/password"},
      {status: 400}
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    }
    return NextResponse.json(
      {message: "An unexpected error occurred"},
      {status: 500}
    );
  }
}
