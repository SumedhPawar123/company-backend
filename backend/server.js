const express = require('express')
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const contactRoute = require('./routes/contactRoute')
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

app.use("/contact", contactRoute)

// Creating a server
const server = http.createServer(app)

// Database Connectivity
connectDB()


server.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`)
})
