import {model, models, Schema} from "mongoose";

export interface IVoucher {
  voucherName: string;
  voucherCode: string;
  voucherExpiration: Date;
  discountType: "price" | "delivery";
  discountPercentage: number;
  minOrderValue: number;
  _id: string;
}

const VoucherSchema = new Schema({
  voucherName: {
    type: String,
    required: true,
  },
  voucherCode: {
    type: String,
    required: true,
    unique: true,
  },
  voucherExpiration: {
    type: Date,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["price", "delivery"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
});

const VoucherModel = models.Voucher || model("Voucher", VoucherSchema);

export default VoucherModel;
