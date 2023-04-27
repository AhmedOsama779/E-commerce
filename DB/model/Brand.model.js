



import mongoose, { model, Schema } from "mongoose";


const brandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    logo: {
        path: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'subCategory',
        required: true
    },
    customId: String
}, {
    timestamps: true
})


const brandModel = mongoose.models.brand || model('brand', brandSchema)

export default brandModel