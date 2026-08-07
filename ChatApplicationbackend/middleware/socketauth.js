import { verify } from "../Utility/JWT.js";

export const socketauth = async (socket,next ) =>{
   try {
      const cookie = socket?.handshake?.headers?.cookie;
         // console.log("cookie", cookie );
      if(!cookie) { 
         return next(new Error(" cookies missing.... "));
      }
         const token = cookie.split("token=")[1];
       
       
      
      //    console.log(token)
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = await verify(token);
      if (!payload) {
        return next(new Error("Unauthorized payload not received...!"));
      }
      socket["user"] = payload;

      next();
   } catch (error) {
      console.error( " Sockets authentication failed... ", error)
   }
}