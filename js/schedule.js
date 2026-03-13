// 開催履歴検索（カード表示版 - grading.htmlカード構造準拠）
// SCHEDULE_DATA は schedule_data.js でグローバル定義済み
// WEAPON_RATINGS, BOSS_MATCHUPS は weapon_data.js でグローバル定義済み
var scheduleData = typeof SCHEDULE_DATA !== "undefined" ? SCHEDULE_DATA : [];

// --- アイコンマッピング ---
var ICON_DIR = "png/";

var STAGE_ICONS_HIGH = {
  "シェケナダム": "stage_spawning_grounds_high.jpg",
  "難破船ドン・ブラコ": "stage_marooners_bay_high.jpg",
  "アラマキ砦": "stage_sockeye_station_high.jpg",
  "ムニ・エール海洋発電所": "stage_gone_fission_hydroplant_high.jpg",
  "すじこジャンクション跡": "stage_jammin_salmon_junction_high.jpg",
  "トキシラズいぶし工房": "stage_salmonid_smokeyard_high.jpg",
  "どんぴこ闘技場": "stage_bonerattle_arena_high.jpg",
  "スメーシーワールド": "stage_wahoo_world_high.png",
  "海女美術大学": "stage_inkblot_art_academy_high.png",
  "マテガイ放水路": "stage_undertow_spillway_high.png",
  "ナンプラー遺跡": "stage_umami_ruins_high.png",
  "タラポートショッピングパーク": "stage_barnacle_dime_high.png",
  "ゴンズイ地区": "stage_eeltail_alley_high.png",
  "グランドバンカラアリーナ": "stage_grand_splatlands_bowl_high.png"
};

// WEAPON_ICONS は weapon_data.js で定義

var SC_OKASHIRA_ICON_MAP = {
  "ヨコヅナ": "salmon_cohozuna.png",
  "タツ": "salmon_horrorboros.png",
  "ジョー": "salmon_megalodontia.png",
  "オカシラ連合": "salmon_triumvirate.png",
  "ランダム": "salmon_okashira_random.png"
};

// ============================================================
// 採点ロジック（grading.htmlから移植）
// ============================================================

var SC_STAGE_WEIGHTS = {
  "トキシラズいぶし工房":   { clearing: 45, paint: 15, boss: 25, mobility: 5, handling: 10 },
  "シェケナダム":         { clearing: 40, paint: 15, boss: 27.5, mobility: 7.5, handling: 10 },
  "難破船ドン・ブラコ":     { clearing: 35, paint: 15, boss: 30, mobility: 10, handling: 10 },
  "どんぴこ闘技場":       { clearing: 35, paint: 15, boss: 30, mobility: 10, handling: 10 },
  "ムニ・エール海洋発電所":  { clearing: 40, paint: 15, boss: 30, mobility: 5, handling: 10 },
  "アラマキ砦":          { clearing: 40, paint: 15, boss: 25, mobility: 10, handling: 10 },
  "すじこジャンクション跡":  { clearing: 40, paint: 15, boss: 27.5, mobility: 7.5, handling: 10 }
};

var SC_T = { X: 10, Sp: 8, S: 6, A: 4, B: 2.5, C: 1 };

var SC_BOSS_KEY = {
  "タワー": "stinger", "コウモリ": "drizzler", "ハシラ": "fishstick",
  "カタパッド": "flyfish", "ヘビ": "steeleel", "テッキュウ": "bigshot",
  "テッパン": "scrapper", "ナベブタ": "slamminlid", "バクダン": "steelhead",
  "モグラ": "maws", "ダイバー": "flipper"
};

var SC_STAGE_BOSS_DANGER = {
  "シェケナダム": {
    "タワー": SC_T.X, "コウモリ": SC_T.Sp, "ハシラ": SC_T.Sp, "カタパッド": SC_T.Sp, "ヘビ": SC_T.Sp, "テッキュウ": SC_T.Sp,
    "テッパン": SC_T.S, "ナベブタ": SC_T.A, "バクダン": SC_T.A, "モグラ": SC_T.B, "ダイバー": SC_T.B
  },
  "トキシラズいぶし工房": {
    "コウモリ": SC_T.X, "テッキュウ": SC_T.Sp, "ハシラ": SC_T.Sp, "カタパッド": SC_T.Sp,
    "タワー": SC_T.S, "ヘビ": SC_T.S, "テッパン": SC_T.A,
    "モグラ": SC_T.B, "ダイバー": SC_T.B, "バクダン": SC_T.B, "ナベブタ": SC_T.B
  },
  "ムニ・エール海洋発電所": {
    "コウモリ": SC_T.S, "タワー": SC_T.S, "テッキュウ": SC_T.S, "ハシラ": SC_T.S, "カタパッド": SC_T.S,
    "ヘビ": SC_T.A, "テッパン": SC_T.B, "ナベブタ": SC_T.B, "バクダン": SC_T.B,
    "モグラ": SC_T.C, "ダイバー": SC_T.C
  },
  "どんぴこ闘技場": {
    "コウモリ": SC_T.X, "タワー": SC_T.Sp, "テッキュウ": SC_T.Sp,
    "テッパン": SC_T.S, "カタパッド": SC_T.A, "ヘビ": SC_T.A,
    "ナベブタ": SC_T.B, "バクダン": SC_T.B, "ハシラ": SC_T.B,
    "モグラ": SC_T.C, "ダイバー": SC_T.C
  },
  "アラマキ砦": {
    "タワー": SC_T.X, "カタパッド": SC_T.X, "テッキュウ": SC_T.X,
    "ハシラ": SC_T.S, "コウモリ": SC_T.A, "ナベブタ": SC_T.A,
    "テッパン": SC_T.B, "バクダン": SC_T.B, "ヘビ": SC_T.B,
    "モグラ": SC_T.C, "ダイバー": SC_T.C
  },
  "すじこジャンクション跡": {
    "カタパッド": SC_T.Sp, "タワー": SC_T.Sp, "テッキュウ": SC_T.Sp,
    "ハシラ": SC_T.S, "ヘビ": SC_T.S, "コウモリ": SC_T.A,
    "ナベブタ": SC_T.B, "バクダン": SC_T.B, "テッパン": SC_T.B,
    "モグラ": SC_T.C, "ダイバー": SC_T.C
  },
  "難破船ドン・ブラコ": {
    "タワー": SC_T.X, "カタパッド": SC_T.X, "コウモリ": SC_T.X, "テッキュウ": SC_T.X, "ハシラ": SC_T.X,
    "ヘビ": SC_T.Sp, "ナベブタ": SC_T.A, "バクダン": SC_T.A,
    "テッパン": SC_T.B, "モグラ": SC_T.C, "ダイバー": SC_T.C
  }
};

