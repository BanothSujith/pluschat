import  { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ContactsPage from "./components/ContactsPage";
import ChatPage from "./components/ChatPage";
import axios from "axios";
import useGetusersdata from "./Hooks/UseGetusersdata";
import { useNavigate } from "react-router-dom";
import { socket } from "./utils/socket";
import {useSockets} from "./Hooks/Usesockets";
import {useDispatch} from "react-redux";
import {setSearchUsers} from "./redux/reducers";

function Layout() {
  const [width, setWidth] = useState(30); 
  const [search, setSearch] = useState("");
  const allUsers = useGetusersdata();
  const [users, setUsers] = useState(allUsers);
const [selectedChat, setSelectedChat] = useState({});
const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
 const [windowSize, setWindowSize] = useState(window.innerWidth)
useSockets();
 try {
  socket.connect();
 } catch (error) {
  useNavigate("/login")
 }
const dispatch = useDispatch();
const searchUserRef = useRef(null);
  const handleDrag = (event, info) => {
    const percentage = (info.point.x / window.innerWidth) * 100;
    const newWidth = Math.min(Math.max(percentage, 25), 45);
    setWidth(newWidth);
  };
   useEffect(() => {
     function handleResize() {
       setWindowSize( window.innerWidth);
     }

     window.addEventListener("resize", handleResize);

     // cleanup
     return () => {
       window.removeEventListener("resize", handleResize);
     };
   }, []);
useEffect(() => {
   
  setUsers(allUsers);
}, [allUsers, isChatOpen]);
useEffect( () => {
  const timer = setTimeout(async () => {
    if (search.trim()) {
      try {
        // console.log("Searching:", search);
        // call API or filter users here
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user?q=` + search,
          {
            withCredentials: true,
          },
        );
        const users2 = result?.data?.Data;
        dispatch(setSearchUsers(users2));
      } catch (error) {
        console.log("error",error)
        if (error.toString().includes("Request failed with status code 401"))
           {
            localStorage.removeItem("user");
            navigate('/login')
           }
        }
    }
  }, 400); 
if(search.trim() == ""){
          dispatch(setSearchUsers([]));

}
  return () => clearTimeout(timer);
}, [search]);

function handleSearch(e) {
  const value = e.target.value;
  setSearch(value);
}
  return (
    <motion.div
      onClick={() => (isDeleteOpen ? setIsDeleteOpen(false) : "")}
      className="w-full h-full flex overflow-hidden pb-2 overflow-hidden"
    >
      {/* Contact Section */}
      <div
        className={` ${isChatOpen ? "hidden lg:flex" : "flex "} flex-col overflow-hidden `}
        style={{
          width: `${!isChatOpen && windowSize < 980 ? "100" : width}%`,
        }}
      >
        <div className=" p-3 pb-0  text-[clamp(1.5rem,2.5vw,4rem)] poppins font-bold tracking-wider">
          <span>Pulse Chat </span>
        </div>
        <div className="w-full px-2 p-3  ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("entered", e?.target[0]?.value);
            }}
          >
            <input
              ref={searchUserRef}
              type="search"
              onChange={(e) => handleSearch(e)}
              placeholder="Search contacts..."
              className="bg-[var(--code-bg)]/20 shadow-2xl shadow-[inset_var(--shadow)] text-[var(--text)] placeholder:text-[var(--text)] border outline-none w-full h-10 rounded-full placeholder:opacity-70 px-4"
            />
          </form>
        </div>
        <ContactsPage
          searchUserRef={searchUserRef}
          users={users}
          setIsChatOpen={setIsChatOpen}
          setSelectedChat={setSelectedChat}
        />
      </div>
      {/* Divider */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        className="hidden lg:block w-[2px] cursor-col-resize bg-gray-500 hover:bg-blue-500"
      />

      {/* Chat Section */}
      <div className={`${!isChatOpen ? "hidden lg:flex" : "flex "} flex-1 `}>
        <ChatPage
          setIsChatOpen={setIsChatOpen}
          selectedChat={selectedChat}
          searchUserRef={searchUserRef}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      </div>
    </motion.div>
  );
}

export default Layout;