import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messages.model.js";
import User from "../models/user.model.js";

// get user for side bar not including yours

export const userForSidebar = async (req, res) => {
  try {
    const userId = req.userId;
    // $ne= notequalto you //not showing yours profile in sidebar
    const filterUsers = await User.findById({ _id: { $ne: userId } }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      filterUsers,
    });
  } catch (error) {
    console.log(`Error in UserForSidebar Controller:${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: otherId } = req.params;
    const myId = req.userId;
    //
    const message = await User.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId },
      ],
    });
    res.status(200).json({ message });
  } catch (error) {
    console.log(`Error in getMessages Controller${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;
    let imageUrl;
    if (imageUrl) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    res.status(400).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(`Error in sendMessages Controller:-${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
