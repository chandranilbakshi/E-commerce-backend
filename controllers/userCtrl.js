import Users from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body;
            
            const user = await Users.findOne({email})
            if(user){
                return res.status(400).json({msg: "Email already registered"})
            }

            if(password.length < 8){
                return res.status(400).json({msg: "Password should be atleast 8 characters"})
            }

            const pwdhash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name, email, password:pwdhash
            })
            await newUser.save()

            const accesstoken = createAccessToken({id:newUser._id})
            const refreshtoken = createRefreshToken({id:newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json(accesstoken)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    refreshtoken: async(req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
    
            if(!rf_token){
                return res.status(400).json({msg: "Please login or register"})
            }
            jwt.verify(rf_token, process.env.refresh_code, (err, user) => {
                if(err){
                    return res.status(400).json({msg: "Please login or register"})
                }
                const accesstoken = createAccessToken({id: user.id})
                res.json({user, accesstoken})
            })
    
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async(req, res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user){
                return res.status(400).json({msg: "User does not exist"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(400).json({msg: "Wrong password"})
            }

            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({accesstoken})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (error) {
            
        }
    },
    getUser: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')

            if(!user){
                return res.status(400).json({msg: "User not registered"})
            }
            res.json(user)
        } catch (error) {
            
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.secret_code, {expiresIn: '1d'})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.refresh_code, {expiresIn: '7d'})
}

export default userCtrl;