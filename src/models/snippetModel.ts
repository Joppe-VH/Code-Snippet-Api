import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, trim: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Snippet = mongoose.model("Snippet", SnippetSchema);
export default Snippet;
