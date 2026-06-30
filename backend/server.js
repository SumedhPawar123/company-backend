const express = require('express')
const cors = require('cors')
const path = require("path"); 
const http = require('http')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const contactRoute = require('./routes/contactRoute')
const adminRoute = require('./routes/adminRoute')
const projectRoute = require('./routes/projectRoute')
const serviceRoute = require('./routes/serviceRoute')
const blogsRoute = require("./routes/blogsRoute")
const faqRoute = require('./routes/faqRoute')   
dotenv.config()

const app = express()


// Middlewares
app.use(express.json())
app.use(cors())


const PORT = process.env.PORT || 5000

// Routes
app.get("/", (req,res) => {
    res.send("Indoria technologies is Listening")
})


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/contact", contactRoute)
app.use("/api/admin", adminRoute)
app.use("/api/projects", projectRoute)
app.use("/api/services", serviceRoute)
app.use("/api/blogs", blogsRoute)
app.use("/api/faqs", faqRoute)  

// Creating a server
const server = http.createServer(app)

// Database Connectivity
connectDB()


server.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`)
})
