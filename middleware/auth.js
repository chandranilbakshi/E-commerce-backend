import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if(!token){
            return res.status(400).json({msg: "Invalid Auth"})
        }

        jwt.verify(token, process.env.secret_code, (err, user) => {
            if (err){
                return res.status(400).json({msg: "Invalid Auth"})
            }

            req.user = user
            next()
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

export default auth