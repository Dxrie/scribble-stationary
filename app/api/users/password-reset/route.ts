import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {createHash} from "crypto";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {userId, newPassword} = body;

    if (!(userId && newPassword))
      return NextResponse.json(
          {message: "Please pass on the required informations."},
          {status: 400}
      );

    await connect();

    const user = await UserModel.findById(userId);

    if (!user)
      return NextResponse.json({
        message: "User with that id not found.",
        status: 400,
      });

    const newPasswordHash = createHash("sha256")
      .update(newPassword)
      .digest("hex");

    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json(user, {status: 201});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        {message: "An error occured: " + err.message},
        {status: 500}
      );
    } else {
      return NextResponse.json({message: "An error occured"}, {status: 500});
    }
  }
}
