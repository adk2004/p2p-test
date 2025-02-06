import { io } from "socket.io-client";
import { getLocalIPAddress } from "./getIp.js";

const host = getLocalIPAddress();

const socket = io(`http://192.168.66.59:9000`);

socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("groupMessage", "Hello Bhai ab OS padl ete hai vrna amrebdra gand mardega");
});