var SC_STAGE_DIFFICULTY = {
  "難破船ドン・ブラコ": 104.0,
  "シェケナダム": 91.5,
  "トキシラズいぶし工房": 87.0,
  "アラマキ砦": 76.0,
  "どんぴこ闘技場": 75.0,
  "すじこジャンクション跡": 68.5,
  "ムニ・エール海洋発電所": 62.5
};
var SC_DIFF_MIN = 62.5;
var SC_DIFF_MAX = 104.0;
var SC_DIFF_PENALTY = 0.15;
var SC_SCORE_MIN = 20.3;
var SC_SCORE_MAX = 79.6;

var SC_METRIC_RANGE = {
  clearing:  { min: 29.0, max: 97.7 },
  paint:     { min: 35.9, max: 94.7 },
  mobility:  { min: 16.7, max: 73.0 },
  handling:  { min: 20.0, max: 100.0 },
  range:     { min: 7.8,  max: 90.3 }
};

var SC_BOSS_EVAL = {
  fishstick: [0.7, 0.3],
  stinger: [0.4, 0.35, 0.25],
  flyfish: [0.4, 0.35, 0.25],
  bigshot: [0.5, 0.25, 0.25],
  drizzler: [0.35, 0.35, 0.3],
  steelhead: [0.5, 0.4, 0.1]
};

// --- オカシラ採点定数 ---
var SC_OKASHIRA_WEAPONS = {
  "ボールドマーカー": [5625,540,10.42,1,1,1],
  "わかばシューター": [6496,336,19.33,1,1,1],
  "シャープマーカー": [3500,336,10.42,1,2,1],
  "プロモデラーMG": [4800,360,13.33,1,1,1],
  "スプラシューター": [3888,360,10.8,1,2,1],
  ".52ガロン": [3952,347,11.4,1,2,1],
  "N-ZAP85": [3750,360,10.42,1,2,1],
  "プライムシューター": [2790,338,8.27,1,3,1],
  ".96ガロン": [3400,425,8.6,1,3,1],
  "ジェットスイーパー": [2480,300,8.27,1,4,1],
  "スペースシューター": [3750,300,12.5,1,3,1],
  "L3リールガン": [4000,400,9.97,1,3,1],
  "H3リールガン": [3850,394,9.68,1,3,1],
  "ボトルガイザー": [2250,375,6,1,3,1],
  "スパッタリー": [6000,600,9.53,1,1,1],
  "スプラマニューバー": [4140,450,8.67,1,2,1],
  "クアッドホッパーブラック": [3750,360,10.15,1,2,1],
  "デュアルスイーパー": [3750,300,12.5,1,3,1],
  "ケルビン525": [4550,467,10.65,1,3,1],
  "ガエンFF": [3320,600,5,1,3,1],
  "スプラスピナー": [5133,412.5,12.44,1.1,3,1],
  "バレルスピナー": [6378,369.5,17.26,1.1,3,1],
  "ハイドラント": [11880,578.1,19.57,1.1,4,1],
  "クーゲルシュライバー": [7000,472.5,16.67,1.1,1,1],
  "ノーチラス47": [7750,330.5,23.45,1.1,3,1],
  "イグザミナー": [10675,425.6,25.08,1.1,3,1],
  "ノヴァブラスター": [5000,300,16.67,1,1,1.5],
  "ホットブラスター": [4000,240,16.67,1,2,1.5],
  "ロングブラスター": [5000,250,20,1,3,1.5],
  "ラピッドブラスター": [3080,240,12.83,1,3,1.5],
  "Rブラスターエリート": [3000,225,13.33,1,3,1.5],
  "クラッシュブラスター": [3000,255,10.33,1,2,1.5],
  "S-BLAST92": [6000,327,18.33,1,3,1.5],
  "カーボンローラー": [4480,310,14.47,1,1,1.4],
  "スプラローラー": [3200,286,11.2,1,1,1.4],
  "ヴァリアブルローラー": [3200,300,10.67,1,1,1.4],
  "ダイナモローラー": [1800,212,8.5,1,3,1.4],
  "ワイドローラー": [1950,231,7.8,1,1,1.4],
  "パブロ": [2376,360,7.82,1,1,1.4],
  "ホクサイ": [1980,360,6.05,1,1,1.4],
  "フィンセント": [3300,692,5.133,1,1,1.4],
  "スクイックリンα": [3300,353,9.35,1.1,3,1.6],
  "スプラチャージャー": [1500,273,5.5,1.1,4,1.6],
  "リッター4K": [2400,367,6.533,1.1,4,1.6],
  "ソイチューバー": [2400,234,10.27,1.1,4,1.6],
  "14式竹筒銃・甲": [4000,369,10.833,1.2,4,1],
  "R-PEN/5H": [3600,497,7.79,1.1,4,1],
  "ヒッセン": [2200,261,8.27,1,1,1.4],
  "バケットスロッシャー": [2520,290,8.72,1,2,1.4],
  "スクリュースロッシャー": [3060,268,11.4,1,2,1.4],
  "オーバーフロッシャー": [3840,450,8.12,1,1,1],
  "エクスプロッシャー": [2200,218,9.45,1,3,1.4],
  "モップリン": [3000,333,9,1,2,1.4],
  "パラシェルター": [7200,372,19.33,1,2,1.4],
  "キャンピングシェルター": [7200,424,17,1,3,1.4],
  "スパイガジェット": [4950,346,14.3,1,2,1.4],
  "24式張替傘・甲": [5250,371,14.17,1,3,1.4],
  "トライストリンガー": [7500,400,18.75,1.2,3,1],
  "LACT-450": [8400,467,18,1.2,3,1],
  "フルイドV": [6250,625,10,1,1,1],
  "ドライブワイパー": [9100,542,16.8,1.1,3,1.6],
  "ジムワイパー": [6400,571,11.2,1.1,4,1.6],
  "デンタルワイパーミント": [6300,519,12.13,1.1,3,1.6]
};

