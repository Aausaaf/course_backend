const { User } = require("../Database/UserSchema")
var validator = require("email-validator");
const {Auth} = require('two-step-auth');
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { Verfication } = require("../Database/OtpVerificationSchema");
const bcrypt = require('bcrypt');
const { CustomerEmail } = require("../Database/CustomerEmail");



const getSignupData = async(req,res) => {
    let data = await User.find()
    res.send(data)
}

const getNumberOfUser = async(req,res) => {
    let data = await User.find()
    data = data.length
    res.status(200).send({
        length:data
    })
}

const getUserDelete = async(req,res) => {
    let {email} = req.params
    if(email)
    {
        let data = await User.findOneAndDelete({email:email})
        if(data)
        {
            res.status(200).send({
                message:"User deleted Successfull"
            })
        }
        else
        {
            res.status(400).send({
                message:"User does not have account"
            })
        }
        
    }
    else
    {
        res.status(500).send({
            message:"please Provide Email"
        })
    }

}




const createUser = async(req,res) => {
    try {
        const user = req.body
   // console.log(user)
    if(user.name.length == 0)
    {
        return  res.status(400).send({message:"Please provide name"})
    }
      if(user.username.length == 0)
      {
        return  res.status(400).send({message:"Please provide Username"})
      }
      if(user.password.length == 0)
      {
        return  res.status(400).send({message:"Please provide Password"})
      }
      if(user.password.length < 8)
      {
        return  res.status(400).send({message:"Please provide atleast 8 length Password"})
      }

     const checkUser = await User.findOne({email:user.email})
     console.log(checkUser)
     if(checkUser)
     {
        //await User.findOneAndDelete({email:user.email})
        return res.status(400).send({message:'User already exists'})
     }

    let isEmail = validator.validate(user.email);
      
     if(isEmail)
     {
        
        let UserOtp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false})
        sendEmail(UserOtp,user.email)
        .then(response => {
            // console.log(response.message) 
           async function otpStore()
           {
            let checkUser = await Verfication.findOne({email:user.email})
           if(checkUser)
           {
              let OtpData= await Verfication.findOneAndUpdate({email:user.email},
                {
                    otp:UserOtp,
                    email:user.email,
                    password:user.password,
                    username:user.username,
                    name:user.name
                })
                console.log(OtpData)
           }
           else
        {
            let OtpData =  await Verfication({
                email:user.email,
                otp:UserOtp,
                password:user.password,
                username:user.username,
                name:user.name
            })
            OtpData.save()
           
        }
            
            let data = await Verfication.find()
            return  res.send({message:"OTP Send Successfull",
            Otp:data
        })
           }
           otpStore()
           
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
        
    } catch (error) {
      console.log(error)  
      return res.status(500).send({message:error})
    }

} 
function sendEmail(UserOtp,email) {

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
            to:email,
            subject:'Testing codeinf 101 Email:',
            text: `Your OTP is ${UserOtp}`
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


  const getVerifyOtp = async (req,res) => {
    const generateApiKey = require('generate-api-key').default;
    let {email,otp} = req.body
     let Findsemail =  await Verfication.findOne({email:email})
   //  console.log("Rrr" + Findsemail)
    if(Findsemail)
    {
        if(Findsemail.otp == otp)
        {
             let newUser = await User({
                email:Findsemail.email,
                password:Findsemail.password,
                username:Findsemail.username,
                api_key:generateApiKey(),
                name:Findsemail.name,
                count:0

             })
        await newUser.save()
        newUser = newUser.toJSON()
        delete newUser.password;

        const token = jwt.sign({_id: newUser._id}, "uyfrurr67r76r7", {expiresIn: '24h'});


            res.status(200).send({
                message1:"OTP Verified",
                message2:"Signup Successfull",
                user:newUser,
                token:token,
                
            })
        }
        else
        {
            //  await Verfication.findOneAndDelete({email:email})

            res.status(400).send({
                message:"otp Wrong"
            })
        }
    }
    else 
    {
        res.status(500).send({
            message:"please sign up first"
        })
    }
  }



  const getLoginUser = async(req, res) => {

    try {

        const {email, password} = req.body;

        const user = await User.findOne({email: email}).populate('password');

        // console.log(user);

        if (!user) {

            return res.status(400).send({message: 'User does not have account please signup'});

        }
        bcrypt.compare(password,user.password,(err,reses)=>{

            console.log(reses)
            
           if(reses)
           {

            const token = jwt.sign({_id: user._id}, "uyfrurr67r76r7", {expiresIn: '24h'});

            // const newUser = user.toJSON();
            // delete newUser.password;

            return res.status(200).send({token:token,name:user.username});

           }
           else
           {

            return res.status(400).send({message: 'Incorrect Password'})

           }
        })
       // const isMatch = (user.password === password);
       // if (!isMatch) {
         //   ;
      //  }
        
    } catch (err) {

        return res.status(500).send({message:err});

    }
}



const isLoggedIn = async(req, res) => {

    try {

        const token = req.headers.authorization.split(" ")[1];
        // console.log(token)
        const decoded = jwt.verify(token, "uyfrurr67r76r7");

        if(decoded)
        {
            const user = await User.findById(decoded._id);
              
            if(user)
            {
                return res.status(200).send(user);
            }
            res.status(400).send({
                message:"user does not have account"
            })
        }
        else
        {
            return res.status(401).send("Jwt has expire please login again")
        }
       
      

    } catch (err) {

        return res.status(500).send(err);

    }
}
const forgotPassword = async (req,res) => {
   const {email} = req.body

   if(email)
   {
     const user = await User.findOne({email:email})
     console.log(user)
     if(user)
    { let UserOtp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false})
     sendEmail(UserOtp,user.email)
     .then(response => {
         // console.log(response.message) 
       
         async function otpStore()
        {
         let checkUser = await Verfication.findOne({email:user.email})
        if(checkUser)
        {
           let OtpData= await Verfication.findOneAndUpdate({email:user.email},
             {
                 otp:UserOtp,
                 email:user.email,
                 password:user.password,
                 username:user.username,
                 name:user.name
             })
             console.log(OtpData)
        }
        else
     {
         let OtpData =  await Verfication({
             email:user.email,
             otp:UserOtp,
             password:user.password,
             username:user.username,
             name:user.name
         })
         OtpData.save()
        
     }
         
         let data = await Verfication.find()
         return  res.send({message:"OTP Send Successfull",
         email:email
     })
        }
        otpStore()
     })
     .catch((error)=>{
         
         console.log(error)
       return   res.status(500).send(error.message)
     })
  }

  else
  {  return  res.status(400).send({
   message :  "User does not have account please signup"
   } )
    }
   }
   else 
    {
 return res.status(500).send({
 message : "Please Provide Email Id"
  } )
 }
}


