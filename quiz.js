
var mainDiv, questionTitleDiv, answersDiv, checkAnswersBtn, nextBtn;

var unansweredQuestions = [];
var currentQuestion = null;

function addAnswer(letter, text) {
    let div = document.createElement("div");
    div.setAttribute("class", "answer");
    answersDiv.appendChild(div);

    let inp = document.createElement("input");
    let inp_id = "answer" + letter;
    inp.setAttribute("id", inp_id);
    inp.setAttribute("type", "checkbox");
    inp.setAttribute("value", letter);
    div.appendChild(inp);

    let lbl = document.createElement("label");
    lbl.setAttribute("for", inp_id);
    lbl.appendChild(document.createTextNode(letter + ") " + text));
    div.appendChild(lbl);
}

function clearAnswers() {
    answersDiv.innerHTML = '';
}

function loadQuestion(id) {
    let q = questions[id];
    if (!q) {
        console.error(`Could not load Question ${id}`);
        return;
    }
    questionTitleDiv.innerHTML = `Question ${q.qnum}: ${q.question}`;
    clearAnswers();
    for (let letter in q.answers) {
        addAnswer(letter, q.answers[letter]);
    }
}

function nextQuestion() {
    if (unansweredQuestions.length === 0) {
        document.getElementById("done_msg").style.display = 'block';
        return;
    }

    let id = unansweredQuestions.shift();
    loadQuestion(id);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initQuestions() {
    for (let i = 0; i < questions.length; i++) {
        unansweredQuestions.push(i);
    }
    shuffleArray(unansweredQuestions);
}


function checkAnswers() {
    console.log("check");
}

document.addEventListener("DOMContentLoaded", function(event) {
    mainDiv = document.getElementById("main");
    questionTitleDiv = document.getElementById("q_title");
    answersDiv = document.getElementById("q_answers");
    checkAnswersBtn = document.getElementById("btn_check_answers");
    nextBtn = document.getElementById("next");

    addAnswer("A", "Welcome");
    addAnswer("B", "Please click the button to begin");

    initQuestions();
});
