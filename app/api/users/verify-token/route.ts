import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {createHash} from "crypto";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {id, token} = body;

    await connect();

    const user = await UserModel.findById(id);

    if (!user)
      return NextResponse.json(
        {message: "User with that id was not found."},
        {status: 400}
      );

    const hashedToken = createHash("sha256").update(token).digest("hex");

    if (
      !(
        user.changePasswordToken === hashedToken &&
        user.changePasswordTokenExpire >= Date.now()
      )
    )
      return NextResponse.json(
        {message: "Invalid or expired token"},
        {status: 400}
      );

    return NextResponse.json({message: "Valid"}, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    } else {
      return NextResponse.json({message: "An error occured."}, {status: 500});
    }
  }
}
