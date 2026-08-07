import {  User } from "../model/User.js";
import {sendresponse} from "../Utility/response.js";
import bcrypt from "bcrypt";
import {sign} from "../Utility/JWT.js"
import sharp from "sharp";

//register
export const register = async (req, res) =>{
  try {
       const payload = req?.body;
       if(!payload)
              {
         return sendresponse(
           res,
           400,
           "Failed",
           "Data not recieved Please pass the data...."
         );  
              } 
       
        const Email = payload?.Email;
        const PhoneNo = payload?.PhoneNo;
        const Name = payload?.Name;
        const Password = payload?.Password;
       //  console.log(Email , PhoneNo, Name);
        if(!Email && !PhoneNo ){
            return sendresponse(
              res,
              400,
              "Failed",
              "Email Or Phone Number is Required....!"
            );
        }

        if(!Name){
              return sendresponse(res, 400, "Failed", "Name is Required....!");
        
             }
             if (!Password) {
             return sendresponse(
               res,
               400,
               "Failed",
               "Password is Required....!"
             );
             }
       
             const publickey = await bcrypt.genSalt(20);
       //       console.log(publickey);
       const compresesedBuffer = ""
       if(req.file){
        compresesedBuffer = await sharp(req?.file?.buffer)
       .resize({width:400})
         .webp({ quality: 40 })
         .toBuffer();
       }
   const user = await User.create({
     name: Name,
     email: Email,
     phoneNo: PhoneNo,
     password: Password,
     publicKey: publickey,
     profile: {
       data: compresesedBuffer,
       contentType: "image/webp",
     },
   });
if(user){
                  return sendresponse(
                    res,
                    200,
                    "Success",
                    "Registeration is Success....!"
                    // { PublicKey: user?.publicKey },
                  );

}

  } catch (error) {
       console.log(" Failed to Register new user : ",error);
       if (error?.errmsg){
            return sendresponse(
              res,
              409,
              "Failed",
              "Already user exist with this email or phoneNo ",
              error.errmsg,
            ); 
       }
       return sendresponse(
         res,
         502,
         "Failed",
         "Internal Server Error....! Please try again Later"
       );
  }
 



}

// login 

export const login = async (req,res)=>{
      try {
         const payload = req?.body;
          //  console.log(payload);

         if (!payload) {
           return sendresponse(
             res,
             400,
             "Failed",
             "Data not recieved Please pass the data....",
           );
         }

         const Email = payload?.Email;
         const PhoneNo = payload?.PhoneNo;
         const Password = payload?.Password;
         if (!Email && !PhoneNo) {
           return sendresponse(
             res,
             400,
             "Failed",
             "Email Or Phone Number is Required....!",
           );
         }
         if (!Password) {
           return sendresponse(res, 400, "Failed", "Password is Required....!");
         }

         //find by email or phone number
         const emailorphone = Email ?? PhoneNo;
         const user = await User.findOne({
           $or: [{ email: emailorphone }, { phoneNo: emailorphone }],
         });
        //  console.log(user);
         if (!user) {
           return sendresponse(
             res,
             404,
             "Failed",
             "User not found please check you credentials....!",
           );
         }
         const encrypassword = user?.password;
         const ispasswordmatch = await bcrypt.compare(Password, encrypassword);
        //  console.log(ispasswordmatch);
         if (!ispasswordmatch) {
           return sendresponse(
             res,
             400,
             "Failed",
             "Password is Mismatched....!",
           );
         }
         const publicKey = user?.publicKey;
         const userProfile = user?.profile;
         const payloaddata = {
           Name: user?.name,
           publicKey: user?.publicKey,
          //  userProfile: user?.profile,
         };
         const JWTtoken = await sign(payloaddata);
         if (!JWTtoken)
           return sendresponse(
             res,
             400,
             "Failed",
             "Token not generation failed....!",
           );
         res.cookie("token", JWTtoken, {
           httpOnly: true,
           secure: false, // true in production with HTTPS
           sameSite: "lax", // or "none" if using HTTPS and cross-site
         });
         const profile = userProfile?.data?.toString("base64");
         return sendresponse(
           res,
           202,
           "Success",
           "Logged in successfull ....!",
           {
             name: user?.name,
             publicKey: publicKey,
             userProfile: `data:${userProfile?.contentType};base64,${profile}`,
           },
         );
      } catch (error) {
        console.log("error while login", error)
      }
}



// get users
export const userdata = async (req,res)=>{
 try {
   console.log(req.user.publicKey);
   const userdata = req?.user;
   if (!userdata || !userdata?.publicKey) {
     return sendresponse(
       res,
       401,
       "Failed",
       "Unautorized please login with correct credentials.....");
   }
   const query = req?.query?.q?.trim();
   //find user with name or phone or email

  //  const users = await User.find({
  //    $or: [{ name: query }, { email: query }, { phoneNo: query }],
  //  });

  //regex
const users = await User.find({
  $or: [
    { name: { $regex: `.*${query}*`, $options: "i" } },
    { email: { $regex: `.*${query}*`, $options: "i" } },
    { phone: { $regex: `.*${query}*`, $options: "i" } },
  ],
})
  .select("name publicKey profile")
  .lean();
 if (users.length == 0) {
   return sendresponse(res, 404, "Sucess", "Users not found");
 }
const updatedUsers=users.map((user)=>{
const profileBase64 = user?.profile?.data?.toString("base64")
  const profile = `data:${user?.profile?.contentType};base64,${profileBase64}`;
  return {...user, profile }   
 })

// console.log(users);
  
   return sendresponse(res, 202, "Sucess", "Users found...!", updatedUsers);
 } catch (e) {
  console.error("Failed to find users check userdata contoller : ", e);
  return sendresponse(res,502,"Internal Server Issue", "Please contact the developer or admin...!");
 }
}