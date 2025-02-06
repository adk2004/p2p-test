import { File } from "../models/file.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getGroupMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ type: "group" }).populate("owner");
    res.status(200).json(messages);
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const getDirectMessages = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new ApiError(400, "User Id is required");
  }
  try {
    const messages = await Message.find({
      type: "direct",
      for: userId,
    }).populate("owner");
    res.status(200).json(messages);
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});

export { getGroupMessages, getDirectMessages };
