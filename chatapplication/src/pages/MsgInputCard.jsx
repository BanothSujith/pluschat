import { useState } from 'react'
import {useDispatch} from 'react-redux'
import { setmsg} from '../redux/reducers.js'
import { socket } from '../utils/socket.js';

function MsgInputCard({ selectedChat, chatpageref }) {
  const [message, setmessage] = useState("");
  const dispatch = useDispatch();
  const handlesubmit = (e) => {
    e.preventDefault();
    // console.log(message);
    const sender = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))?.publickKey
      : "";
    // console.log("sender", sender);
    const receiver = selectedChat?.user?.publicKey
      ? selectedChat?.user?.publicKey
      : selectedChat?.publicKey;
    const receiverName = selectedChat?.user?.name
      ? selectedChat?.user?.name
      : selectedChat?.name;
    const msg = message;
    const timeStamps = Date.now();
    const msg_id = Math.random().toString(36).substring(2, 10);
    const senderUserName =localStorage?.getItem("userName") || "Guest"
    const msgdata = {
      receiver: {
        publicKey: receiver,
        name: receiverName,
        profile: selectedChat?.profile,
      },
      sender: {
        publicKey: sender,
        name: senderUserName,
        profile: localStorage.getItem("userProfile"),
      },
      msg: msg,
      timeStamps: timeStamps,
      status: "pending",
      msg_id: msg_id,
      isreceived: false,
    };
   
    dispatch(setmsg(msgdata));
     socket.emit("msg",{...msgdata, isreceived:true});
     
    setmessage("");
  };

  return (
    <form
      onSubmit={(e) => handlesubmit(e)}
      className="w-full rounded-3xl border-2 px-4 py-1  h-15 flex items-center justify-between"
    >
      <div className="flex w-full h-full  items-center ">
        <textarea
          name="message"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          onKeyDown={(e)=>{if(e.key === "Enter"){handlesubmit(e)}}}
          placeholder="Enter a message"
          className="w-full  outline-0 h-full resize-none scrollbar-hide leading-normal py-3"
        />
      </div>
      <button
        type="submit"
        disabled={message.trim().length > 0 ? false : true}
        className=" border h-[90%]  aspect-video flex justify-center items-center font-semibold text-[var(--text)] rounded-full disabled:bg-[#161616] disabled:text-white disabled:cursor-not-allowed transition-all duration-100 ease-in hover:bg-[var(--button-bg)]  "
      >
        Send
      </button>
    </form>
  );
}

export default MsgInputCard