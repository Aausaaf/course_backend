const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SignupSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    api_key:{
        type:String,
        required:true
    }
},{timestamps: true})


SignupSchema.pre('save', async function(next) {
   
  
    this.password= await bcrypt.hash(this.password,12);
    
    console.log(this.password)

next()
})



const User = mongoose.model('Example',SignupSchema)

module.exports = {
    User
}