import joi from 'joi'
import { Types } from 'mongoose';

const validatObjectId = (value, helper) => {
    console.log({
        value,
        helper
    });
    // return true , hepler
    return Types.ObjectId.isValid(value) ? true : helper.message('in-valid objectId')
}
export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net','org'] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validatObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}


export const validation = (schema) => {
    return (req, res, next) => {

        const requestData = {
            ...req.body,
            ...req.query,
            ...req.params,
            // ...req.file
        }
        // console.log(requestData);
        if (req.file) {
            requestData.file = req.file
        }
        if (req.files) {
            requestData.files = req.files
        }

        const validationResult = schema.validate(requestData, {
            abortEarly: false
        })
        if (validationResult.error) {
            // validationErrors.push(validationResult.error.details)
            return res.status(400).json({ message: "Validation Error", Errors: validationResult.error.details })
        }

        next()
    }
}
