import { useMemo } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

function useGetAllMessage({ user, offset = 0, limit = 10 }) {
  const users = useSelector((state) => state.chat.users);
  const messages = useSelector((state) => state.chat.msg);

  return useMemo(() => {
    const publicKey = user?.user?.publicKey || user?.publicKey;
    const messageIds = users[publicKey]?.msgs || [];

    const finalmessages = messageIds.map((id) => {
      const m = messages[id];

      const type = m?.receiver?.publicKey === publicKey ? "sent" : "received";

      return {
        msg: m?.msg,
        timeStamps: Number(m?.timeStamps) || 0, 
        msgType: type,
        sender: m?.sender,
        receiver: m?.receiver,
        status: m?.status,
        msg_id: id,
      };
    });

    return finalmessages.sort((a, b) => a.timeStamps - b.timeStamps);
  }, [users, messages, user]); 
}

export default useGetAllMessage;
