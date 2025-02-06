const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const serverIP = "192.168.50.18";
const serverPort = 9000;

const publicFolder = path.join(__dirname, "public");
if (!fs.existsSync(publicFolder)) {
  fs.mkdirSync(publicFolder);
}

const wss = new WebSocket.Server({ host: serverIP, port: serverPort });

console.log(`WebSocket server running at ws://${serverIP}:${serverPort}/`);

let fileStream = null;

wss.on("connection", (ws) => {
  console.log("Client connected.");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "startFile") {
      
      const fileName = data.fileName || "uploaded_file";
      const filePath = path.join(publicFolder, fileName);
      fileStream = fs.createWriteStream(filePath);
      console.log(`Receiving file: ${fileName}`);
    } else if (data.type === "fileChunk") {
      if (fileStream) {
        fileStream.write(Buffer.from(data.chunk, "base64"));
      }
    } else if (data.type === "endOfFile") {
      if (fileStream) {
        fileStream.end();
        console.log("File transfer complete.");
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
    if (fileStream) {
      fileStream.end();
    }
  });
});
