import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  // file: {
  //   fileName: {
  //     type: String,
  //   },
  //   fileType: {
  //     type: String,
  //   },
  //   fileUrl: {
  //     type: String,
  //   },
  // },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
