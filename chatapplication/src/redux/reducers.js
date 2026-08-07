import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../utils/socket";

const localmsg = localStorage.getItem("msg")
  ? JSON.parse(localStorage.getItem("msg"))
  : {};
let users = localStorage.getItem("users")
users = users ? JSON.parse(users) : {}; 
const chatappslice = createSlice({
  name: "chatapp",
  initialState: {
    msg: localmsg,
    notification: [],
    users: users,
    searchUsers: {},
    overlayMessage : "",
  },

  reducers: {
    setmsg: (state, action) => {
      const payload = action.payload;
      state.msg[payload.msg_id] = {
        receiver: {
          publicKey: payload.receiver.publicKey,
          name: payload.receiver?.name,
        },
        sender: {
          publicKey: payload.sender.publicKey,
          name: payload.sender.name,
        },
        msg: payload.msg,
        timeStamps: payload.timeStamps,
        status: "pending",
      };

      const userId = payload.isreceived
        ? payload.sender.publicKey
        : payload.receiver.publicKey;

      if (!state.users[userId]) {
        state.users[userId] = {
          name: payload?.isreceived
            ? payload?.sender?.name
            : payload?.receiver?.name,
          profile:  "",
          msgs: [],
          unreadMessages: 0,
        };
      }
      state.users[userId].msgs.push(payload.msg_id);
 state.users[userId].profile = payload?.receiver?.profile || "";
      if (payload.isreceived) {
        state.users[userId].unreadMessages =
          (state.users[userId].unreadMessages || 0) + 1;
        state.users[userId].profile = payload?.sender?.profile || "";
      }
      localStorage.setItem("msg", JSON.stringify(state.msg));
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    setSearchUsers: (state, action) => {
      const payload = action?.payload;
      const searchUsers = {};
      payload?.forEach((ele) => {
        const publicKey = ele?.publicKey;
        const name = ele?.name;
        searchUsers[publicKey] = {
          msgs: [users[publicKey]?.msgs?.at(-1)],
          name: name,
          profile:ele?.profile,
        };
      });
      state.searchUsers = searchUsers;
    },

    markseenMsg: (state, action) => {
      const msg_id = action?.payload?.msg_id;
      const status = action?.payload?.msg_status;
      state.msg[msg_id].status = status;
      localStorage.setItem("msg", JSON.stringify(state.msg));
    },
    handlependingMsgs: (state, action) => {
      console.log("pending". action?.payload)
      const { data } = action?.payload?.msgs;
      const pendingMessages = data?.response;
      const statusResponse = data?.statusResponse;
     
      const msgs = {};
      pendingMessages.forEach((msgdata) => {
        const sender = msgdata?.sender;
        const messages = msgdata?.messages;
        const receiver = {
          publicKey: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))?.publickKey
            : "",
          name: localStorage.getItem("userName")
            ? localStorage.getItem("userName")
            : "",
        };

        messages.forEach((message) => {
          const msg_id = message?.msg_id;
          const timeStamps = message?.timeStamps;
          const msg = message?.msg;
          msgs[msg_id] = {
            receiver: receiver,
            sender: sender,
            msg: msg,
            timeStamps: timeStamps,
            status: "sent",
          };

          socket.emit("msg-Ack", { sender: sender, msg_id: msg_id });
          if (!state.users[sender?.publicKey]) {
            state.users[sender?.publicKey] = {
              name: sender?.name,
              msgs: [],
              unreadMessages: 0,
            };
          }
          state.users[sender?.publicKey].msgs.push(msg_id);
          state.users[sender?.publicKey].unreadMessages =
            (state.users[sender?.publicKey].unreadMessages || 0) + 1;
        });
      });
      state.msg = { ...state.msg, ...msgs };
      statusResponse.forEach((status) => {
        console.log("statusResponse", status);
        const msg_id = status?._id;
        const msg_status = status?.status;
        state.msg[msg_id].status = msg_status;
      });
      localStorage.setItem("msg", JSON.stringify(state.msg));
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    decreaseUnreadMessages: (state, action) => {
      const userId = action.payload;
      if (state.users[userId]) {
        state.users[userId].unreadMessages = Math.max(
          0,
          (state.users[userId].unreadMessages || 0) - 1,
        );
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    },
    deleteUser: (state, action) => {
      const userId = action.payload;

      const msgIdsToDelete = state.users[userId]?.msgs || [];

      if (state.users[userId]) {
        state.users[userId].msgs = [];
        state.users[userId].unreadMessages =0;
      }

      msgIdsToDelete.forEach((msgId) => {
        delete state.msg[msgId];
      });

      localStorage.setItem("users", JSON.stringify(state.users));
      localStorage.setItem("msg", JSON.stringify(state.msg));
    },
    setNotification: (state, action) => {
      const { msg, sender } = action.payload;

      state.notification.push({
        name: sender.name,
        msg,
      });
    },
    popNotification: (state, action) => {
      state.notification.shift();
    },
    setOverlayMessage:(state,action) =>{
      state.overlayMessage = action.payload
      // console.log(action.payload)
    }
  },
});

export const {
  setmsg,
  setSearchUsers,
  markseenMsg,
  handlependingMsgs,
  decreaseUnreadMessages,
  deleteUser,
  setNotification,
  popNotification,
  setOverlayMessage,
} = chatappslice.actions;
export const chatappreducer = chatappslice.reducer;
