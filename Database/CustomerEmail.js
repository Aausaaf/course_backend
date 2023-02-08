const mongoose = require('mongoose')

const CustomerEmailSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
}) 

const CustomerEmail = mongoose.model('customer',CustomerEmailSchema)

module.exports = {
    CustomerEmail
}