var SC_OKASHIRA_OVERRIDES = {
  "クーゲルシュライバー": { "タツ": [7000,315,22.3,1.15,4,1] },
  "ソイチューバー": { "ヨコヅナ": [6640,343,19.37,1.1,1,1] },
  "フルイドV": { "タツ": [6800,436,14.67,1.1,3,1] },
  "ドライブワイパー": { "タツ": [4095,243.9,16.8,1.1,3,1.6] },
  "ジムワイパー": { "タツ": [2880,256.95,11.2,1.1,4,1.6] },
  "デンタルワイパーミント": { "タツ": [2835,233.55,12.13,1.1,3,1.6] }
};

var SC_OKASHIRA_REFILL = 7;
var SC_OKASHIRA_TATSU_MOD = {4: 1.0, 3: 0.7, 2: 0.35, 1: 0.08};
var SC_OKASHIRA_TEAM_WEIGHTS = [0.4, 0.3, 0.2, 0.1];
var SC_OKASHIRA_STAGE_DIFF = {
  "ジョー": {"難破船ドン・ブラコ":10,"シェケナダム":8,"アラマキ砦":8,"すじこジャンクション跡":8,"ムニ・エール海洋発電所":6,"トキシラズいぶし工房":6,"どんぴこ闘技場":6},
  "タツ": {"トキシラズいぶし工房":6,"シェケナダム":3.5,"すじこジャンクション跡":3.5,"難破船ドン・ブラコ":3.5,"アラマキ砦":1,"どんぴこ闘技場":1,"ムニ・エール海洋発電所":1},
  "ヨコヅナ": {"難破船ドン・ブラコ":8,"トキシラズいぶし工房":6,"すじこジャンクション跡":6,"シェケナダム":6,"どんぴこ闘技場":3.5,"アラマキ砦":3.5,"ムニ・エール海洋発電所":1}
};
var SC_OKASHIRA_DIFF_MIN = 1, SC_OKASHIRA_DIFF_MAX = 10, SC_OKASHIRA_DIFF_PENALTY = 0.2;
var SC_OKASHIRA_SCORE_RANGE = {
  "ヨコヅナ": { min: 253.33, max: 447.51 },
  "タツ":     { min: 266.67, max: 369.27 },
  "ジョー":   { min: 240.00, max: 562.23 }
};
var SC_OKASHIRA_BOSS_BONUS = { "タツ": 15, "ヨコヅナ": 10, "ジョー": 5 };
var SC_OKASHIRA_FLOOR = { "タツ": 30, "ヨコヅナ": 25, "ジョー": 20 };
var SC_OKASHIRA_SCORE_FLOOR = 300;

function scGetOkashiraWeaponData(name, boss) {
  if (SC_OKASHIRA_OVERRIDES[name] && SC_OKASHIRA_OVERRIDES[name][boss]) {
    return SC_OKASHIRA_OVERRIDES[name][boss];
  }
  return SC_OKASHIRA_WEAPONS[name];
}

function scOkashiraWeaponScore(name, boss) {
  var d = scGetOkashiraWeaponData(name, boss);
  if (!d) return SC_OKASHIRA_SCORE_FLOOR;
  var dmg=d[0], dps=d[1], inkTime=d[2], penalty=d[3], tatsu=d[4], joe=d[5];
  var score = 0;
  if (boss === "ヨコヅナ") {
    var cycleDps = dmg / (inkTime * penalty + SC_OKASHIRA_REFILL);
    score = cycleDps * 0.7 + dps * 0.3;
  } else if (boss === "タツ") {
    var cycleDps = dmg / (inkTime * penalty + SC_OKASHIRA_REFILL);
    var raw = cycleDps * 0.7 + dps * 0.3;
    score = raw * (SC_OKASHIRA_TATSU_MOD[tatsu] || 0.08);
  } else if (boss === "ジョー") {
    var effDmg = dmg * joe, effDps = dps * joe;
    var cycleDps = effDmg / (inkTime * penalty + SC_OKASHIRA_REFILL);
    score = cycleDps * 0.7 + effDps * 0.3;
  }
  return Math.max(SC_OKASHIRA_SCORE_FLOOR, score);
}

