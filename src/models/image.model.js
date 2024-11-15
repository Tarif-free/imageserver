import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["house","mobile", "tree","dev","woman","man"] 
    },
    tags: {
      type: [String], 
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.index({ category: 1 });
imageSchema.index({ tags: 1 });

export const Image = mongoose.model("Image", imageSchema);