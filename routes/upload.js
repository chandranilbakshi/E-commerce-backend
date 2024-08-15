import express from 'express';
const router = express.Router();
import cloudinary from 'cloudinary'
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'
import fs from 'fs'

cloudinary.config({
    cloud_name: `deegyrjsc`,
    api_key : `131245186435762`,
    api_secret : `OC7Ojvi5NGRi-AI0WeQ6jvcXk50`
})

router.post('/upload',auth,adminAuth, (req,res)=> {
    try{
        if(!req.files || Object.keys(req.files).length ===0)
        return res.status(400).send({msg: "No file were uploaded"})

        const file = req.files.file;
        if(file.size > 1024*1024){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg:"Size too large"})
        } 

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png')
        {
        removeTmp(file.tempFilePath)
        return res.status(400).json({msg:"File format is incorrect"})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:'test'}, (err,result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath)

            res.json({public_id:result.public_id,url:result.secure_url})
        })
    }
    catch(err){
        res.status(500).json({msg:err.message})
    }
})

router.post('/destroy',auth,adminAuth,(req,res)=> {
    try{
        const {public_id}  = req.body;
        if(!public_id) return res.status(400).json({msg:"No images Selected"})

        cloudinary.v2.uploader.destroy(public_id,async(err,result) => {
            if(err) throw err

            res.json({msg:"Deleted"})
        })
    }catch(err){
        return res.status(500).json({msg:err.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path,err => {
        if(err) throw err;
    })
}

export default router