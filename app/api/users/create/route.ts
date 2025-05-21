import { NextResponse } from "next/server";
import UserModel from "@/app/lib/models/user";
import connect from "@/app/lib/db";
import { sendEmail } from "@/app/utils/sendEmail";
import { getVerificationToken } from "@/app/lib/libs";
import { createHash } from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    const passwordHash = createHash("sha256").update(password).digest("hex");

    if (!(email && username && passwordHash)) {
      return NextResponse.json(
        { message: "Insufficient data" },
        { status: 400 },
      );
    }

    if (username.toLowerCase().startsWith("scribbleadmin_")) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 },
      );
    }

    await connect();

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { message: "Username already exists" },
          { status: 400 },
        );
      }

      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 },
        );
      }
    }

    const data = await getVerificationToken();

    const verifyToken = data.hashedVerificationToken;
    const verifyTokenExpire = data.verifyTokenExpire;

    const user = new UserModel({
      email,
      username,
      passwordHash,
      verifyToken,
      verifyTokenExpire,
    });

    await user.save();

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verifyEmail?verifyToken=${data.verificationToken}&id=${user._id}`;

    await sendEmail(user.email, "Email Verification", verificationLink);

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          message: "Error in creating user: " + err.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
