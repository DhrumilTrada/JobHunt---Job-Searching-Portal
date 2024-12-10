import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/dbConfig.js"
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"
dotenv.config({});

// dhrumilsdmn2001 dhumusdmn

const app = express() 

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true 
}
app.use(cors(corsOptions))

// api's
app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/jobs", jobRoute)
app.use("/api/v1/application", applicationRoute)


const PORT = process.env.PORT || 3000

app.get("/home", (req, res) => {
    res.status(200).json({
        message: "I am coming from backend.",
        success: true
    })
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server started at ${PORT}.`)
})