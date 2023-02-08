const express  = require('express')
const  bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { connectWithDatabase } = require('./Database/DataBase')
const cors = require('cors')
const { singupRoute } = require('./Routes/Signup')
const { contectUsRoutes } = require('./Routes/ContectUs');
const { CourseRoutes } = require('./Routes/Course');
const { cartRoutes } = require('./Routes/Cart');
const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Set EJS as templating engine
app.set("view engine", "ejs");
 app.use(fileUpload())
app.use(singupRoute)
app.use(contectUsRoutes)
app.use(CourseRoutes)
app.use(cartRoutes)

app.get("/appget",(req,res)=>{
    // console.log("aa rha a hai")
    res.send("kewugrhi oyewro8 gyo8 ")
})
connectWithDatabase().then((res)=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})

app.listen("8081")


 
// const express= require('express')
// const app = express()
// const cors = require("cors")
// // const Middleware = require('./Middleware')
// const port= 8080
// app.use(cors())
// // app.use(Middleware.decodeToken)
// app.get("/getd",(req,res)=>{
//     // console.log(req.headers)
//     res.send("hello we am getting error free User")
// })


// app.listen("8080")