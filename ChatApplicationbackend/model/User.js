import mongoose   from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    // required: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
  },
  profile:{
data:Buffer,
contentType:String,
  },
  publicKey:{
    type : String,
    required:true,
    unique:true,
  }
}, 
{timestamps:true}
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;

  try {
    const salt = await bcrypt.genSalt(3);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error("Failed to Convert password....", error);
  }
});
export const User = mongoose.model("User", UserSchema );