function scGradeOkashira(weapons, stage, boss) {
  if (!boss || !SC_OKASHIRA_STAGE_DIFF[boss]) return null;
  var wCount = 0, avgBoss = 0;
  for (var wn in SC_OKASHIRA_WEAPONS) {
    avgBoss += scOkashiraWeaponScore(wn, boss);
    wCount++;
  }
  avgBoss /= wCount;

  var scores = [];
  for (var i = 0; i < weapons.length; i++) {
    if (weapons[i] === "？") {
      scores.push(avgBoss);
    } else {
      scores.push(scOkashiraWeaponScore(weapons[i], boss));
    }
  }
  scores.sort(function(a,b){return b-a;});
  var sum = 0;
  for (var k = 0; k < SC_OKASHIRA_TEAM_WEIGHTS.length && k < scores.length; k++) {
    sum += scores[k] * SC_OKASHIRA_TEAM_WEIGHTS[k];
  }
  var diff = (SC_OKASHIRA_STAGE_DIFF[boss][stage]) || SC_OKASHIRA_DIFF_MIN;
  var coeff = 1 - ((diff - SC_OKASHIRA_DIFF_MIN) / (SC_OKASHIRA_DIFF_MAX - SC_OKASHIRA_DIFF_MIN)) * SC_OKASHIRA_DIFF_PENALTY;
  var rawBoss = sum * coeff;
  var range = SC_OKASHIRA_SCORE_RANGE[boss];
  if (!range) return null;
  return Math.max(0, Math.min(100, (rawBoss - range.min) / (range.max - range.min) * 100));
}

function scGradeTeam(weapons, stage) {
  var weights = SC_STAGE_WEIGHTS[stage];
  if (!weights) return null;
  if (weapons.every(function(w) { return w === "？"; })) return null;

  var avgAll = { clearing: 0, paint: 0, mobility: 0, handling: 0, effectiveRange: 0 };
  var weaponCount = 0;
  for (var wn in WEAPON_RATINGS) {
    var wr = WEAPON_RATINGS[wn];
    avgAll.clearing += wr.clearing || 0;
    avgAll.paint += wr.paint || 0;
    avgAll.mobility += wr.mobility || 0;
    avgAll.handling += wr.handling || 0;
    avgAll.effectiveRange += wr.effectiveRange || 0;
    weaponCount++;
  }
  for (var ak in avgAll) avgAll[ak] /= weaponCount;

  var allClearing = [], allPaint = [], allMobility = [], allHandling = [], allRange = [];
  for (var i = 0; i < weapons.length; i++) {
    if (weapons[i] === "？") {
      allClearing.push(avgAll.clearing);
      allPaint.push(avgAll.paint);
      allMobility.push(avgAll.mobility);
      allHandling.push(avgAll.handling);
      allRange.push(avgAll.effectiveRange);
    } else {
      var r = WEAPON_RATINGS[weapons[i]];
      if (!r) continue;
      allClearing.push(r.clearing || 0);
      allPaint.push(r.paint || 0);
      allMobility.push(r.mobility || 0);
      allHandling.push(r.handling || 0);
      allRange.push(r.effectiveRange || 0);
    }
  }
  var descSort = function(a, b) { return b - a; };
  allClearing.sort(descSort);
  allPaint.sort(descSort);
  allMobility.sort(descSort);
  allHandling.sort(descSort);
  allRange.sort(descSort);

  function weightedAvg(arr, w) {
    var sum = 0;
    for (var k = 0; k < w.length && k < arr.length; k++) sum += arr[k] * w[k];
    return sum;
  }
  var avgClearing = weightedAvg(allClearing, [0.45, 0.35, 0.2]);
  var avgPaint = weightedAvg(allPaint, [0.5, 0.3, 0.1, 0.1]);
  var avgMobility = weightedAvg(allMobility, [0.4, 0.3, 0.2, 0.1]);
  var avgHandling = weightedAvg(allHandling, [0.25, 0.25, 0.25, 0.25]);
  var avgRange2 = weightedAvg(allRange, [0.6, 0.3, 0.1]);

  var bossDanger = SC_STAGE_BOSS_DANGER[stage];
  var bossScore = 0;
  var bossPenalty = 0;
  if (bossDanger) {
    var weightedSum = 0, dangerTotal = 0;
    for (var bossJP in bossDanger) {
      var bossKey = SC_BOSS_KEY[bossJP];
      var danger = bossDanger[bossJP];
      dangerTotal += danger;
      var matches = [];
      for (var j = 0; j < weapons.length; j++) {
        if (weapons[j] === "？") {
          var bSum = 0, bCnt = 0;
          for (var wn2 in BOSS_MATCHUPS) {
            var bm2 = BOSS_MATCHUPS[wn2];
            if (bm2 && bm2[bossKey] !== undefined) { bSum += bm2[bossKey]; bCnt++; }
          }
          if (bCnt > 0) matches.push(bSum / bCnt);
        } else {
          var bm = BOSS_MATCHUPS[weapons[j]];
          if (bm && bm[bossKey] !== undefined) {
            matches.push(bm[bossKey]);
          }
        }
      }
      matches.sort(function(a, b) { return b - a; });
      if (matches.length > 0) {
        var evalWeights = SC_BOSS_EVAL[bossKey] || [0.7, 0.3];
        weightedSum += danger * weightedAvg(matches, evalWeights);
      }
      if (danger >= 6 && matches.length > 0) {
        if (matches[0] <= 2) bossPenalty += danger * 3;
        var goodCount = matches.filter(function(m) { return m >= 3; }).length;
        if (goodCount < 2) bossPenalty += danger * 1.5;
      }
    }
    if (dangerTotal > 0) {
      bossScore = ((weightedSum / dangerTotal - 1) / 4) * 100;
      bossScore = Math.max(0, bossScore - bossPenalty);
    }
  }

  var mobPct = (avgMobility - SC_METRIC_RANGE.mobility.min) / (SC_METRIC_RANGE.mobility.max - SC_METRIC_RANGE.mobility.min);
  var hdlPct = (avgHandling - SC_METRIC_RANGE.handling.min) / (SC_METRIC_RANGE.handling.max - SC_METRIC_RANGE.handling.min);
  var practicalPct = mobPct * 0.3 + hdlPct * 0.7;
  var pracPenalty = 1.0;
  if (practicalPct < 0.65) {
    pracPenalty = Math.max(0.3, 1 - (0.65 - practicalPct) * 1.9);
  }
  bossScore *= pracPenalty;
  avgRange2 *= pracPenalty;

  var baseScore = avgClearing * (weights.clearing / 100)
                + avgPaint * (weights.paint / 100)
                + bossScore * (weights.boss / 100)
                + avgMobility * (weights.mobility / 100)
                + avgHandling * (weights.handling / 100);

  var diff = SC_STAGE_DIFFICULTY[stage] || SC_DIFF_MIN;
  var coeff = 1 - ((diff - SC_DIFF_MIN) / (SC_DIFF_MAX - SC_DIFF_MIN)) * SC_DIFF_PENALTY;
  var rawTotal = (baseScore * 0.9 + avgRange2 * 0.1) * coeff;
  var total = Math.max(0, Math.min(100, (rawTotal - SC_SCORE_MIN) / (SC_SCORE_MAX - SC_SCORE_MIN) * 100));
  return total;
}

