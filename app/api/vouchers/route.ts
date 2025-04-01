import connect from "@/app/lib/db";
import VoucherModel from "@/app/lib/models/voucher";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    const voucher = await VoucherModel.find();

    return NextResponse.json(voucher, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    } else {
      return NextResponse.json(
        {message: "An unknown error occurred"},
        {status: 500}
      );
    }
  }
}
