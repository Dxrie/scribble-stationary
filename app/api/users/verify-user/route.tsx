import UserModel from "@/app/lib/models/user";
import {validate} from "email-validator";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {email} = body;

  if (!validate(email))
    return NextResponse.json(
      {message: "Please use a valid email."},
      {status: 400}
    );

  try {
    const user = await UserModel.findOne({email: email});

    if (!user)
      return NextResponse.json(
        {
          message:
            "User with that email was not found, please make sure you typed the email correctly.",
        },
        {status: 400}
      );

    return NextResponse.json({id: user._id}, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json(
        {message: "An error occured: " + err.message},
        {status: 500}
      );
    } else {
      return NextResponse.json({message: "An error occured: "}, {status: 500});
    }
  }
}
