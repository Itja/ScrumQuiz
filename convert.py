import re
import json

class Question:
    def __init__(self, qnum, lines):
        self.qnum = qnum
        self.question = ""
        self.answers = {}
        self.correct = []
        self.unused_lines = []

        linenum = -1

        for line in lines:
            linenum += 1
            if linenum == 0:
                self.question = line
                continue

            m = re.search(r"^[cC]orrect answers?:? (.*)$", line)
            if m:
                correct = m.group(1).split(" ")
                for c in correct:
                    if re.search(r"^[ABCDEFGHIJK]", c):
                        self.correct.append(c[0])
                continue

            if re.search(r"[rR]ichtig", line):
                words = line.split(" ")
                for w in words:
                    if len(w) < 3 and len(w) > 0:
                        self.correct.append(w[0])
                continue

            m = re.search(r"^([ABCDEFGHIJK])[\)\.](.*)$", line)
            if m:
                self.answers[m.group(1)] = m.group(2).strip()
                continue

            if re.search(r"[cC]hoose the best", line):
                continue

            self.unused_lines.append(line)

        if len(self.answers) < 2:
            ### Fallback mode, use all lines
            for line in self.unused_lines:
                self.answers[self.next_unused_answer()] = line
            self.unused_lines = []

    def next_unused_answer(self):
        char = 64
        while char < 91:
            char += 1
            if chr(char) not in self.answers:
                return chr(char)
        return "?"
    
    def __str__(self):
        s = f"Question {self.qnum}: {self.question}\n"
        for a in self.answers:
            s += f"\t{a}{'*' if a in self.correct else ''}) {self.answers[a]}\n"
        for u in self.unused_lines:
            s += f" # {u}\n"
        return s

    def to_dict(self):
        return {"qnum": self.qnum, "question": self.question, "answers": self.answers, "correct": self.correct, "extra": self.unused_lines}

def read_file(filename):
    questions = []
    with open(filename, encoding="utf-8") as f:
        question_lines = []
        qnum = 0
        for line in f:
            line = line.strip()
            question_finished = False
            skip_line = False

            if re.search(r"^Question\s+\d+", line):
                question_finished = True
                skip_line = True
                
            if re.search(r"^(\d|.[^)].*\?)", line) or question_finished:
                if len(question_lines) > 2:
                    qnum += 1
                    questions.append(Question(qnum, question_lines))
                elif len(question_lines) > 0:
                    pass
                    #print(f"Tried to create Question with {len(question_lines)} lines: {question_lines}")
                question_lines.clear()
            if skip_line or re.search(r"^$|Feedback", line):
                continue
            question_lines.append(line)

    return questions

questions = read_file("questions.txt")

def print_text():
    for q in questions:
        print(q)
        print()

#prn()
def print_json():
    questions_dicts = [q.to_dict() for q in questions]
    print(json.dumps(questions_dicts))

print_json()