import cors from "cors";
import express, { urlencoded } from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { registerHandler } from "./eventHandlers/userEvents.handler.js";
import { User } from "./models/user.model.js";
import { File } from "./models/file.model.js";

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.resolve("./public")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET"],
  },
});
// http events

import userRouter from "./routes/user.routes.js";
import { Message } from "./models/message.model.js";

app.use("/api/users", userRouter);

// socket events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", async (data) => await registerHandler(socket, data));
  socket.on("groupMessage", async (msg) => {
    console.log("Message from client:", msg);
    // const user = await User.findOne({ socketId: socket.id });
    const user = await User.findOne({ socketId: socket.id });
    const message = new Message({ text: msg, type: "group" });
    await message.save();
    
    io.emit("message", { message: msg });
  });
  socket.on("directMessage", (data) => {
    console.log("Message from client:", data.msg, "for ", data.socketId);
    io.to(data.socketId).emit("message", { message: data.msg });
  });
  socket.on("requestFile", async (data) => {
    const user = await File.aggregate([
      {
        $match: { filePath: data.filePath },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
    ]);
    console.log("User:", user);
    io.to(user[0].socketId).emit("file", { filePath: data.filePath });
  });
  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    const user = await User.findOne({ socketId: socket.id });
    await File.deleteMany({ owner: user._id });
  });
});

export { server };
