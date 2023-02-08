const mongoose  = require('mongoose')
mongoose.set('strictQuery', true);
const connectWithDatabase = async() => {
    try {
        // let URI ="mongodb+srv://Aausafalam:Aausaf@123@cluster0.d4vo4ci.mongodb.net/?retryWrites=true&w=majority"
        let AtlsURI = "mongodb+srv://alam:Aausaf123@cluster0.5ruzzlx.mongodb.net/?retryWrites=true&w=majority"
        let LocalURI = "mongodb://localhost:27017"
        await mongoose.connect(AtlsURI)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    connectWithDatabase
}