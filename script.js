/**
 * 一般常識クイズ
 * 全5問・4択形式。回答ごとに正誤フィードバックを出し、最後に合計スコアを表示する。
 */

// ===== 問題データ =====
// answerIndex は choices の 0 始まりのインデックス
const questions = [
  {
    id: 1,
    category: "地理",
    question: "日本で最も面積が大きい湖はどれ？",
    choices: ["霞ヶ浦", "琵琶湖", "猪苗代湖", "サロマ湖"],
    answerIndex: 1,
    explanation: "琵琶湖は滋賀県にあり、面積は約670平方キロメートル。2位の霞ヶ浦の約3倍の広さです。"
  },
  {
    id: 2,
    category: "理科",
    question: "太陽系の惑星のうち、太陽に最も近いものはどれ？",
    choices: ["金星", "地球", "水星", "火星"],
    answerIndex: 2,
    explanation: "太陽に近い順に水星・金星・地球・火星と並びます。金星は水星より高温ですが、距離では2番目です。"
  },
  {
    id: 3,
    category: "歴史",
    question: "1603年に江戸幕府を開いた人物は誰？",
    choices: ["織田信長", "豊臣秀吉", "徳川家光", "徳川家康"],
    answerIndex: 3,
    explanation: "徳川家康が征夷大将軍に任じられ江戸幕府を開きました。徳川家光はその孫にあたる3代将軍です。"
  },
  {
    id: 4,
    category: "ことわざ",
    question: "「五十歩百歩」と最も意味が近いことわざはどれ？",
    choices: ["どんぐりの背比べ", "弘法にも筆の誤り", "猿も木から落ちる", "灯台下暗し"],
    answerIndex: 0,
    explanation: "どちらも「似たり寄ったりで大きな差がない」という意味。他の3つは名人でも失敗すること、身近なことほど気づきにくいことを表します。"
  },
  {
    id: 5,
    category: "単位",
    question: "1ヘクタールは何平方メートル？",
    choices: ["100平方メートル", "1,000平方メートル", "10,000平方メートル", "100,000平方メートル"],
    answerIndex: 2,
    explanation: "1ヘクタールは一辺100メートルの正方形の面積で、10,000平方メートル。東京ドームの建築面積が約4.7ヘクタールです。"
  }
];

const CHOICE_LABELS = ["A", "B", "C", "D"];

// ===== 状態 =====
const state = {
  currentIndex: 0, // 現在の問題番号（0始まり）
  score: 0,        // 正解数
  results: []      // 各問の結果 { question, selectedIndex, correctIndex, isCorrect }
};

// ===== DOM 参照 =====
const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen")
};

const els = {
  startBtn: document.getElementById("start-btn"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  category: document.getElementById("category"),
  questionText: document.getElementById("question-text"),
  choices: document.getElementById("choices"),
  feedback: document.getElementById("feedback"),
  feedbackJudge: document.getElementById("feedback-judge"),
  feedbackExplanation: document.getElementById("feedback-explanation"),
  nextBtn: document.getElementById("next-btn"),
  resultScore: document.getElementById("result-score"),
  resultMessage: document.getElementById("result-message"),
  review: document.getElementById("review"),
  retryBtn: document.getElementById("retry-btn")
};

// ===== 画面切り替え =====
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("screen--active", key === name);
  });
}

