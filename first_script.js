const loginForm = document.getElementById("login-form");
const loginInput = loginForm.querySelector("input");
const greeting = document.querySelector("h4");

console.log(loginForm);
console.log(loginInput);
console.log(greeting);

function onLoginSubmit(event) {
    event.preventDefault(); //브라우저가 기본 동작을 실행하지 못하게 막기
    //form 숨기기
    loginForm.classList.add("hidden");
    const username = loginInput.value;

   //localStorage에 이름 추가
    localStorage.setItem("username", username);

   //greeting 표시 
    paintGreetings(username);
}

function paintGreetings(username) {
    // greeting 나타내기
    greeting.classList.remove("hidden");
    // 텍스트 추가
    greeting.innerText = "안녕하세요 " + username + "님";
  }
  
  const savedUsername = localStorage.getItem("username");
  
  if (savedUsername === null) {
    // show the form
    loginForm.classList.remove("hidden");
    loginForm.addEventListener("submit", onLoginSubmit);
  } else {
    // show the greetings
    paintGreetings(savedUsername);
    localStorage.removeItem("username"); // 이 부분 추가
  }
  