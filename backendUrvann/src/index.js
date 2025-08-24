import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./db/connectDb.js";
import loginSignRoutes from "./routes/loginSignUpRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use("/", loginSignRoutes);
app.use("/plants", plantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
