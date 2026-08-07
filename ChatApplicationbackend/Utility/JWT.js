import jwt from "jsonwebtoken";

export const sign = async (data) => {
  try {
    const token = await jwt.sign(data, "Sujith chat secret");
    // console.log(token);
    return token;
  } catch (error) {
    return error;
  }
};


export const verify = async (token) => {
  try {
    // console.log("token",token);
    const result =await jwt.verify(token, "Sujith chat secret");
    // console.log("payload", result);
    return result;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null; // safer than returning raw error
  }
};