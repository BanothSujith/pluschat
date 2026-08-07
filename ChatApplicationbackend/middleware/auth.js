import {sendresponse}   from "../Utility/response.js";
import {verify} from "../Utility/JWT.js";
export const authenticate = async (req,res,next)=>{
const cookies = req.cookies;

const token =  cookies?.token;

if (!token) {
   return sendresponse(res,401,"Failed","Please Login to continue....!");
}

const payload = await verify(token);
if(!payload){
    return sendresponse(res,401,"Failed", "Please Login To Continue......!");
}
req["user"] = payload;

next();
}