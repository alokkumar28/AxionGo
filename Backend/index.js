import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
dotenv.config();

const port = process.env.PORT || 3000;
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://axion-go.onrender.com",
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "https://axion-go.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.set("io",io);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});
socketHandler(io);
connectDB();

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
