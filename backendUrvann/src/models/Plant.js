import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, trim: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const PlantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    categories: [{ type: String, trim: true }],
    inStock: { type: Boolean, default: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    origin: { type: String, trim: true },
    careInstructions: { type: String, trim: true },
    rating: { type: Number, default: 0 },
    reviews: [ReviewSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Plant", PlantSchema);
