var validator = require("email-validator");
const nodemailer = require("nodemailer");
const { ContectInfo } = require("../Database/ContactUs");


const ContectUs = (req,res) => {
    let data = req.body
    console.log("Aaa")
    if(data.name.length==0||data.message.length==0||data.email.length==0)
    {
       return  res.status(400).send({
           message:"Please Fill Required Details"
        })
    }
    let isEmail = validator.validate(data.email);
     if (isEmail)
     {
       sendContectUSMessage(data.name,data.message,data.email,data.skype)
       .then(response => {
         return res.status(200).send({message:"Message send successfully"})
          
       })
       .catch((error)=>{
           
           console.log(error)
           res.status(500).send({mesasage:error.message})
       })
     } 
     else
     {
        return res.status(404).send({message:"Email is not valid"})
     }
}


function sendContectUSMessage(name,message,email,skype) {

   return new Promise((resolve,reject)=>{
       var transporter = nodemailer.createTransport({
           service:'gmail',
           auth:{
               user:"aausafalam585@gmail.com",
               pass:"kspaguxtungitnfz"
           }
       }) 
      
       const mail_configs  = {
           from:'aausafalam585@gmail.com',
           to:'aausafalam585@gmail.com',
           subject:'Contect Us User Message',
           text: `
           name:${name},
           email:${email}
           message:${message}
           skype:${skype}`
       }
       transporter.sendMail(mail_configs,function(error,info){
           if(error)
           {
               return reject({message:"An error has occured"})
           }
           return resolve({message:"Email send successfully"})

       })
   })

  
 }



  const getContectUSData = async (req,res) => {
    let data =  await ContectInfo.find()
     return res.status(200).send(data)
  }

  const AddContectInfoData = async (req,res) => {
    let data = req.body
    if(data.email&& data.phone)
    {
        let contectInfo = await ContectInfo(data)
        await contectInfo.save()
        res.status(200).send({
            message:"contect Info Added",
            contectInfo
        })
    }
  }
 
  const ChangeContectusData = async(req,res) => {
    let {id,data} = req.body
    await ContectInfo.findOneAndUpdate({_id:id},data)
    return res.status(200).send({
        message:"Changed Contect Info Successfully"
    })
  }




 module.exports = {
    ContectUs,
    getContectUSData,
    ChangeContectusData,
    AddContectInfoData
 }