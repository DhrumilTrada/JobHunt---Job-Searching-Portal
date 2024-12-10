import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"

export const register = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, role } = req.body
        console.log(fullName, email, password, phoneNumber, role)
        if(!fullName || !email || !password || !phoneNumber || !role){
            return res.status(400).json({
                message: "Some fields missing.",
                success: false
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message: "User with this email already exists.",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        await User.create({
            fullName,
            password: hashedPassword,
            email,
            role,
            phoneNumber,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        })
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if(!email || !password || !role){
                return res.status(400).json({
                message: "Some fields missing.",
                success: false
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect password.",
                success: false
            })
        }
        // check role if correcct or not
        if(role !== user.role){
            return res.status(400).json({
                message: "User dont exist with the selected role.",
                success: false
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1d"})

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly: true, sameSite: "strict"}).json({
            message: `Welcome back ${user.fullName}.`,
            user: user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, email, bio, skills } = req.body
        const resume = req.file
        const fileUri = getDataUri(resume)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        let skillsArray
        if(skills) skillsArray = skills.split(",")
        console.log(req)
        const userId = req.id // middleware authentication
        let user = await User.findById(userId)

        if(!user){
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = resume.originalname
        }

        // updating data 
        if(fullName) user.fullName = fullName
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(email) user.email = email
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

        await user.save()

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user: user
        })

    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "User logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}