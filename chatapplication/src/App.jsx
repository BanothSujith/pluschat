import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Loginregister from "./components/Login-register.jsx";
import Not from "./components/Notfound.jsx";
import  Protector from "./components/Protector.jsx";
import Notification from "./components/Notification.jsx";
import {  useSelector } from "react-redux";
import PopUp from "./components/PopUp.jsx";
import { useEffect, useState } from "react";

export default function App() {
  const message = useSelector((state) => state.chat.notification);
 const popUpMessage = useSelector((state) => state.chat.overlayMessage);
 const [overlayMessage, setOverlayMessage] = useState("");
 useEffect(() => {
  // console.log(popUpMessage);
   setOverlayMessage(popUpMessage);
 }, [popUpMessage]);
  return (
    <BrowserRouter>
      <div className="relative text-[var(--text)] w-full h-[100svh] bg-linear-0 from-[var(--bg-from)]  from-10% via-[var(--bg-via)] via-90% to-[var(--bg-to)] to-100%) overflow-hidden ">
        <Routes>
          <Route path="/login" element={<Loginregister />} />
          <Route
            path="/"
            element={
              <Protector>
                <Layout />{" "}
              </Protector>
            }
          />
          <Route path="*" element={<Not />} />
        </Routes>
        <div className="absolute top-2 w-full flex flex-col justify-center items-center ">
          <Notification notifications={message} />
        </div>
       
              <PopUp message={overlayMessage} />
      
      </div>
    </BrowserRouter>
  );
}
