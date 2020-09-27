
var mainDiv, questionTitleDiv, answersDiv, checkAnswersBtn, nextBtn, remarksDiv, notesDiv;

var unansweredQuestions = [];
var currentQuestionId = null;
var currentAnswerElements = {};

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

    currentAnswerElements[letter] = {input: inp, label: lbl};
}

function clearAnswers() {
    answersDiv.innerHTML = '';
}

function loadQuestion(id) {
    currentQuestionId = id;
    currentAnswerElements = {};
    remarksDiv.innerHTML = "";
    remarksDiv.style.display = "none";
    notesDiv.innerHTML = "";
    let q = questions[id];
    if (!q) {
        console.error(`Could not load Question ${id}`);
        return;
    }
    questionTitleDiv.innerHTML = `Question ${q.qnum}: ${q.question}`;
    for (let ex of q.extra) {
        remarksDiv.innerHTML += "<p>" + ex + "</p>";
    }
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
    nextBtn.style.display = 'none';
    checkAnswersBtn.style.display = 'block';
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
    let q = questions[currentQuestionId];
    console.log(`Question ${currentQuestionId} Correct: ${q.correct}`);
    for (let letter of q.correct) {
        let inp = currentAnswerElements[letter]?.input;
        if (inp) {
            if (inp.checked) {
                currentAnswerElements[letter].label.setAttribute("class", "answer-correct");
                console.log(`HOORAY, ${letter} IS CORRECTLY CHECKED`)
            } else {
                currentAnswerElements[letter].label.setAttribute("class", "answer-wrong-shouldcheck");
                console.log(`DAMN, ${letter} IS NOT CHECKED, BUT IT SHOULD BE`)
            }
        }
    }
    if (q.correct.length > 0) {
        for (let letter in currentAnswerElements) {
            let inp = currentAnswerElements[letter].input;
            if (inp.checked && !q.correct.includes(letter)) {
                currentAnswerElements[letter].label.setAttribute("class", "answer-wrong-shouldnotcheck");
                console.log(`DAMN, ${letter} IS CHECKED, BUT IT SHOULDN'T BE`)
            }
            inp.setAttribute("disabled", "disabled");
        }
    } else {
        notesDiv.innerHTML = "We have no correct answers recorded for this question. Assess yourself!";
    }

    checkAnswersBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    remarksDiv.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function(event) {
    mainDiv = document.getElementById("main");
    questionTitleDiv = document.getElementById("q_title");
    answersDiv = document.getElementById("q_answers");
    checkAnswersBtn = document.getElementById("btn_chk_answers");
    nextBtn = document.getElementById("btn_next");
    remarksDiv = document.getElementById("q_remarks");
    notesDiv = document.getElementById("q_notes");

    addAnswer("A", "Welcome");
    addAnswer("B", "Please click the button to begin");

    initQuestions();
});
