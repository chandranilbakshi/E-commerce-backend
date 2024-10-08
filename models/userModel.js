import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: Number,
        default: 0
    },
    cart:{
        type: Array,
        default:[]
    }
},{
    timestamps: true
})

export default mongoose.model('Users', userSchema);