const getVerifyForgetpasswordOtp = async(req,res) => {
   
    let {email,otp} = req.body
     let Findsemail =  await Verfication.findOne({email:email})
     console.log(Findsemail)
    if(Findsemail)
    {
        if(Findsemail.otp == otp)
        {
        //      let newUser = await User({
        //         email:Findsemail.email,
        //         password:Findsemail.password,
        //         username:Findsemail.username
        //      })
        // await newUser.save()
        // newUser = newUser.toJSON()
        // delete newUser.password;

        // const token = jwt.sign({_id: newUser._id}, "uyfrurr67r76r7", {expiresIn: '24h'});


            res.status(200).send({
                message:"OTP Verified",
                otp:otp,
                email:email
                
            })
        }
        else
        {
            //  await Verfication.findOneAndDelete({email:email})

            res.status(400).send({
                message:"otp Wrong"
            })
        }
    }
    else 
    {
        res.status(500).send({
            message:"please sign up first"
        })
    }
  
 
}



const ChangePassword = async(req,res) => {

    let {email,otp,password} = req.body
     let Findsemail =  await Verfication.findOne({email:email})
  //   console.log(Findsemail)
    if(Findsemail)
    {
        if(Findsemail.otp == otp)
        {
             let oldUser = await User.findOneAndUpdate({
                email:Findsemail.email
             },
             {
                email:Findsemail.email,
                password:await bcrypt.hash(password,12),
                username:Findsemail.username
             })
        
        oldUser = oldUser.toJSON()
        // delete oldUser.password;

        const token = jwt.sign({_id: oldUser._id}, "uyfrurr67r76r7", {expiresIn: '24h'});

         
            res.status(200).send({
                message1:"OTP Verified",
                token:token,
                user:oldUser
                
            })
        }
        else
        {
            //  await Verfication.findOneAndDelete({email:email})

            res.status(400).send({
                message:"otp Wrong"
            })
        }
    }
    else 
    {
        res.status(500).send({
            message:"please sign up first"
        })
    }
  
}

