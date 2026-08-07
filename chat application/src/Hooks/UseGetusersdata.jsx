import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

function useGetusersdata() {
  const searchedusers = useSelector((state) => state.chat.searchUsers);
  const users = useSelector((state) => state.chat.users);
  const messages = useSelector((state) => state.chat.msg);
  const currentUserPublicKey =
    JSON.parse(localStorage.getItem("user") || "{}")?.publickKey || "";
useEffect(()=>{
},[searchedusers])
  const chatList = useMemo(() => {

    const finalUsers = [];
    const usersdata = Object.keys(searchedusers).length > 0 ? searchedusers : users;
    Object.keys(usersdata).forEach((key) => {
      const user = {
        publicKey: key,
        name: users[key]?.name || searchedusers[key]?.name,
      };
      const unreadMessages = users[key]?.unreadMessages || 0;
      const lastMsgId = users[key]?.msgs?.at(-1);
      const lastMessage = messages[lastMsgId]?.msg;
      const timeStamps = Number(messages[lastMsgId]?.timeStamps);
      const messageType =
        messages[lastMsgId]?.sender?.publicKey === currentUserPublicKey
          ? "sent"
          : "received";
      const messageStatus = messages[lastMsgId]?.status;
      
const profile = searchedusers[key]?.profile || users[key]?.profile;  ;
      finalUsers.push({
        user: user,
        lastMessage: lastMessage,
        timeStamps: timeStamps,
        messageType: messageType,
        messageStatus: messageStatus,
        unreadMessages: unreadMessages,
        profile:profile,
      });
    });
    return finalUsers.sort((a, b) => b.timeStamps - a.timeStamps);
  }, [messages, users, searchedusers]);
  return chatList;
}

export default useGetusersdata;
