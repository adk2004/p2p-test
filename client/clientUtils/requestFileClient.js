import { io } from "socket.io-client";
import { startReceivingFile } from "./recieveFile.js";

const socket = io(`http://192.168.66.75:9000`);
let availablePort = null;

socket.on("connect", async () => {
  console.log("Connected to server with socket ID:", socket.id);
  socket.emit("requestFile", {
    fileId: "67e1a8ea31719f22e67918dd",
  });
  if (availablePort === null) {
    console.log("Waiting for available port...");
    let timer = setInterval(async () => {
      if (availablePort !== null) {
        console.log(`Port found: ${availablePort}. Starting file download.`);
        clearInterval(timer);
        startReceivingFile("192.168.137.10",availablePort);
        availablePort = null;
      } else {
        console.log("Port not found yet. Retrying...");
      }
    }, 100);
  } else {
    startReceivingFile(availablePort);
    availablePort = null;
  }
});

socket.on("free-port", (data) => {
  availablePort = data.availablePort;
});
