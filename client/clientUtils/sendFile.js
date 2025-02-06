const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const serverIP = "192.168.50.18"; // Replace with your reciever's IPv4 address
const serverPort = 9000;

const ws = new WebSocket(`ws://${serverIP}:${serverPort}`);

// Path to the file to send
const filePath = "C:\\Users\\Hp\\Downloads\\Telegram Desktop\\S03-E13 Breaking Bad [720p] [Eng] @The_Webseries_Library.mkv";


ws.on("open", () => {
  console.log("Connected to server.");

  const fileName = path.basename(filePath);

  // Notify server about the file name
  ws.send(
    JSON.stringify({
      type: "startFile",
      fileName,
    })
  );

  const stream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 }); // 64 KB chunks

  stream.on("data", (chunk) => {
    ws.send(
      JSON.stringify({
        type: "fileChunk",
        chunk: chunk.toString("base64"), // Encode chunk to Base64
      })
    );
  });

  stream.on("end", () => {
    ws.send(
      JSON.stringify({
        type: "endOfFile",
      })
    );
    console.log("File transfer complete.");
  });
});

ws.on("close", () => {
  console.log("Disconnected from server.");
});
