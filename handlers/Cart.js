const { Cart } = require("../Database/Cart");
const { User } = require("../Database/UserSchema");
const jwt = require("jsonwebtoken");

const getCartData = async(req,res) => {

    try {
        const token = req.headers.authorization.split(" ")[1];

  
        const decoded = jwt.verify(token, "uyfrurr67r76r7");
     
        if(decoded)
        {
            const user = await User.findById(decoded._id);
              
            if(user)
            {
              
                const cart = await Cart.find({user:user._id});
                res.status(200).send({cart});
            }
            else
            {
                res.status(404).send({message:"User not found"});
            }
         }
         else
         {
             res.status(401).json({message: "Unauthorized"});
         }
        
    } catch (error) {
        console.log(error);
       return res.status(500).json({message: "Internal Server Error"});
    
    }
   
}


const createCart = async(req,res) => {
   try{
    const token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }
    const decoded = jwt.verify(token, "uyfrurr67r76r7")
    if(decoded)
    {
        const user = await User.findById(decoded._id);
        if(user)
        {
            const cartData = await Cart.findOne({user:user._id});
           
            if(cartData?.products?.length > 0)
            {
                cartData.products.push(req.body.products);
                const cart =  await Cart.findOneAndUpdate({_id:cartData._id},{
                    user:user._id,
                    products:cartData?.products
    
                });
             
                res.status(200).send({message:"Cart created"});
            }
            else
            {
               
                const cart = await Cart({
                    user:user._id,
                    products:[req.body.products]

    
                });
                await cart.save();
                res.status(200).send({message:"Cart created"});
          
           
        }
    }
        else
        {
            res.status(404).send({message:"User not found"});
        }
    }
    else
    {
        res.status(401).json({message: "Unauthorized"})
    }
   }
   catch(error)
   {
       console.log(error);
       return res.status(500).json({message: "Internal Server Error"});
   }

}

const deleteCart = async(req,res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }
    const decoded = jwt.verify(token, "uyfrurr67r76r7")
    if(decoded)
    {
        const user = await User.findById(decoded._id);
        if(user)
        {
            const cartData = await Cart.findOne({user:user._id});
           
            if(cartData?.products?.length > 0)
            {
                cartData.products = cartData.products.filter(product => product.name!= req.params.name)
                const cart = await Cart.findOneAndUpdate({_id:cartData._id},{
                    user:user._id,
                    products:cartData?.products
                })
                cart = await Cart.findOne({user:user._id});
                return res.status(200).send({message:"Cart deleted",cart});


            }
            else
            {
               return res.status(404).send({message:"Cart not found"});
            }
        }
        else
        {
            res.status(404).send({message:"User not found"});
        }
                 
    }
    else
    {
        res.status(401).json({message: "Unauthorized"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message: "Internal Server Error"});
  }
}


const EditCartData = async(req,res) => {
    let token = req.header.authorization.split(" ")[1];
    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }
    const decoded = jwt.verify(token, "uyfrurr67r76r7")
    if(decoded)
    {
        const user = await User.findById(decoded._id);
        if(user)
        {
            const cartData = await Cart.findOne({user:user._id});
           
            if(cartData?.products?.length > 0)
            {
                cartData.products = cartData.products.map(product => {
                    if(product._id == req.params.id)
                    {
                        product.name = req.body.products;
                    }
                })
            }
        }
        else
        {
            res.status(404).send({message:"User not found"});
        }
    }
    else{
        res.status(401).json({message: "Unauthorized"})
    }
}

module.exports = {
    getCartData,
    createCart,
    deleteCart,
}