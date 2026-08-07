import { useEffect, useRef, useState } from 'react';
import useGetAllMessage from '../Hooks/UseGetAllMessage';
import MsgCard from '../pages/msgCard';
import MsgInputCard from '../pages/MsgInputCard';
import { useDispatch } from 'react-redux';
import { decreaseUnreadMessages, deleteUser } from '../redux/reducers';
import { IoArrowBack } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion';
import DefaultuserProfile from '../pages/DefaultuserProfile';
function ChatPage({
  selectedChat,
  setIsChatOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  searchUserRef,
}) {

  const messages = useGetAllMessage({ user: selectedChat });
  const chatpageref = useRef(null);
  const scrollHeight = chatpageref?.current?.scrollHeight;
  const dispatch = useDispatch();
  // console.log(selectedChat)
  useEffect(() => {
    if (chatpageref.current) {
      chatpageref.current.scrollTo({
        top: chatpageref.current.scrollHeight,
        behavior: "smooth",
      });
    }
    dispatch(
      decreaseUnreadMessages(
        selectedChat?.user?.publicKey || selectedChat?.publicKey,
      ),
    );
  }, [chatpageref?.current, scrollHeight, selectedChat?.unreadMessages]);
  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`${
          selectedChat?.user?.name?.trim() || selectedChat?.name?.trim() ? "flex" : "hidden"
        }  h-fit justify-between  shadow-[inset_var(--shadow)] `}
      >
        <div className="text-[var(--text)] flex items-center max-w-[80%] md:max-w-9/16 pt-2">
          <button
            onClick={() => setIsChatOpen(false)}
            className="lg:hidden p-2 aspect-square rounded-full hover:bg-[var(--bg)] group transition-all ease-in-out duration-150 flex justify-center items-center"
          >
            <IoArrowBack
              className="group-hover:scale-90 transition-all duration-100 ease-in  "
              size={20}
            />
          </button>
          {selectedChat?.profile &&
          selectedChat?.profile !== "data:image/webp;base64," ? (
            <img
              alt="profile"
              src={selectedChat?.profile}
              loading="lazy"
              className="w-12 aspect-square rounded-full border aspect-square  m-2 mx-4 "
            />
          ) : (
            <DefaultuserProfile
              data={
                "w-12 aspect-square rounded-full border aspect-square  m-2 mx-4"
              }
            />
          )}
          <span className="md:text-3xl line-clamp-1 tracking-tight">
            {selectedChat?.user?.name ||
              selectedChat?.name ||
              "click a contact to start chat"}
          </span>
        </div>
        <div className="relative w-fit flex flex-col items-center justify-center gap-1 px-4">
          <button
            onClick={() => setIsDeleteOpen((prev) => !prev)}
            className=" group flex flex-col gap-0.5 p-1 h-9 aspect-square justify-center items-center rounded-full hover:bg-[var(--bg)] transition-all duration-100 ease-in-out "
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="p-[2px] rounded-full bg-[var(--text)] w-0.5  group-hover:p-[2.1px] "
              ></span>
            ))}
          </button>
          <AnimatePresence>
            <motion.button
              key={isDeleteOpen}
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.01,
                backgroundColor: "#ff0000",
                color: "#fff",
              }}
              onClick={() =>
                dispatch(
                  deleteUser(
                    selectedChat?.user?.publicKey || selectedChat?.publicKey,
                  ),
                )
              }
              transition={{ duration: 0.2, ease: "easeInOut" }}
              exit={{ opacity: 0, scale: 0 }}
              className={`  ${isDeleteOpen ? "block" : "hidden"} absolute translate-y-9 -left-2.5 text-[#dbd6d6] font-semibold -translate-x-1/2 bg-[var(--card-bg)] px-5 py-1 w-fit text-nowrap  `}
            >
              Delete Chat
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
      {/* chat section */}
      <div
        ref={chatpageref}
        className="scrollbar-thin  scrollbar-thumb-[#5cc0bb] scrollbar-track-transparent overflow-x-hidden flex flex-col gap-6 w-full  px-12 py-6 h-full overflow-y-scroll "
      >
        {messages?.map((m, index) => (
          <div
            key={index}
            className={`flex  ${
              m.msgType === "sent" ? "justify-end " : "justify-start"
            }`}
          >
            <MsgCard m={m} />
          </div>
        ))}
      </div>
      {(selectedChat?.user || selectedChat?.name) && (
        <div className={`h-fit p-2 w-full  `}>
          <MsgInputCard
            selectedChat={selectedChat}
            chatpageref={chatpageref?.current}
          />
        </div>
      )}
      {!selectedChat?.user && !selectedChat?.name && (
        <div className="flex items-center justify-center w-full h-full  -translate-y-1/2">
          <button
            onClick={() => searchUserRef.current.focus()}
            className="text-[var(--text)] flex items-center justify-center gap-2 px-4 py-2 rounded-lg
    hover:shadow-[inset_0px_0px_60px_5px_var(--shadow2)]
    hover:scale-[1.01] transition-all duration-150 ease-in"
          >
            <span className="text-4xl leading-none">+</span>
            <span className="text-xl">select/Search User</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatPage