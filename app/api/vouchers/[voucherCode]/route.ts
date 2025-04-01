import VoucherModel from "@/app/lib/models/voucher";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ voucherCode: string }> },
) {
  try {
    const voucherCode = (await context.params).voucherCode;

    const voucher = await VoucherModel.findOne({ voucherCode });

    if (!voucher) {
      return NextResponse.json(
        { message: "Voucher not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(voucher, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
