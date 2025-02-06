import { io } from "socket.io-client";
import { getFolderContents } from "./construcFileList.js";
import { getLocalIPAddress } from "./getIp.js";

const host = getLocalIPAddress(); 

const socket = io(`http://192.168.66.59:9000`);

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
  socket.emit(
    "register",
    {
      username: "Akshay",
      ip: host,
      fileList: getFolderContents("C:\\Users\\Hp\\Documents\\osLab"),
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
socket.on("message", (data) => {
  console.log(`Message from server:, ${data.message} by ${data.owner}`);
});
socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});
