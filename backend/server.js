const express = require('express')
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const contactRoute = require('./routes/contactRoute')
const adminRoute = require('./routes/adminRoute')
const projectRoute = require('./routes/projectRoute')
const serviceRoute = require('./routes/serviceRoute')
const blogsRoute = require("./routes/blogsRoute")
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

app.use("/api/contact", contactRoute)
app.use("/api/admin", adminRoute)
app.use("/api/projects", projectRoute)
app.use("/api/service", serviceRoute)
app.use("/api/blogs", blogsRoute)

// Creating a server
const server = http.createServer(app)

// Database Connectivity
connectDB()


server.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`)
})
