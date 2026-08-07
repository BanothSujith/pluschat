import { MessageStatusModel } from "../model/MessageStatus.js";
import storePendingMessage from "../Utility/handleStorePendingMessages.js";
import { fetchPendingMessages } from "./fetchPendingMessages.js";

export const socketshandler = async (socket) => {
  console.log(" Connected:", socket.id);

  try {
    const publicKey = socket?.user?.publicKey;

    if (!publicKey) {
      console.log(" Public key missing");
      socket.disconnect();
      return;
    }

    // Join private room (NOT group)
    socket.join(publicKey);
    socket.publicKey = publicKey;

    console.log(` User ${publicKey} joined their room`);

    // Send pending messages
    try {
      const pendingMessages = await fetchPendingMessages(publicKey);
      socket.emit("pending-messages", {
        status: "success",
        data: pendingMessages,
      });
    } catch (err) {
      console.error(" Error fetching pending messages:", err);
    }

    //  SEND MESSAGE
    socket.on("msg", async (m) => {
      try {
        const receiverKey = m?.receiver?.publicKey;
        const senderKey = m?.sender?.publicKey;
        if (!receiverKey || !senderKey) {
          console.log(" Invalid message payload", m);
          return;
        }

        // Check if receiver is online
        const receiverSockets = await socket.in(receiverKey).fetchSockets();
                 console.log("receiverKey", receiverSockets);

        if (receiverSockets.length > 0) {
          //  Send to receiver
          socket.to(receiverKey).emit("reply", {
            ...m,
            status: "sent",
          });
        } else {
          // Store if offline
          storePendingMessage(m );
        }

        // Sync across sender devices
        socket.to(senderKey).emit("sync-sent-msg", m);
      } catch (err) {
        console.error(" Error in msg event:", err);
      }
    });

    //  SEEN EVENT
    socket.on("seen", async (m) => {
      console.log("seen event received:", m);
      try {
        const { senderPublicKey, msg_id } = m;
        if (!senderPublicKey) return;
          
        const senderSockets = await socket.in(senderPublicKey).fetchSockets();
            
        if (senderSockets.length === 0) {
          console.log(" Sender offline (seen not delivered)",m);
                    // storePendingMessage({ ...m, isPendingMsg: false });
                    
              try {
                await MessageStatusModel.updateOne({_id: m?.msg_id}, {$set: {
                  receiverPublicKey: m.senderPublicKey,
                  status: "seen",
                },
               $setOnInsert: {
      _id: m.msg_id, 
    },
              },
                {upsert:true}
              );
              } catch (error) {
                console.error(" Error creating message status:", error?.errmsg);
              }
        }

        socket.to(senderPublicKey).emit("seenAck", {
          msg_id,
          status: "seen",
        });
      } catch (err) {
        console.error(" Error in seen event:", err);
      }
    });

    //  MESSAGE ACK
    socket.on("msg-Ack", async (m) => {
      try {
        const { sender, msg_id } = m;
        const senderKey = sender?.publicKey;

        if (!senderKey) return;

        const senderSockets = await socket.in(senderKey).fetchSockets();

        if (senderSockets.length === 0) {
          console.log("Sender offline (ack not delivered)");
          try {
            await MessageStatusModel.create({
              receiverPublicKey: senderKey,
              _id: msg_id,
              status: "sent",
            });
          } catch (error) {
            console.error(" Error creating message status:", error?.errmsg);
          }
          return ;
        }
        
        socket.to(senderKey).emit("msg-Ack", {
          msg_id,
          status: "sent",
        });
      } catch (err) {
        console.error(" Error in msg-Ack:", err);
      }
    });
    // disconnect event
    socket.on("disconnect", (reason) => {
      console.log(` Disconnected: ${socket.id} | Reason: ${reason}`);
    });
  } catch (err) {
    console.error(" Socket connection error:", err);
    socket.disconnect();
  }
};
