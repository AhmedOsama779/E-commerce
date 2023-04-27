
import mongoose, { model, Schema } from "mongoose";


const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true    // TODO: converted to true after first cycle
    },
    amount: {
        type: Number,
        required: true
    },
    couponStatus: {
        type: String,
        default: "Valid",
        enum: ['Valid', 'expired']
    },
    // expiration
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema)

export default couponModel