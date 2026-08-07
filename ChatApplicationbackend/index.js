import express from "express";
import http from "http";
import cors from "cors";
import routes from "./Routes/index.js";
import { connection } from "./connection.js";
import { User } from "./model/User.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {socketshandler} from "./Utility/socketshandler.js";
import dotenv from  "dotenv";
import { socketauth } from "./middleware/socketauth.js";
import { Messages } from "./model/Messages.js";
import { MessageStatusModel } from "./model/MessageStatus.js";

dotenv.config();


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.31.237:5173",
      "https://192.168.31.237:5173",
      "http://127.0.0.1:5173",
      "pluschat-e7u21ypt1-banoth-sujiths-projects.vercel.app",
      "https://pluschat.vercel.app/",
    ],
    credentials: true,
  },
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.31.237:5173",
  "https://192.168.31.237:5173",
  "http://127.0.0.1:5173",
  "pluschat-e7u21ypt1-banoth-sujiths-projects.vercel.app",
  "https://pluschat.vercel.app/",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

connection(process.env.mongodburl);

app.get("/", (req, res) => {
  res.status(202).send({ message: "hey you hit the base route....." });
});

app.get("/all", async (req, res) => {
  const result = await User.deleteMany({});
   Messages.deleteMany({});
   MessageStatusModel.deleteMany({})
  res.json({ message: result });
});

app.use("/api/v1", routes);

// sockets
io.use(socketauth);
io.on("connection", socketshandler);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
