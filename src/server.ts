// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
import mongoose from "mongoose";
import { errorMiddleware } from "./middleware/errorMiddleware";
import snippetRoutes from "./routes/snippetRoutes";
import viewRoutes from "./routes/viewRoutes";
// @ts-ignore
import engine from "express-edge";

// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(engine);
app.set("views", "src/views");
app.use(express.static("src/public"));

// Routes
app.use("/api/snippets", snippetRoutes);
app.use("/", viewRoutes);
app.all("*splat", notFound);
app.use(errorMiddleware);

// Database connection
try {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Database connection OK");
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! 🚀`);
});
