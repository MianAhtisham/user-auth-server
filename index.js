import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRoutes from "../routes/userRoutes.js";
import todoRouter from "../routes/todoRoutes.js";

dotenv.config();

const app = express();
const MONGOURL = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(cors({
  origin: "http://localhost:3000", // or your frontend domain on Vercel
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

// Ensure DB connects before handling requests
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(MONGOURL);
  cachedDb = db;
  console.log("DB Connected Successfully.");
  return db;
};

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res); // Pass control to Express
}