function tierColor(score) {
  var v = Math.round(score * 10) / 10;
  if (v >= 80) return "#ff2496";
  if (v >= 70) return "#c77dff";
  if (v >= 60) return "#4a90d9";
  if (v >= 50) return "#e0e0e0";
  if (v >= 35) return "#ff6b35";
  return "#ff4444";
}

// ============================================================
// ユーティリティ
// ============================================================

var DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function formatDate(dateStr, year) {
  var parts = dateStr.match(/(\d+)\/(\d+)\s+(\d+):(\d+)/);
  if (!parts) return dateStr;
  var m = parseInt(parts[1]), d = parseInt(parts[2]);
  var h = parseInt(parts[3]), min = parts[4];
  var dt = new Date(year, m - 1, d, h, parseInt(min));
  var dow = DAY_NAMES[dt.getDay()];
  return m + "/" + d + "(" + dow + ") " + h + ":" + min;
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- 年セレクト初期化 ---
function populateYears() {
  var years = [];
  var seen = {};
  for (var i = 0; i < scheduleData.length; i++) {
    if (!seen[scheduleData[i].year]) {
      seen[scheduleData[i].year] = true;
      years.push(scheduleData[i].year);
    }
  }
  years.sort();
  var select = document.getElementById("date-year");
  for (var j = 0; j < years.length; j++) {
    var opt = document.createElement("option");
    opt.value = years[j];
    opt.textContent = years[j] + "年";
    select.appendChild(opt);
  }
}

// --- 最新5件 ---
function searchRecent() {
  var sorted = scheduleData.slice().sort(function(a, b) { return b.no - a.no; });
  renderResults(sorted.slice(0, 5));
  document.getElementById("result-count").textContent = "最新5件を表示しています。";
}

// --- タブ切り替え ---
function initTabs() {
  document.querySelectorAll(".search-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".search-tab").forEach(function(t) { t.classList.remove("active"); });
      document.querySelectorAll(".search-panel").forEach(function(p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");

      if (tab.dataset.tab === "recent") {
        searchRecent(); return;
      }
      if (tab.dataset.tab === "weapon") {
        var q = document.getElementById("weapon-input").value.trim();
        if (q) { searchByWeapon(q); return; }
      }
      if (tab.dataset.tab === "special") {
        var activeBtn = document.querySelector(".special-btn.active");
        if (activeBtn) { searchBySpecial(activeBtn.dataset.type); return; }
      }
      if (tab.dataset.tab === "date") {
        var y = document.getElementById("date-year").value;
        var m = document.getElementById("date-month").value;
        if (y && m) { document.getElementById("date-year").dispatchEvent(new Event("change")); return; }
      }
      clearResults();
    });
  });
}

// --- 検索用正規化 ---
function normalizeQuery(str) {
  str = str.replace(/[\u3041-\u3096]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 0x60);
  });
  str = str.replace(/[\uFF01-\uFF5E]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
  return str.toLowerCase();
}

// --- ブキ検索 ---
function initWeaponSearch() {
  var input = document.getElementById("weapon-input");
  var sugBox = document.getElementById("weapon-suggestions");

  var allWeaponsSet = {};
  for (var i = 0; i < scheduleData.length; i++) {
    for (var j = 0; j < scheduleData[i].weapons.length; j++) {
      var w = scheduleData[i].weapons[j];
      if (w !== "？") allWeaponsSet[w] = true;
    }
  }
  var allWeapons = Object.keys(allWeaponsSet).sort();

  input.addEventListener("input", function() {
    var query = input.value.trim();
    sugBox.innerHTML = "";
    if (query.length === 0) { clearResults(); return; }

    var nq = normalizeQuery(query);
    var matches = allWeapons.filter(function(w) { return normalizeQuery(w).includes(nq); });
    matches.slice(0, 10).forEach(function(w) {
      var div = document.createElement("div");
      div.className = "suggestion-item";
      var src = WEAPON_ICONS[w];
      if (src) {
        div.innerHTML = '<img class="icon icon-weapon" src="' + ICON_DIR + src +
          '" alt="" style="vertical-align:middle;margin-right:4px;">' + escapeHtml(w);
      } else {
        div.textContent = w;
      }
      div.addEventListener("click", function() {
        input.value = w;
        sugBox.innerHTML = "";
        searchByWeapon(w);
      });
      sugBox.appendChild(div);
    });

    // サジェストから選択するまで検索しない
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest("#panel-weapon")) {
      sugBox.innerHTML = "";
    }
  });
}

