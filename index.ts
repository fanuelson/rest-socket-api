import express, { Request, Response } from "express";
import { Socket, Server } from "socket.io";
import http from 'http';
import { EmitEventRequestBody } from "./types";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(express.json());

app.get("/health-check", function (req: Request, res: Response) {
  res.json({ status: "alive" });
});

app.post("/emit-event", function (req: Request<any, any, EmitEventRequestBody>, res: Response) {
  console.log(`POST /emit-event, body: %j`, req.body);
  console.log('socket clients connected: %s', io.engine.clientsCount);
  const { eventName, args, namespace } = req.body;
  console.log('emitting: %s, namespace: %s, args: %j', eventName, namespace, args);
  if(namespace) {
    io.of(namespace).emit(eventName, args);
  }else{
    io.emit(eventName, args);
  }
  res.send();
});

io.on("connection", (socket: Socket) => {
  console.log("user connected", socket.id);
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on("message", (...args) => {
    console.log("eventName: message, args:", args);
  });
});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
