import express from "express";
import fileUpload from "express-fileupload"
import mongoose from "mongoose";
import userrouter from './routes/useRouter.js';
import categoryrouter from './routes/categoryRouter.js'
import productrouter from './routes/productRouter.js'
import uploadrouter from './routes/upload.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))
dotenv.config()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({msg: "hello"});
})

app.use('/user', userrouter);
app.use('/api', categoryrouter);
app.use('/api', uploadrouter)
app.use('/api', productrouter)

app.listen(port, () => {
    console.log("server is running")
})

const url = process.env.mongodb_url;

mongoose.connect(url, {}).then(() => {
    console.log("Connected")
}).catch(err => {
    console.log(err)
})