function searchByWeapon(query) {
  var nq = normalizeQuery(query);
  var results = scheduleData.filter(function(r) {
    return r.weapons.some(function(w) { return normalizeQuery(w).includes(nq); });
  });
  renderResults(results);
}

// --- 特殊編成検索 ---
function searchBySpecial(type) {
  var results = scheduleData.filter(function(r) {
    if (type === "bigrun") return r.eventType === "bigrun" || r.eventType === "bigbigrun";
    if (type === "golden") return r.isGolden;
    var allRandom = r.weapons.every(function(w) { return w === "？"; });
    if (type === "all-random") return allRandom && !r.isGolden;
    var hasRandom = r.weapons.some(function(w) { return w === "？"; });
    if (type === "has-random") return hasRandom && !allRandom && !r.isGolden;
    return false;
  });
  renderResults(results);
}

function initSpecialSearch() {
  document.querySelectorAll(".special-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var wasActive = btn.classList.contains("active");
      document.querySelectorAll(".special-btn").forEach(function(b) { b.classList.remove("active"); });
      if (wasActive) { clearResults(); return; }
      btn.classList.add("active");
      searchBySpecial(btn.dataset.type);
    });
  });
}

// --- 日時検索 ---
function initDateSearch() {
  var yearSel = document.getElementById("date-year");
  var monthSel = document.getElementById("date-month");

  var doSearch = function() {
    var year = yearSel.value;
    var month = monthSel.value;
    if (!year || !month) { clearResults(); return; }
    var results = scheduleData.filter(function(r) {
      if (r.year !== Number(year)) return false;
      var startMonth = r.startDate.split("/")[0];
      var endMonth = r.endDate ? r.endDate.split("/")[0] : startMonth;
      if (startMonth !== month && endMonth !== month) return false;
      return true;
    });
    renderResults(results);
  };

  yearSel.addEventListener("change", doSearch);
  monthSel.addEventListener("change", doSearch);
}

// ============================================================
// 点線レイアウト（grading.htmlと同じ）
// ============================================================

function layoutDots(el) {
  var w = el.offsetWidth;
  var DOT_COUNT;
  if (w <= 350) DOT_COUNT = 32;
  else if (w <= 400) DOT_COUNT = 36;
  else if (w <= 460) DOT_COUNT = 40;
  else if (w <= 560) DOT_COUNT = 48;
  else if (w <= 660) DOT_COUNT = 54;
  else DOT_COUNT = 60;
  if (w === 0) return;
  var unit = w / (DOT_COUNT * 3 - 1);
  var dotW = unit * 2;
  var gapW = unit;
  el.innerHTML = "";
  for (var i = 0; i < DOT_COUNT; i++) {
    var dot = document.createElement("div");
    dot.className = "sc-dot";
    dot.style.width = dotW + "px";
    el.appendChild(dot);
    if (i < DOT_COUNT - 1) {
      var gap = document.createElement("div");
      gap.className = "sc-gap";
      gap.style.width = gapW + "px";
      el.appendChild(gap);
    }
  }
}

// ============================================================
// カード描画（grading.htmlカード構造準拠）
// ============================================================

var allDividers = [];

// 開催日時文字列をDateに変換（"MM/DD HH:MM" + year）
function parseScheduleDate(dateStr, year) {
  var parts = dateStr.split(" ");
  var md = parts[0].split("/");
  var hm = parts[1].split(":");
  return new Date(year, parseInt(md[0]) - 1, parseInt(md[1]), parseInt(hm[0]), parseInt(hm[1]));
}

// 現在開催中と次の編成のNo.を取得
function detectCurrentAndNext() {
  var now = new Date();
  var currentNo = null;
  var nextNo = null;
  var nextStart = null;
  for (var i = 0; i < scheduleData.length; i++) {
    var r = scheduleData[i];
    var startMonth = parseInt(r.startDate.split("/")[0]);
    var endMonth = parseInt(r.endDate.split("/")[0]);
    var endYear = r.year;
    if (endMonth < startMonth) endYear++;
    var start = parseScheduleDate(r.startDate, r.year);
    var end = parseScheduleDate(r.endDate, endYear);
    if (now >= start && now < end) {
      currentNo = r.no;
    }
    if (start > now && (nextStart === null || start < nextStart)) {
      nextStart = start;
      nextNo = r.no;
    }
  }
  return { currentNo: currentNo, nextNo: nextNo };
}

