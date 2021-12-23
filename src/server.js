import express from "express"; // express 사용 선언

const app = express(); // express 함수 호출

app.set("view engine", "pug"); // 뷰 엔진 pug 세팅
app.set("views", __dirname + "/views"); // 뷰 경로 설정, __dirname = 현재 실행 중인 폴더 경로
app.use("/public", express.static(__dirname + "/public")); // app.use = 모든 요청을 받음

app.get("/", (req, res) => res.render("home")); // only get 요청만 받음

console.log("Hi");

app.listen(3333); // listen Port
