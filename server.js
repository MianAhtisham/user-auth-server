import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/userRoutes.js";
import todoRouter from "./routes/todoRoutes.js";

dotenv.config();

const app = express();
const MONGOURL = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(cors({
  origin: "http://localhost:3000", // change this for production
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGOURL }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use("/api", userRoutes);
app.use("/api", todoRouter);

// For Vercel serverless — only connect once
let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = true;
  console.log("MongoDB connected");
}

// Only run this if executed locally
if (process.env.NODE_ENV !== "production") {
  connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}

export default handler;
