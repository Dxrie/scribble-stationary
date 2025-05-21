import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!(username && password))
      return NextResponse.json(
        { message: "Insufficient data" },
        { status: 400 },
      );

    await connect();

    const passwordHash = createHash("sha256").update(password).digest("hex");

    if (username.startsWith(process.env.ADMIN_PREFIX)) {
      const adminUsername = username.slice(process.env.ADMIN_PREFIX?.length);
      const existingAdmin = await UserModel.findOne({
        username: adminUsername,
        isAdmin: true,
      });

      if (existingAdmin && existingAdmin.passwordHash === passwordHash) {
        const adminResponse = existingAdmin.toObject();
        delete adminResponse.passwordHash;
        delete adminResponse.verifyToken;
        delete adminResponse.changePasswordToken;
        delete adminResponse.cart;
        delete adminResponse.address;

        return NextResponse.json(adminResponse, { status: 200 });
      }

      return NextResponse.json(
        { message: "Incorrect username/password" },
        { status: 400 },
      );
    }

    const existingUser = await UserModel.findOne({
      username: username,
      isAdmin: false,
    });

    if (existingUser && existingUser.passwordHash === passwordHash) {
      const userResponse = existingUser.toObject();
      delete userResponse.passwordHash;
      delete userResponse.verifyToken;
      delete userResponse.changePasswordToken;
      delete userResponse.cart;
      delete userResponse.address;

      return NextResponse.json(userResponse, { status: 200 });
    }

    return NextResponse.json(
      { message: "Incorrect username/password" },
      { status: 400 },
    );
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
