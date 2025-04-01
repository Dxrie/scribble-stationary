import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    await UserModel.deleteMany();
    return NextResponse.json("ok");
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

export async function DELETE(request: Request) {
  try {
    await connect();

    const body = await request.json();
    const {id} = body;

    await UserModel.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Account has been deleted",
      },
      {status: 204}
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          message: err.message,
        },
        {status: 500}
      );
    }
    return NextResponse.json(
      {message: "An unexpected error occurred"},
      {status: 500}
    );
  }
}
