import { doesNotMatch } from "assert";
import express from "express"; // express 사용 선언
import http from "http";
import SocketIO from "socket.io";

const app = express(); // express 함수 호출

app.set("view engine", "pug"); // 뷰 엔진 pug 세팅
app.set("views", __dirname + "/views"); // 뷰 경로 설정, __dirname = 현재 실행 중인 폴더 경로
app.use("/public", express.static(__dirname + "/public")); // app.use = 모든 요청을 받음

app.get("/", (req, res) => res.render("home")); // only get 요청만 받음
app.get("/*", (req, res) => res.redirect("/")); // 이외 URL 요청은 /로 redirect

const httpServer = http.createServer(app); // http 서버 생성
const sockIO = SocketIO(httpServer, {
  cors: { origin: "*", Credential: true },
});

sockIO.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`== Socket Event:${event} ==`);
  });

  // 방 입장
  socket.on("enter_room", (roomName, done) => {
    console.log(`Socket ID = ` + socket.id);
    socket.join(roomName.payload);
    console.log(socket.rooms);
    done(); // Front-end : run showRoom
    socket.emit("Hello", "Hello! i'm Nodejs Server");
    console.log(roomName.payload);
    socket.to(roomName.payload).emit("welcome");
  });

  // socket 연결 종료 전 마지막 통신
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye");
    });
  });

  // 다른 유저에게 메세지 전달
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("Server_new_message", `Other : ${msg}`);
    done(); // run Front-end -> You : ~
  });
});

httpServer.listen(3333);
