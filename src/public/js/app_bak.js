// Front End Zone
// Day 2 백업
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); // localhost websocket 열기

// Socket 연결 시
socket.addEventListener("open", () => {
  console.log("Connected to Server ✔");
});

// message 받기 (Back -> Front)
socket.addEventListener("message", (message) => {
  // console.log("New message: ", message.data, " from the server");
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

// Socket 종료 시
socket.addEventListener("close", () => {
  console.log("DisConnected from Server X");
});

// JSON 문자열로 변환
function makeMessage(type, payload) {
  const msg = { type, payload }; // type = data 형태, payload = data
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault(); // 기본으로 정의된 이벤트 차단 (submit을 하면 페이지가 reload 되는 현상)
  const input = messageForm.querySelector("input"); // message form 내 input 태그 선택
  // socket.send(input.value); // input 값 전송
  socket.send(makeMessage("new_message", input.value));

  const li = document.createElement("li");
  li.innerText = `you: ${input.value}`;
  messageList.append(li);

  input.value = ""; // 메시지 전송 후 input 박스 값 비우기
}

function handleNickSubmit(event) {
  event.preventDefault(); // 기본으로 정의된 이벤트 차단 (submit을 하면 페이지가 reload 되는 현상)
  const input = nickForm.querySelector("input"); // message form 내 input 태그 선택
  // message는 오직 string만 전송 가능
  socket.send(makeMessage("nickname", input.value));
  input.value = ""; // 메시지 전송 후 input 박스 값 비우기
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
