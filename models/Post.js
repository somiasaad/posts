const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    postedBy: {
      // userID
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },{ isInfo: { type: Boolean, default: false } },
  {
    isCurrent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
