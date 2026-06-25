const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

// login Admin
exports.login = async (req, res, next) => {
    const {email , password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const adminExist = await Admin.findOne({email}).select("+password");
        if(!adminExist){
            return res.status(400).json({
                success: false,
                message: "Invalid Credential"
            })
        }

        const isMatch = await bcrypt.compare(password, adminExist.password)
        if(!isMatch){
             return res.status(400).json({
                success: false,
                message: "Invalid Credential"
            })
        }

        let token = generateToken(adminExist._id)

        res.status(200).json({
            success: true,
            data: {fullName: adminExist.fullName, email: adminExist.email, role: adminExist.role},
            token
        })


    } catch (error) {
        next(error)
    }
}