import {NextResponse} from "next/server";
import connect from "../lib/db";
import UserModel from "../lib/models/user";
import crypto from "crypto";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const verifyToken = url.searchParams.get("verifyToken");
  const id = url.searchParams.get("id");

  try {
    if (verifyToken && id) {
      const hashedVerificationToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      await connect();
      const user = await UserModel.findOne({
        _id: id,
        verifyToken: hashedVerificationToken,
        verifyTokenExpire: {$gt: new Date()},
      });

      if (!user) {
        return NextResponse.json(
          {message: "Invalid or expired token"},
          {status: 400}
        );
      }

      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpire = undefined;

      await user.save();

      return new NextResponse(
        "Account verified. Please login again to use Scribble",
        {status: 200}
      );
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json(
        {message: "An error occured: " + err.message},
        {status: 500}
      );
    } else {
      return NextResponse.json(
        {
          message: "An error occured.",
        },
        {status: 500}
      );
    }
  }
}
