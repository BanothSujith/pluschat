import { Messages } from "../model/Messages.js";

const storePendingMessage = (data) => {
  const receiver = data?.receiver;
  const sender = data?.sender;
  const msg = data?.msg;
  const timeStamps = data?.timeStamps;
  const status = data?.status;
  const isreceived = data?.isreceived;
  const id = data?.msg_id;
  Messages.create({ _id: id, receiver: receiver, sender: sender, msg, timeStamps: timeStamps, status, isreceived }).then((d) => console.log("pending mesages", d));
};

export default storePendingMessage;