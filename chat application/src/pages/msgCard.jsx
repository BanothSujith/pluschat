import { useEffect, useRef } from "react";
import ReactTimeAgo from "react-time-ago";
import { socket } from "../utils/socket";
import { useDispatch } from "react-redux";
import { decreaseUnreadMessages, markseenMsg } from "../redux/reducers";

function MsgCard({ m }) {
  const msgRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && m.status !== "seen" && m?.msgType === "received") {
          const senderPublicKey = m?.sender?.publicKey;
          const msg_id = m?.msg_id;
          // call API/redux action here
          // markMessageAsSeen(m.id)
          socket.emit("seen", { senderPublicKey, msg_id });
                dispatch(
                  markseenMsg({ msg_id: msg_id, msg_status: "seen" }),
                );
           dispatch(decreaseUnreadMessages(senderPublicKey));
          // console.log("Message visible:", senderPublicKey, m);
        }
      },
      {
        threshold: .4,
      },
    );

    if (msgRef.current) {
      observer.observe(msgRef.current);
    }

    return () => {
      if (msgRef.current) {
        observer.unobserve(msgRef.current);
      }
    };
  }, [m]);

  return (
    <div
      ref={msgRef}
      className={`flex justify-between items-center gap-1 bg-[var(--bg)] py-1 pl-4 pr-1.5 w-fit max-w-[50%] ${
        m?.msgType === "sent"
          ? "rounded-b-[5px] rounded-l-[5px]"
          : "justify-start rounded-b-[5px] rounded-r-[5px]"
      }`}
    >
      <div className="flex justify-between items-baseline">
        <span className="font-medium ">{m?.msg}</span>
        {m?.timeStamps && (
          <ReactTimeAgo
            className="ml-2 text-xs self-end px-2"
            date={m?.timeStamps}
            locale="en-US"
            timeStyle="mini"
          />
        )}
      </div>

      <span
        className={`text-xs flex justify-end self-end ${
          m?.status === "seen" ? "text-blue-500" : "text-[#fffefe]"
        }`}
      >
        {m?.msgType === "sent" &&
          (m?.status === "sent" || m?.status === "seen" ? "✓✓" : "✓")}
      </span>
    </div>
  );
}

export default MsgCard;
