import mongoose, { model, Schema } from "mongoose";



const subCategorySchema = new Schema({
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
        required:true     // TODO: converted to true after first cycle
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true     
    },
    customId: { type: String }

}, {
    timestamps: true
})


const subCategoryModel = mongoose.models.subCategory || model('subCategory', subCategorySchema)

export default subCategoryModel