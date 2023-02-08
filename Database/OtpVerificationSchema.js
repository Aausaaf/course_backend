const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
},{timestamps: true})

const Verfication = mongoose.model('Verification',VerificationSchema)

module.exports = {
    Verfication
}