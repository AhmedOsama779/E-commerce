import couponModel from "../../../DB/model/Coupon.model.js"
import moment from 'moment'

export const createCoupon = async (req, res, next) => {
    const { code, fromDate, toDate, amount } = req.body
    if (amount > 100) {
        return next(new Error('invalid amount', { cause: 400 }))
    }
    if (await couponModel.findOne({ code })) {
        return next(new Error('please enter another code', { cause: 400 }))
    }
    // console.log({
    //     requestFrom: fromDate,
    //     fromDateMoment: moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm'),
    //     now: moment().format('YYYY-MM-DD HH:mm')
    // });
    const fromDateMoment = moment(new Date(fromDate))
    const toDateMoment = moment(new Date(toDate))
    const now = moment()

    if (fromDateMoment.isBefore(now) ||
        toDateMoment.isBefore(now) ||
        toDateMoment.isBefore(fromDateMoment)) {
        return next(new Error('please enter dates start from tomorrow', { cause: 400 }))
    }
    if (moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm') == moment(new Date(toDate)).format('YYYY-MM-DD HH:mm')) {
        return next(new Error('please enter different interval', { cause: 400 }))

    }

    const coupon = await couponModel.create({
        code,
        createdBy: req.user._id,
        amount,
        fromDate: moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm'),
        toDate: moment(new Date(toDate)).format('YYYY-MM-DD HH:mm')
    })
    return res.status(201).json({ mesage: "Done", coupon })
}


// ========================  update coupon ==================
export const updateCoupon = async (req, res, next) => {
    // code , amount , toDate m fromDate
    const { couponId } = req.params
    const coupon = await couponModel.findById(couponId)
    if (!coupon) {
        return next(new Error('in-valid coupon id', { cause: 400 }))
    }
    console.log({
        body: req.body,
        te: req.body.length
    });

    if (!Object.keys(req.body).length) {
        return next(new Error('please enter the updated fields', { cause: 400 }))

    }
    // code 
    if (req.body.code) {
        if (coupon.code == req.body.code) {
            return next(new Error('please enter a different code from the old one', { cause: 400 }))
        }
        if (await couponModel.findOne({ code: req.body.code })) {
            return next(new Error('this coupon code is already exist', { cause: 400 }))
        }
        coupon.code = req.body.code
    }
    // amount
    if (req.body.amount) {
        if (req.body.amount > 100 || req.body.amount < 1) {
            return next(new Error('please enter a valid amount', { cause: 400 }))
        }
        coupon.amount = req.body.amount
    }

    // fromDate
    if (req.body.fromDate && !req.body.toDate) {
        const fromDateMoment = moment(new Date(req.body.fromDate))
        if (
            fromDateMoment.isBefore(moment()) ||
            fromDateMoment.isSame(moment(coupon.fromDate)) ||
            fromDateMoment.isAfter(coupon.toDate)
        ) {
            return next(new Error('please enter a valid dates', { cause: 400 }))
        }
        coupon.fromDate = fromDateMoment.format('YYYY-MM-DD HH:mm')
    }

    // toDate 
    if (req.body.toDate && !req.body.fromDate) {
        const toDateMoment = moment(new Date(req.body.toDate))
        if (
            toDateMoment.isBefore(moment()) ||
            //avoid hh:mm
            toDateMoment.isSame(moment(moment(coupon.toDate).format('YYYY-MM-DD'))) ||
            toDateMoment.isBefore(coupon.fromDate)
        ) {
            return next(new Error('please enter a valid dates', { cause: 400 }))
        }
        coupon.toDate = toDateMoment.format('YYYY-MM-DD HH:mm')
    }

    // toDate and fromDate
    if (req.body.toDate && req.body.fromDate) {
        const fromDateMoment = moment(new Date(req.body.fromDate))
        const toDateMoment = moment(new Date(req.body.toDate))
        const now = moment()

        if (fromDateMoment.isBefore(now) ||
            toDateMoment.isBefore(now) ||
            toDateMoment.isBefore(fromDateMoment)) {
            return next(new Error('please enter dates start from tomorrow', { cause: 400 }))
        }
        coupon.fromDate = fromDateMoment.format('YYYY-MM-DD HH:mm')
        coupon.toDate = toDateMoment.format('YYYY-MM-DD HH:mm')
    }

    const savedCoupon = await coupon.save()
    if (!savedCoupon) {
        return next(new Error('update coupon fail', { cause: 400 }))
    }
    res.status(200).json({ message: "Done", savedCoupon })
}


// save

// insertMany

//create