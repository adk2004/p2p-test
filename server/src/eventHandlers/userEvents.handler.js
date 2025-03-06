import { User } from "../models/user.model.js";
import { File } from "../models/file.model.js";

const registerHandler = async (socket, data) => {
  try {
    const { username, fileList, ip } = data;
    if (!fileList || !username || !ip) {
      return socket.emit("register_response", {
        success: false,
        message: "IP, fileList, and username are required",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return socket.emit("register_response", {
        success: false,
        message: "Username is already in use = " + existingUser.username,
      });
    }

    const newUser = await User.create({
      username,
      ip_address: ip,
      socketId: socket.id,
    });

    const filePromises = fileList.map((file) =>
      File.create({
        path: file.path,
        name: file.name,
        ip,
        fileType: file.type,
        owner: newUser._id,
      })
    );

    await Promise.all(filePromises);

    return socket.emit("register_response", {
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in registerHandler:", error);
    return socket.emit("register_response", {
      success: false,
      message: error.message,
    });
  }
};

export { registerHandler };