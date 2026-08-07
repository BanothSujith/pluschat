import { Messages } from "../model/Messages.js";
import { MessageStatusModel } from "../model/MessageStatus.js";

export const fetchPendingMessages = async (publicKey) => {
  try {
    const response = await Messages.aggregate([
      { $match: { "receiver.publicKey": publicKey } },
      {
        $group: {
          _id: "$sender",
          messages: {
            $push: {
              msg: "$msg",
              msg_id: "$_id",
              timeStamps: "$timeStamps",
            },
          },
        },
      },
      { $project: { _id: 0, sender: "$_id", messages: 1 } },
    ]);
    const statusResponse = await MessageStatusModel.find({ receiverPublicKey: publicKey });
    // console.log("Fetched pending messages:", response);
    const mergedResponse = {response, statusResponse};
    Messages.deleteMany({ "receiver.publicKey": publicKey }).catch((err) => {
      console.error("Error deleting pending messages:", err);
    });
    MessageStatusModel.deleteMany({ receiverPublicKey: publicKey }).catch((err) => {
      console.error("Error deleting message status:", err);
    });
    return mergedResponse;
  } catch (error) {
    console.error("Error fetching pending messages:", error);
    throw error;
  }
};