function renderResults(results) {
  var container = document.getElementById("results-cards");
  var countEl = document.getElementById("result-count");
  container.innerHTML = "";
  allDividers = [];

  countEl.textContent = results.length + "件のスケジュールが見つかりました。";

  if (results.length === 0) {
    var noResult = document.createElement("p");
    noResult.style.textAlign = "center";
    noResult.style.color = "#aaa";
    noResult.textContent = "該当なし";
    container.appendChild(noResult);
    return;
  }

  var sorted = results.slice().sort(function(a, b) { return a.no - b.no; });
  var status = detectCurrentAndNext();
  var frag = document.createDocumentFragment();

  for (var idx = 0; idx < sorted.length; idx++) {
    var r = sorted[idx];
    var isAllRandom = r.weapons.every(function(w) { return w === "？"; });
    var isGolden = r.isGolden;
    var isBigRun = r.eventType === "bigrun" || r.eventType === "bigbigrun";

    var card = document.createElement("div");
    var cardClass = "sc-card";
    if (isGolden) cardClass += " sc-card-golden";
    if (isGolden && isBigRun) cardClass += " sc-card-holo";
    else if (!isGolden && isAllRandom) cardClass += " sc-card-holo";
    card.className = cardClass;

    // 終了日の年を推定（月が戻ったら翌年）
    var startMonth = parseInt(r.startDate.split("/")[0]);
    var endMonth = parseInt(r.endDate.split("/")[0]);
    var endYear = r.year;
    if (endMonth < startMonth) endYear++;

    // === 1行目: 年号バッジ + 日時 ===
    var dateRow = document.createElement("div");
    dateRow.className = "sc-date-row";
    var noBadge = document.createElement("span");
    noBadge.className = "sc-no";
    if (status.currentNo === r.no) {
      noBadge.className = "sc-no sc-status-badge";
      noBadge.textContent = "オープン!";
    } else if (status.nextNo === r.no) {
      noBadge.className = "sc-no sc-status-badge";
      noBadge.textContent = "そのつぎ";
    } else {
      noBadge.textContent = "No." + r.no;
    }
    dateRow.appendChild(noBadge);
    var yearBadge = document.createElement("span");
    yearBadge.className = "sc-year";
    yearBadge.textContent = r.year + "年";
    dateRow.appendChild(yearBadge);
    var dateSpan = document.createElement("span");
    dateSpan.className = "sc-date";
    dateSpan.textContent = formatDate(r.startDate, r.year) + " - " + formatDate(r.endDate, endYear);
    dateRow.appendChild(dateSpan);
    card.appendChild(dateRow);

    // === 2行目: ステージ画像 + ステージ名/バッジ + ブキ ===
    var infoDiv = document.createElement("div");
    infoDiv.className = "sc-info";

    var stageImg = document.createElement("img");
    stageImg.className = "sc-stage-img";
    stageImg.src = ICON_DIR + (STAGE_ICONS_HIGH[r.stage] || "stage_random_high.png");
    stageImg.alt = r.stage;
    infoDiv.appendChild(stageImg);

    var stageCol = document.createElement("div");
    stageCol.className = "sc-stage-col";
    if (isBigRun || isGolden) {
      if (isBigRun) {
        var bigBadge = document.createElement("span");
        bigBadge.className = "sc-event-badge";
        bigBadge.textContent = "ビッグラン";
        if (isGolden) bigBadge.style.background = "#b8860b";
        stageCol.appendChild(bigBadge);
      }
      if (isGolden && !isBigRun) {
        var goldenBadge = document.createElement("span");
        goldenBadge.className = "sc-event-badge";
        goldenBadge.textContent = "クマフェス";
        goldenBadge.style.background = "#b8860b";
        stageCol.appendChild(goldenBadge);
      }
    }
    var stageName = document.createElement("span");
    stageName.className = "sc-stage-name";
    stageName.textContent = r.stage;
    stageCol.appendChild(stageName);
    infoDiv.appendChild(stageCol);

    var weaponsDiv = document.createElement("div");
    weaponsDiv.className = "sc-weapons";
    for (var wi = 0; wi < r.weapons.length; wi++) {
      var wName = r.weapons[wi];
      var wWrap = document.createElement("span");
      wWrap.className = "icon-wrap";

      var wImgSrc;
      var wTitle;
      if (isGolden && wName === "？") {
        wImgSrc = "weapon_random_rare.png";
        wTitle = "？（黄金）";
      } else if (wName === "？") {
        wImgSrc = "weapon_random.png";
        wTitle = "？（ランダム）";
      } else {
        wImgSrc = WEAPON_ICONS[wName] || "weapon_random.png";
        wTitle = wName;
      }

      wWrap.setAttribute("data-tooltip", wTitle);
      var wImg = document.createElement("img");
      wImg.src = ICON_DIR + wImgSrc;
      wImg.alt = wTitle;
      wWrap.appendChild(wImg);


      weaponsDiv.appendChild(wWrap);
    }
    infoDiv.appendChild(weaponsDiv);
    card.appendChild(infoDiv);

    // === 点線区切り ===
    var divider = document.createElement("div");
    divider.className = "sc-divider";
    card.appendChild(divider);
    allDividers.push(divider);

    // === スコア表示（総合 + オカシラ横並び） ===
    if (isAllRandom || isGolden) {
      var unmeasurable = document.createElement("div");
      unmeasurable.className = "sc-unmeasurable";
      unmeasurable.textContent = "測定不能";
      if (r.boss && SC_OKASHIRA_ICON_MAP[r.boss]) {
        var unmWrap = document.createElement("span");
        unmWrap.className = "icon-wrap";
        unmWrap.setAttribute("data-tooltip", r.boss);
        var unmIcon = document.createElement("img");
        unmIcon.className = "sc-unmeasurable-icon";
        unmIcon.src = ICON_DIR + SC_OKASHIRA_ICON_MAP[r.boss];
        unmIcon.alt = r.boss;
        unmWrap.appendChild(unmIcon);
        unmeasurable.appendChild(unmWrap);
      }
      card.appendChild(unmeasurable);
    } else {
      var totalScore = scGradeTeam(r.weapons, r.stage);
      if (totalScore !== null) {
        var scoreRow = document.createElement("div");
        scoreRow.className = "sc-score-row";

        // 総合スコア
        var totalEl = document.createElement("span");
        totalEl.className = "sc-total";
        totalEl.style.color = tierColor(totalScore);
        totalEl.innerHTML = '<span class="sc-total-prefix">総合</span>' + totalScore.toFixed(1) + '<span class="sc-total-unit">点</span>';
        scoreRow.appendChild(totalEl);

        // オカシラ（アイコン + スコア、同じ行）
        if (r.boss && SC_OKASHIRA_STAGE_DIFF[r.boss]) {
          var bossNorm = scGradeOkashira(r.weapons, r.stage, r.boss);
          if (bossNorm !== null) {
            var adjustedBoss = Math.max(0, Math.min(100, bossNorm + (SC_OKASHIRA_BOSS_BONUS[r.boss] || 0)));
            var okashiraBlend = totalScore * 0.2 + adjustedBoss * 0.8;
            var floor = SC_OKASHIRA_FLOOR[r.boss] || 20;
            var okashiraTotal = floor + (100 - floor) * okashiraBlend / 100;

            var okaDiv = document.createElement("span");
            okaDiv.className = "sc-okashira";

            var bossWrap = document.createElement("span");
            bossWrap.className = "icon-wrap";
            bossWrap.setAttribute("data-tooltip", r.boss);
            var bossIcon = document.createElement("img");
            bossIcon.className = "sc-okashira-icon";
            bossIcon.src = ICON_DIR + (SC_OKASHIRA_ICON_MAP[r.boss] || "");
            bossIcon.alt = r.boss;
            bossWrap.appendChild(bossIcon);
            okaDiv.appendChild(bossWrap);

            var okaScore = document.createElement("span");
            okaScore.className = "sc-total";
            okaScore.style.color = tierColor(okashiraTotal);
            okaScore.innerHTML = '<span class="sc-total-prefix">オカシラ</span>' + okashiraTotal.toFixed(1) + '<span class="sc-total-unit">点</span>';
            okaDiv.appendChild(okaScore);

            scoreRow.appendChild(okaDiv);
          }
        } else if (r.boss && SC_OKASHIRA_ICON_MAP[r.boss]) {
          // ランダム等、採点不能なオカシラ → アイコンのみ表示
          var okaDiv2 = document.createElement("span");
          okaDiv2.className = "sc-okashira";
          var bossWrap2 = document.createElement("span");
          bossWrap2.className = "icon-wrap";
          bossWrap2.setAttribute("data-tooltip", r.boss);
          var bossIcon2 = document.createElement("img");
          bossIcon2.className = "sc-okashira-icon";
          bossIcon2.src = ICON_DIR + SC_OKASHIRA_ICON_MAP[r.boss];
          bossIcon2.alt = r.boss;
          bossWrap2.appendChild(bossIcon2);
          okaDiv2.appendChild(bossWrap2);
          scoreRow.appendChild(okaDiv2);
        }

        card.appendChild(scoreRow);
      } else {
        var unmEl = document.createElement("div");
        unmEl.className = "sc-unmeasurable";
        unmEl.textContent = "測定不能";
        if (r.boss && SC_OKASHIRA_ICON_MAP[r.boss]) {
          var unmWrap2 = document.createElement("span");
          unmWrap2.className = "icon-wrap";
          unmWrap2.setAttribute("data-tooltip", r.boss);
          var unmIcon2 = document.createElement("img");
          unmIcon2.className = "sc-unmeasurable-icon";
          unmIcon2.src = ICON_DIR + SC_OKASHIRA_ICON_MAP[r.boss];
          unmIcon2.alt = r.boss;
          unmWrap2.appendChild(unmIcon2);
          unmEl.appendChild(unmWrap2);
        }
        card.appendChild(unmEl);
      }
    }

    frag.appendChild(card);
  }

  container.appendChild(frag);

  // 点線レイアウト
  relayoutAllDividers();
}