// ===== クイズの進行 =====
function startQuiz() {
  state.currentIndex = 0;
  state.score = 0;
  state.results = [];
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = questions[state.currentIndex];

  // 進捗表示
  els.progressText.textContent = `第${state.currentIndex + 1}問 / 全${questions.length}問`;
  els.progressFill.style.width = `${(state.currentIndex / questions.length) * 100}%`;
  els.category.textContent = q.category;
  els.questionText.textContent = q.question;

  // 選択肢を作り直す
  els.choices.textContent = "";
  q.choices.forEach((choice, index) => {
    const item = document.createElement("li");
    item.className = "choices__item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";

    const label = document.createElement("span");
    label.className = "choice__label";
    label.textContent = CHOICE_LABELS[index];

    const text = document.createElement("span");
    text.className = "choice__text";
    text.textContent = choice;

    button.append(label, text);
    button.addEventListener("click", () => handleAnswer(index));

    item.appendChild(button);
    els.choices.appendChild(item);
  });

  // フィードバックと「次へ」を隠す
  els.feedback.hidden = true;
  els.feedback.classList.remove("feedback--correct", "feedback--wrong");
  els.nextBtn.hidden = true;
}

function handleAnswer(selectedIndex) {
  const q = questions[state.currentIndex];
  const isCorrect = selectedIndex === q.answerIndex;

  if (isCorrect) {
    state.score += 1;
  }

  state.results.push({
    question: q.question,
    selectedIndex,
    correctIndex: q.answerIndex,
    isCorrect
  });

  // 全選択肢を操作不可にし、正解・不正解を色分けする
  const buttons = els.choices.querySelectorAll(".choice");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === q.answerIndex) {
      button.classList.add("choice--correct");
    } else if (index === selectedIndex) {
      button.classList.add("choice--wrong");
    }
  });

  // フィードバック表示
  els.feedback.hidden = false;
  els.feedback.classList.add(isCorrect ? "feedback--correct" : "feedback--wrong");
  els.feedbackJudge.textContent = isCorrect
    ? "◯ 正解！"
    : `× 不正解… 正解は「${q.choices[q.answerIndex]}」`;
  els.feedbackExplanation.textContent = q.explanation;

  // 進捗バーを回答済みの位置まで進める
  els.progressFill.style.width = `${((state.currentIndex + 1) / questions.length) * 100}%`;

  // 「次へ」ボタン
  const isLast = state.currentIndex === questions.length - 1;
  els.nextBtn.textContent = isLast ? "結果を見る" : "次の問題へ";
  els.nextBtn.hidden = false;
  els.nextBtn.focus();
}

function goNext() {
  if (state.currentIndex === questions.length - 1) {
    renderResult();
    showScreen("result");
    return;
  }
  state.currentIndex += 1;
  renderQuestion();
}

// ===== 結果表示 =====
function buildMessage(score, total) {
  if (score === total) {
    return "全問正解！文句なしの一般常識マスターです。";
  }
  if (score >= total * 0.6) {
    return "good! あと少しで満点です。";
  }
  if (score > 0) {
    return "惜しい！解説を読んでもう一度挑戦してみましょう。";
  }
  return "ここからが伸びしろ。解説を読んで再挑戦しましょう。";
}

function renderResult() {
  els.resultScore.textContent = String(state.score);
  els.resultMessage.textContent = buildMessage(state.score, questions.length);

  els.review.textContent = "";
  state.results.forEach((result, index) => {
    const q = questions[index];

    const item = document.createElement("li");
    item.className = "review__item";

    const mark = document.createElement("span");
    mark.className = `review__mark review__mark--${result.isCorrect ? "correct" : "wrong"}`;
    mark.textContent = result.isCorrect ? "◯" : "×";

    const body = document.createElement("div");

    const question = document.createElement("p");
    question.className = "review__question";
    question.textContent = `第${index + 1}問 ${result.question}`;

    const answer = document.createElement("p");
    answer.className = "review__answer";
    answer.textContent = result.isCorrect
      ? `正解: ${q.choices[result.correctIndex]}`
      : `あなたの回答: ${q.choices[result.selectedIndex]} / 正解: ${q.choices[result.correctIndex]}`;

    body.append(question, answer);
    item.append(mark, body);
    els.review.appendChild(item);
  });
}

// ===== イベント登録 =====
els.startBtn.addEventListener("click", startQuiz);
els.nextBtn.addEventListener("click", goNext);
els.retryBtn.addEventListener("click", startQuiz);
