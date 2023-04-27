import mongoose, { model, Schema } from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    Image: {
        path:
        {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    slug: {
        type: String,
        required: true,
        unique: true,

    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true // TODO: converted to true after first cycle
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // TODO: converted to true after first cycle
    },
    customId: { type: String }
}, {
    toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    timestamps: true
})


categorySchema.virtual('subCategories', {
    ref: 'subCategory',
    localField: "_id",
    foreignField: 'categoryId',
    // justOne: true
})



const categoryModel = mongoose.models.Category || model('Category', categorySchema)

export default categoryModel