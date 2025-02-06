import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./server.js";
// import HOST from "./utils/serverIp.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 9000, "192.168.66.59", () => {
      console.log(`Server is running on port ${process.env.PORT || 9000}`);
    });
  })
  .catch((err) => {
    console.error("Mongo DB connection error : ", err);
    // process.exit(0);
  });