function relayoutAllDividers() {
  for (var j = 0; j < allDividers.length; j++) {
    layoutDots(allDividers[j]);
  }
}

function clearResults() {
  document.getElementById("results-cards").innerHTML = "";
  document.getElementById("result-count").textContent = "";
  allDividers = [];
}

// --- ツールチップ ---
function initTooltip() {
  var tip = document.createElement("div");
  tip.id = "tooltip";
  document.body.appendChild(tip);

  document.addEventListener("mouseover", function(e) {
    var wrap = e.target.closest(".icon-wrap");
    if (!wrap) return;
    showTooltip(wrap, tip);
  });

  document.addEventListener("mouseout", function(e) {
    if (e.target.closest(".icon-wrap")) {
      tip.classList.remove("visible");
    }
  });

  document.addEventListener("click", function(e) {
    var wrap = e.target.closest(".icon-wrap");
    if (wrap) {
      e.stopPropagation();
      if (tip.classList.contains("visible") && tip._currentWrap === wrap) {
        tip.classList.remove("visible");
      } else {
        showTooltip(wrap, tip);
      }
    } else {
      tip.classList.remove("visible");
    }
  });

  document.addEventListener("touchend", function(e) {
    var wrap = e.target.closest(".icon-wrap");
    if (wrap) {
      e.preventDefault();
      if (tip.classList.contains("visible") && tip._currentWrap === wrap) {
        tip.classList.remove("visible");
      } else {
        showTooltip(wrap, tip);
      }
    } else {
      tip.classList.remove("visible");
    }
  });
}

function showTooltip(wrap, tip) {
  tip.textContent = wrap.dataset.tooltip;
  tip._currentWrap = wrap;
  tip.classList.add("visible");

  var rect = wrap.getBoundingClientRect();
  var tipW = tip.offsetWidth;
  var left = rect.left + rect.width / 2 - tipW / 2;
  if (left < 4) left = 4;
  if (left + tipW > window.innerWidth - 4) left = window.innerWidth - 4 - tipW;

  tip.style.left = left + window.scrollX + "px";
  tip.style.top = rect.top + window.scrollY - tip.offsetHeight - 6 + "px";
}

// --- 初期化 ---
function init() {
  populateYears();
  initTabs();
  initWeaponSearch();
  initDateSearch();
  initSpecialSearch();
  initTooltip();
  window.addEventListener("resize", relayoutAllDividers);
  searchRecent();
}

document.addEventListener("DOMContentLoaded", init);