const changePasswordWithProfilepage = async(req,res) => {
     let data = req.body
     const token = req.headers.authorization.split(" ")[1]; 
     const decoded = jwt.verify(token, "uyfrurr67r76r7");
         //console.log(decoded)
        if(decoded)
        {
            const user = await User.findById(decoded._id);
              console.log(user)
            if(user)
            {
              bcrypt.compare(data.oldPassword,user.password,async(err,reses)=>{
                if(reses)
                {
                    let updateUser= await User.findOneAndUpdate({
                        email:user.email
                     },
                     {
                        email:user.email,
                        password:await bcrypt.hash(data.newPassword,12),
                        username:user.username,
                        name:user.name
                     })
                    return res.status(200).send({message:"Password Changed",updateUser});
                }
                else
                {
                   return  res.status(400).send({
                        message:"please check current password"
                    })
                }
            })
            }
            else {
           return  res.status(400).send({
                message:"user does not have account"
            })
        }
        }
        else
        {
            return res.status(401).send("Jwt has expire please login again")
        }
}




const editUserDetailsByAdmin = async (req,res) => {
     let data = req.body
     let {id} = req.params
     let check = await User.findOne({_id:id})
     if(check)
     { 
         await User.findOneAndUpdate({_id:id},data)
     let updatedData = await User.findOne({_id:id})
     return res.status(200).send({
        updatedData
    })
     
     }
     else
     {
        return res.status(400).send({
            message:"please provide right user Id"
        })
     }
}






const createUserByAdmin = async(req,res) => {
    const generateApiKey = require('generate-api-key').default;
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token, "uyfrurr67r76r7");
        console.log(decoded)
       if(decoded)
       {
    try {
        const user = req.body
    console.log(user)
      if(user.username.length == 0)
      {
        return  res.status(400).send({message:"Please provide Username"})
      }
      if(user.password.length == 0)
      {
        return  res.status(400).send({message:"Please provide Password"})
      }
      if(user.password.length < 8)
      {
        return  res.status(400).send({message:"Please provide atleast 8 length Password"})
      }

     const checkUser = await User.findOne({email:user.email})
     console.log(checkUser)
     if(checkUser)
     {
        //await User.findOneAndDelete({email:user.email})
        return res.status(400).send({message:'User already exists'})
     }

    let isEmail = validator.validate(user.email);
      
     if(isEmail)
     {
      
        let checkAuth = await User.findById({_id:decoded._id})
        if(checkAuth)
        {
            let data =  await User({
              username : user.username,
              password : user.password,
              email : user.email,
              api_key:generateApiKey()

              
            })   
            await data.save()
            return res.status(200).send({
             message:"User created successfully",
             data
            })
        }
        else
        {
            return res.status(200).send({
                message:"Please Provide Correct Jwt token",
                user
               })
        }
       
     }
     else
     {
        return res.status(404).send({message:"Email is not valid"})
     }
        
    } catch (error) {
      console.log(error)  
      return res.status(500).send({message:error})
    }
}
else
{
    res.status(401).send({
        message : "please Porvide  jwt token"
    })
}

} 


const addCostomerEmail = async (req,res) => {
    let {email} = req.body
    if(email)
    {
        let data = await CustomerEmail({email})
        await data.save()
        return res.status(200).send({data
        })
    }
    else
    {
        return res.status(400).send({
            message:"Please Provide email"
        })
    }
}





module.exports = {
    getSignupData,
    createUser,
    getVerifyOtp,
    getLoginUser,
    isLoggedIn,
    getUserDelete,
    forgotPassword,
    getVerifyForgetpasswordOtp,
    ChangePassword,
    changePasswordWithProfilepage,
    getNumberOfUser,
    editUserDetailsByAdmin,
    createUserByAdmin,
    addCostomerEmail
}