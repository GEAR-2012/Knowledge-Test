/* get DOM elements */
const quesCont = $(".question");
const explCont = $(".explanation");
const btnCont1 = $(".buttons_1");
const btnCont2 = $(".buttons_2");
const btnStart = $(".buttons_2>.btn_start");
const btnEnd = $(".buttons_2>.btn_end");
const quesNumTag = $(".question>p");
const quesTag = $(".question>h2");
const explTag = $(".explanation>h3");

/* variables */
let score = 0;
let counter = 0;
let rndStageNo = 0;
let quizLen = 0;
let rightMessage = "You are right!";
let wrongMessage = "You are wrong!";
let quizObj;
let rndArr = [];

/* AJAX */
$(document).ready(function () {
  $.get("data/data.json", function (data, status) {
    if (status === "success") {
      dataProcessing(data);
      console.log("Data fetched!");
    } else {
      console.log("Data not found!");
    }
  });
});

function dataProcessing(data) {
  quizJson = data;
  quizObj = JSON.parse(JSON.stringify(quizJson));

  quizLen = Object.keys(quizObj).length;
}

function setupScene() {
  quesCont.hide();
  btnCont1.hide();
  explCont.hide();
  btnEnd.hide();
  btnStart.text("Start the Quiz");
}
setupScene();

function nextQuestion() {
  counter++;
  if (counter > quizLen) {
    finish();
    return;
  }

  // get unique random numbers
  if (counter === 1) {
    rndNumFrom(quizLen);
  }

  rndStageNo = rndArr.pop();

  explCont.hide();
  btnCont2.hide();
  quesCont.show();
  quesNumTag.show();
  btnCont1.show();
  quesNumTag.text(`${counter}/${quizLen}`);
  quesTag.text(quizObj[`stage_${rndStageNo}`].ques);
}

function checkAnswer(caller) {
  // check for finish
  if (counter > quizLen) {
    finish();
    return;
  }
  quesNumTag.hide();
  // check the answer
  if (caller.name === quizObj[`stage_${rndStageNo}`].answ) {
    quesTag.text(rightMessage);
    score++;
  } else if (caller.name != quizObj[`stage_${rndStageNo}`].answ) {
    quesTag.text(wrongMessage);
  }
  // display explanation
  btnCont1.hide();
  explCont.show();
  btnCont2.show();
  btnEnd.show();
  explTag.text(quizObj[`stage_${rndStageNo}`].expl).css("text-style", "italic");
  btnStart.text("Next");
  btnEnd.text("Abort");
}

function finish() {
  explCont.hide();
  btnCont1.hide();
  quesNumTag.hide();
  quesCont.show();
  btnCont2.show();
  btnEnd.show();
  quesTag.html(
    `You scored <span>${score}</span> points out of <span>${quizLen}</span>.`
  );
  btnStart.text("Start Again");
  btnEnd.text("Finish");
  counter = 0;
  score = 0;
}

// it makes random integers from 1 - num into an array
function rndNumFrom(num) {
  let newArr = [];
  for (let i = 0; i < num; i++) {
    newArr.push(i + 1);
  }
  while (newArr.length > 0) {
    rndArr.push(newArr.splice(Math.floor(Math.random() * newArr.length), 1)[0]);
  }
}
