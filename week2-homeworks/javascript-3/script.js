let inputField = document.querySelector("#input");
let countDisplay = document.querySelector("p");
const resetButton = document.querySelector("#reset-button");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");

let interval;
let timer = 0;
let isPause = false;

countDisplay.textContent = timer;

startButton.addEventListener("click", () => {
  clearInterval(interval);
  let newInputValue = parseInt(inputField.value);

  if (!isNaN(newInputValue) && newInputValue > 0 && !isPause) {
    timer = newInputValue;
    countDisplay.textContent = timer;
    inputField.value = "";
  }
  if (timer <= 0) {
    console.log("Timer 0 olduğu için başlatılmadı.");
    return;
  }
  isPause = false;
  interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      countDisplay.textContent = timer;
    } else {
      clearInterval(interval);
      countDisplay.textContent = "Süreniz Bitti!";
    }
  }, 1000);
});

pauseButton.addEventListener("click", () => {
  clearInterval(interval);
  isPause = true;
});

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  timer = 0;
  isPause = false;
  countDisplay.textContent = timer;
});
