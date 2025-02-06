import { io } from "socket.io-client";
import { getLocalIPAddress } from "./getIp.js";

const host = getLocalIPAddress();// this should be server ip address

const socket = io(`http://${host}:9000`);

socket.on("connect", () => {
  const socketId = "HSc14-socGpeqxcpAAAL";
  socket.emit("directMessage", { socketId, msg: "hdsfkjahfjskhgdfg" });
});
