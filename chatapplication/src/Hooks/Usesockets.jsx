import { useEffect } from "react";
import { socket } from "../utils/socket";
import { useDispatch } from "react-redux";
import { handlependingMsgs, markseenMsg, setmsg, setNotification } from "../redux/reducers";
import { enableNotifications } from "../utils/notification";

export const useSockets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleReply = (r) => {
      // console.log("reply", r);
      // alert("reply",r)
      enableNotifications(r?.msg);
      dispatch(setmsg(r));
      dispatch(setNotification(r));
      socket.emit("msg-Ack", r);
    };

    const handleSync = (m) => {
      dispatch(setmsg({ ...m, isreceived: false }));
    };
    const handleSeenMsgs = (m) => {
      // console.log("seenAck received for seen:", m);
      dispatch(markseenMsg({ msg_id: m?.msg_id, msg_status: m?.status }));
    };
    const handlePendingMsgs = (msgs) => {
      dispatch(handlependingMsgs({msgs}));
      console.log("pen sockey",msgs)
    };
  
    socket.on("reply", handleReply);
    socket.on("sync-sent-msg", handleSync);
    socket.on("seenAck", handleSeenMsgs);
    socket.on("msg-Ack", handleSeenMsgs);
    socket.on("pending-messages", handlePendingMsgs);


    return () => {
      socket.off("reply", handleReply);
      socket.off("sync-sent-msg", handleSync);
      socket.off("seenAck", handleSeenMsgs);
      socket.off("msg-Ack", handleSeenMsgs);
      socket.off("pending-messages", handlePendingMsgs);

    };
  }, []);
};
