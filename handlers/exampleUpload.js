// const multer = require('multer')

// const uploadFile = multer({
//     storage:multer.diskStorage({
//         destination:function(req,file,cb)
//         {
//             cb(null, "uploads")
//         },
//         filename: function(req,file,cb)
//         {
//             cb(null,file.fieldname + "-" + Date.now() + [".png",".jpg"])
//             //console.log(req)
//         }
//     })
// }).any()


const postFile = (req,res) => {
    console.log(req.files)
    res.send("file_uplad")
} 
module.exports = {
    // uploadFile,
    postFile
}