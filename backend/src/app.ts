import * as http from "http";
import path from "path";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { router } from "./routes";

import socketHandler from "./socket";
import nconf from "./config/nconf";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const server = new http.Server(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/", router);

app.use(errorHandler);
app.set("port", nconf.get("PORT") || 5000);

export { app, server };
