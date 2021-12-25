// Front End Zone

const socket = new WebSocket(`ws://${window.location.host}`); // localhost websocket 열기

// Socket 연결 시
socket.addEventListener("open", () => {
  console.log("Connected to Server ✔");
});

// message 받기 (Back -> Front)
socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data, " from the server");
});

// Socket 종료 시
socket.addEventListener("close", () => {
  console.log("DisConnected from Server X");
});

// Socket 메세지 전달 (Front -> Back)
setTimeout(() => {
  socket.send("hello from the browser!");
}, 5000);
