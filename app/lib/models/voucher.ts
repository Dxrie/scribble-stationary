import {model, Schema} from "mongoose";

const VoucherSchema = new Schema({
    voucherName: {
        type: String,
        required: true,
    },
    voucherCode: {
        type: String,
        required: true,
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
    }
});

const VoucherModel = model("Voucher", VoucherSchema);

export default VoucherModel;