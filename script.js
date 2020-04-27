// Variable declaration
const quesDiv = document.querySelector(".question");
const quesCounter = document.querySelector(".counter");
const quesTag = document.querySelector(".question h2");
const btns_1Div = document.querySelector(".buttons_1");
const explDiv = document.querySelector(".explanation");
const explTag = document.querySelector(".explanation h3");
const btns_2Div = document.querySelector(".buttons_2");
const startBtn = document.querySelector("button[name='start']");
const endBtn = document.querySelector("button[name='end']");
let stageCount = 0;
let stages = 0; // how many question we have
let stageStr = "";
let score = 0;
let stageOrder = [];

// Set up the scene
quesDiv.style.display = "none";
btns_1Div.style.display = "none";
explDiv.style.display = "none";
startBtn.textContent = "Start the Quiz";
endBtn.style.display = "none";

function shakeIt(arr) {
  // this funciton shake up an array
  let len = arr.length;
  let newArray = [];
  while (len > 0) {
    let ran = Math.floor(Math.random() * len);
    newArray.push(arr.splice(ran, 1)[0]);
    len = arr.length;
  }
  return newArray;
}

function startQuiz() {
  // reorder the questions at the first round
  if (stageCount === 0) {
    stageOrder = shakeIt(stageOrder);
  }

  // decide the next step
  if (stageCount === stages) {
    finish();
    return;
  } else {
    stageCount++;
  }

  // set variables
  stageStr = `stage_${stageOrder[stageCount - 1]}`;
  question = respObj[stageStr].ques;

  // hide elements
  explDiv.style.display = "none";
  btns_2Div.style.display = "none";

  // show-modif elements
  quesDiv.style.display = "flex";
  quesCounter.style.display = "block";
  btns_1Div.style.display = "grid";
  endBtn.style.display = "inline-block";
  endBtn.textContent = "Abort";
  quesCounter.textContent = `${stageCount}/${stages}`;
  quesTag.textContent = question;
}

function checkAnswer(caller) {
  let answ = respObj[stageStr].answ;
  let result = "";
  if (caller.name === answ) {
    result = "good";
    score++;
  } else {
    result = "bad";
  }
  explanation(result);
}

function explanation(res) {
  // set variables
  let expl = respObj[stageStr].expl;

  // hide elements
  quesCounter.style.display = "none";
  btns_1Div.style.display = "none";

  // show-modif elements
  if (res === "good") {
    quesTag.textContent = "You are right!";
  } else if (res === "bad") {
    quesTag.textContent = "You are wrong!";
  }
  explDiv.style.display = "block";
  explTag.textContent = expl;
  btns_2Div.style.display = "grid";
  startBtn.textContent = "Next";
}

function finish() {
  // hide elements
  btns_1Div.style.display = "none";
  explDiv.style.display = "none";

  // show-modif elements
  quesTag.innerHTML = `You scored<span> ${score} </span> points out of<span> ${stages} </span>.`;
  startBtn.textContent = "Start Again";
  endBtn.style.display = "inline-block";
  endBtn.textContent = "Finish";

  // set variables
  stageCount = 0;
  score = 0;
}

// define a variable for the XMLHttpRequest object
let xhr = null;

// check for browser type
function getXMLHttpRequest() {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest();
  } else {
    try {
      // code for IE6, IE5
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (ex) {
      return null;
    }
  }
}

xhr = getXMLHttpRequest();

// define a variable for a converted json file
let respObj;

// Monitoring the state of the XMLHttpRequest object
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      respObj = JSON.parse(xhr.responseText);
      stages = Object.keys(respObj).length;
      for (let i = 0; i < stages; i++) {
        stageOrder.push(i + 1);
      }
      stageOrder = shakeIt(stageOrder);
    } else {
      console.log("Response is not ready yet.");
    }
  }
};

xhr.open("get", "data/data.json", true);
xhr.send();
