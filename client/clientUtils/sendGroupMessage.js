import { io } from "socket.io-client";
import { getLocalIPAddress } from "./getIp.js";
import { getFolderContents } from "./construcFileList.js";

const host = getLocalIPAddress();

const socket = io(`http://${host}:9000`);

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
  socket.emit(
    "register",
    {
      username: "Akshay",
      ip: host,
      fileList: getFolderContents("C:\\Users\\Hp\\Documents\\LAB"),
    },
    (response) => {
      if (response.success) {
        console.log("Registration successful:", response.message);
      } else {
        console.error("Registration failed:", response.message);
      }
    }
  );
  socket.on("connect", () => {
    console.log("Connected to server with socket ID:", socket.id);
    socket.emit(
      "register",
      {
        username: "Akshay",
        ip: host,
        fileList: getFolderContents("C:\\Users\\Hp\\Documents"),
      },
      (response) => {
        if (response.success) {
          console.log("Registration successful:", response.message);
        } else {
          console.error("Registration failed:", response.message);
        }
      }
    );
  });
  socket.emit("groupMessage", "Hello from client");
});
