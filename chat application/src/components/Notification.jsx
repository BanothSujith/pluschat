import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { popNotification } from "../redux/reducers";

export default function Notification({ notifications=[{name:"sujith",msg:"gfu"}] }) {
  const dispatch = useDispatch();
  return (
    <AnimatePresence>
      {notifications.map((item,i) => {
         const total = notifications.length;
         const reverseIndex = total - i - 1;
         setTimeout(() => {
          dispatch(popNotification())
        }, 4000);
        return (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: reverseIndex * 12, // only a small part of previous cards visible
              scale: 1 - reverseIndex * 0.03,
              zIndex: total - reverseIndex,
            }}
            exit={{
              opacity: 0,
              x: 80,
            }}
            transition={{ duration: 0.25 }}
            className=" w-80 rounded-xl bg-[#989cce59] p-4 shadow-xl backdrop-blur-md"
          >
            <h3 className="font-bold">New message</h3>
            <p>
              <strong>{item.name}</strong>: {item.msg}
            </p>
          </motion.div>
        );})}
    </AnimatePresence>
  );
}
