import { mongoose } from "mongoose";


const MessageStatus = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: String,
        required: true
    },
    receiverPublicKey:{
        type: String,
        required: true
    },
})

export const MessageStatusModel = mongoose.model("MessageStatus", MessageStatus);