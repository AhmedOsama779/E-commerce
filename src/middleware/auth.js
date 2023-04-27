
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { tokenDecode } from "../utils/GenerateAndVerifyToken.js";

//auth . authorization
const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return next(new Error("please login", { cause: 400 }))
            }
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                // return res.json({ message: "In-valid bearer key" })
                return next(new Error("In-valid bearer key", { cause: 400 }))
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if (!token) {
                // return res.json({ message: "In-valid token" })
                return next(new Error("In-valid token", { cause: 400 }))
            }
            // const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            const decoded = tokenDecode({ payload: token })

            if (!decoded?._id) {
                // return res.json({ message: "In-valid token payload" })
                return next(new Error("In-valid token payload", { cause: 400 }))
            }
            const authUser = await userModel.findById(decoded._id).select('userName email role changePassword')
            if (!authUser) {
                // return res.json({ message: "Not register account" })
                return next(new Error("Not register account", { cause: 400 }))
            }
            // console.log({
            //     iat: decoded.iat,
            //     changePassword: authUser.changePassword / 1000,
            //     cond: decoded.iat < authUser.changePassword / 1000
            // });
            if (decoded.iat < authUser.changePassword / 1000) {
                return next(new Error("Token expired", { cause: 400 }))
            }
            if (!accessRoles.includes(authUser.role)) {
                return next(new Error("Un-authorized", { cause: 400 }))
            }
            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error", err: error?.message })
        }
    }
}

export default auth




// const authFuntion  = (req,res,next) =>{
// }

// export const auth = ()=>{
//     return asyncHandler(authFuntion)
// }




// iat ,
// token (login) ==> resetPassword