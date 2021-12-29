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
  socket.on("enter_room", (roomName) => {
    console.log(`Socket ID = ` + socket.id);
    socket.join(roomName);
    console.log(socket.rooms);
    socket.emit("Hello", "Hello!");
    // console.log(socket.rooms);
  });
  // socket.on("enter_room", (roomName, done) => {
  //   console.log(socket.id);
  //   console.log(socket.rooms);
  //   socket.join(roomName);
  //   console.log(socket.rooms);
  //   done();
  // });
});

httpServer.listen(3333);
