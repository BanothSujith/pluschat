import { motion } from 'framer-motion';
import ContactCard from "../pages/ContactCard.jsx";

function ContactsPage({
  searchUserRef,
  users,
  setSelectedChat,
  setIsChatOpen,
}) {
  function handlesearch() {
    // console.log(searchUserRef);
    searchUserRef.current.focus();
  }
  return (
    <motion.div className=" flex flex-col gap-2 h-full px-1  w-full overflow-hidden">
      {users?.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => handlesearch()}
            className="text-[var(--text)] flex items-center justify-center gap-2 px-4 py-2 rounded-lg
    hover:shadow-[inset_0px_0px_60px_5px_var(--shadow2)]
    hover:scale-[1.01] transition-all duration-150 ease-in"
          >
            <span className="text-4xl leading-none">+</span>
            <span className="text-xl">Search User</span>
          </button>
        </div>
      ) : (
        <div className=" w-full overflow-y-scroll scrollbar-hide pb-2 px-2">
          {users?.map((contact) => (
            <motion.button
              key={contact?.user?.publicKey || contact?.name}
              onClick={() => {
                setSelectedChat(contact)
                setIsChatOpen(true);
              }}
              className="rounded-lg  p-1 mt-2 hover:bg-[var(--accent)] bg-origin-padding transition-all duration-100 ease-linear w-full"
            >
              <ContactCard data={contact} />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ContactsPage