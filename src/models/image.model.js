import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Image = mongoose.model("Image", imageSchema);
