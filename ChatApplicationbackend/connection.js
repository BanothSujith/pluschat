import mongoose from "mongoose";

//connect mongodb
export const connection = (url) => {
    try {
        mongoose.connect(url)
        .then(console.log("MongoDB DataBase connected successfully.........!"))
    } catch (error) {
        console.error("Error while connecting Data base..", error);
    }
}