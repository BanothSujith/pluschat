import { mongoose } from "mongoose";

const pendingmessageSchema = new mongoose.Schema({
  msg: {
    required: true,
    type: String,
  },
  sender: {
    publicKey: {
      type: String,
      required: true,
    },
    name: String,
  },
  receiver: {
    publicKey: {
      type: String,
      required: true,
    },
    name: String,
  },
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  timeStamps: {
    type: String,
  },
 
});
pendingmessageSchema.index({ "receiver.publicKey": 1 });
pendingmessageSchema.index({ "sender.publicKey": 1, "receiver.publicKey": 1 });
export const Messages = mongoose.model("pendingMessages", pendingmessageSchema);