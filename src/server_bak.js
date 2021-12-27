// Day 2 백업
import express from "express"; // express 사용 선언
import http from "http";
import WebSocket from "ws";

const app = express(); // express 함수 호출

app.set("view engine", "pug"); // 뷰 엔진 pug 세팅
app.set("views", __dirname + "/views"); // 뷰 경로 설정, __dirname = 현재 실행 중인 폴더 경로
app.use("/public", express.static(__dirname + "/public")); // app.use = 모든 요청을 받음

app.get("/", (req, res) => res.render("home")); // only get 요청만 받음
app.get("/*", (req, res) => res.redirect("/")); // 이외 URL 요청은 /로 redirect

// console.log("Hi");

// app.listen(3333); // listen Port

const server = http.createServer(app); // http 서버 생성

const wss = new WebSocket.Server({ server }); // websocket과 http 둘다 사용하는 방법 (하나의 포트로 모두 처리)

// Socket 종료 시
function onSocketClose() {
  console.log("DisConnected from Browser X");
}

// Socket 메세지 받기 (Front -> Back)
function onSocketMessage_rec(message) {
  console.log(message.toString("utf-8"));
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anony"; // socket내 정보 저장 가능
  console.log("Connected to Browser ✔");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const psMessage = JSON.parse(msg); // String to Object
    psMessage.toString("utf-8"); // uft-8 인코딩 변환
    console.log(psMessage);

    switch (psMessage.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${psMessage.payload}`)
        );
      // sockets.forEach((aSocket) => aSocket.send(psMessage.payload));
      case "nickname":
        socket["nickname"] = psMessage.payload;
      // console.log(psMessage.payload.toString("utf-8"));
    }
  });
  // socket.send("hello~!"); // Socket 메세지 보내기 (Back -> Front)
});

server.listen(3333);
