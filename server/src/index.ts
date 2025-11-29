import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configureRoutes } from "./server/express";
import { configureSockets } from "./server/socket";
import os from "os";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

configureRoutes(app);
configureSockets(io);

const port = process.env.PORT || 4000;

server.listen(Number(port), "0.0.0.0", () => {
  const networks = os.networkInterfaces();
  let myIP = "localhost";

  for (const name of Object.keys(networks)) {
    for (const net of networks[name]!) {
      // Tìm địa chỉ IPv4 và không phải là localhost (127.0.0.1)
      if (net.family === "IPv4" && !net.internal) {
        myIP = net.address;
        break;
      }
    }
  }

  console.log(`Server is running!`);
  console.log(`- Local:   http://localhost:${port}`);
  console.log(`- Network: http://${myIP}:${port}`);
});
