// ステージ一覧
const STAGES = [
  "シェケナダム",
  "難破船ドン・ブラコ",
  "アラマキ砦",
  "ムニ・エール海洋発電所",
  "すじこジャンクション跡",
  "トキシラズいぶし工房",
  "どんぴこ闘技場",
];

// --- データ管理 ---
function loadRecords() {
  const data = localStorage.getItem("salmonrun_records");
  return data ? JSON.parse(data) : [];
}

function saveRecords(records) {
  localStorage.setItem("salmonrun_records", JSON.stringify(records));
}

// --- 初期化 ---
function init() {
  populateStages();
  setDefaultDate();
  renderRecords();
  renderStats();

  document.getElementById("form").addEventListener("submit", handleSubmit);
}

function populateStages() {
  const select = document.getElementById("stage");
  STAGES.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function setDefaultDate() {
  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().split("T")[0];
}

// --- フォーム送信 ---
function handleSubmit(e) {
  e.preventDefault();

  const hazardLevel = Number(document.getElementById("hazard-level").value);
  const goldenEggs = Number(document.getElementById("golden-eggs").value);

  if (isNaN(hazardLevel) || hazardLevel < 0 || hazardLevel > 333) {
    alert("キケン度は0〜333の数値を入力してください。");
    return;
  }
  if (isNaN(goldenEggs) || goldenEggs < 0) {
    alert("金イクラは0以上の数値を入力してください。");
    return;
  }

  const record = {
    id: Date.now(),
    date: document.getElementById("date").value,
    stage: document.getElementById("stage").value,
    hazardLevel,
    goldenEggs,
    result: document.getElementById("result").value,
  };

  const records = loadRecords();
  records.push(record);
  saveRecords(records);

  renderRecords();
  renderStats();
  e.target.reset();
  setDefaultDate();
}

// --- 記録一覧の描画 ---
function renderRecords() {
  const records = loadRecords();
  const tbody = document.querySelector("#record-table tbody");
  tbody.innerHTML = "";

  // 新しい順に表示
  const sorted = [...records].sort((a, b) => b.id - a.id);

  sorted.forEach((r) => {
    const tr = document.createElement("tr");
    const resultText = r.result === "clear" ? "クリア" : "失敗";
    const resultClass = r.result === "clear" ? "color:#4caf50" : "color:#f44336";

    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.stage}</td>
      <td>${r.hazardLevel}%</td>
      <td>${r.goldenEggs}</td>
      <td style="${resultClass}">${resultText}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 統計の描画 ---
function renderStats() {
  const records = loadRecords();
  const container = document.getElementById("stats-container");

  if (records.length === 0) {
    container.innerHTML = "<p>まだ記録がありません。</p>";
    return;
  }

  const totalGames = records.length;
  const clears = records.filter((r) => r.result === "clear").length;
  const clearRate = ((clears / totalGames) * 100).toFixed(1);
  const maxEggs = Math.max(...records.map((r) => r.goldenEggs));
  const avgEggs = (
    records.reduce((sum, r) => sum + r.goldenEggs, 0) / totalGames
  ).toFixed(1);

  container.innerHTML = `
    <div class="stat-card">
      <div class="value">${totalGames}</div>
      <div class="label">総バイト数</div>
    </div>
    <div class="stat-card">
      <div class="value">${clearRate}%</div>
      <div class="label">クリア率</div>
    </div>
    <div class="stat-card">
      <div class="value">${maxEggs}</div>
      <div class="label">最高金イクラ</div>
    </div>
    <div class="stat-card">
      <div class="value">${avgEggs}</div>
      <div class="label">平均金イクラ</div>
    </div>
  `;
}

// 起動
document.addEventListener("DOMContentLoaded", init);
