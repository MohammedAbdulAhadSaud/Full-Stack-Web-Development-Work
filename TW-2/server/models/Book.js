const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, default: "General", trim: true },
    status: { type: String, enum: ["To read", "Reading", "Finished"], default: "To read" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
