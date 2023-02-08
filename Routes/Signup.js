const express = require('express')
const { getSignupData, createUser, getVerifyOtp, getLoginUser, isLoggedIn, getUserDelete, forgotPassword, getVerifyForgetpasswordOtp, ChangePassword, changePasswordWithProfilepage, getNumberOfUser, editUserDetailsByAdmin, createUserByAdmin, addCostomerEmail } = require('../handlers/singup')

const singupRoute = express.Router()

singupRoute.get("/getsignupdata",getSignupData)
singupRoute.get("/getnumberofuser",getNumberOfUser)
singupRoute.post("/postsignupdata",createUser)
singupRoute.post("/verifyotp",getVerifyOtp)
singupRoute.post("/login",getLoginUser)
singupRoute.get("/loggedin",isLoggedIn)
singupRoute.delete("/deleteuser/:email",getUserDelete)
singupRoute.post("/forgotpassword",forgotPassword)
singupRoute.post("/verifyforgetpasswordotp",getVerifyForgetpasswordOtp)
singupRoute.post("/changepassword",ChangePassword)
singupRoute.post("/deleteuser",getUserDelete)
singupRoute.post("/changepasswordfromprofilepage",changePasswordWithProfilepage)
singupRoute.patch("/updateuserdetailsbyadmin/:id",editUserDetailsByAdmin)
singupRoute.post("/createuserbyadmin",createUserByAdmin)
singupRoute.post("/addemail",addCostomerEmail)
module.exports = {
    singupRoute
}