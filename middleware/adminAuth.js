import Users from '../models/userModel.js'

const adminAuth = async(req, res, next) => {
    try {
        const user = await Users.findById(req.user.id);

        if(user.role === 0){
            return res.status(400).json({msg: "Admin access denied"})
        }
        next()
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

export default adminAuth