const mongoose = require('mongoose')

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connection Successfully`)
    } catch (error) {
        process.exit(1)
        console.log("MongoDB Connection Error")
    }
}

module.exports = connectDB;