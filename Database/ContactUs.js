const mongoose = require('mongoose')

const ContectUsSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    skype:{
        type:String,
        
    },
  
},{timestamps: true})

const ContectInfo = mongoose.model('ContectUs',ContectUsSchema)

module.exports = {
    ContectInfo
}