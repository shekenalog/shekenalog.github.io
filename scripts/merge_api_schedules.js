// splatoon3.ink APIからスケジュールを取得し、既存データにマージ
const https = require('https');
const fs = require('fs');

// 英語→日本語 マッピング
const STAGE_MAP = {
  "Spawning Grounds": "シェケナダム",
  "Marooner's Bay": "難破船ドン・ブラコ",
  "Sockeye Station": "アラマキ砦",
  "Gone Fission Hydroplant": "ムニ・エール海洋発電所",
  "Jammin' Salmon Junction": "すじこジャンクション跡",
  "Salmonid Smokeyard": "トキシラズいぶし工房",
  "Bonerattle Arena": "どんぴこ闘技場",
  // ビッグラン
  "Wahoo World": "スメーシーワールド",
  "Inkblot Art Academy": "海女美術大学",
  "Undertow Spillway": "マテガイ放水路",
  "Um'ami Ruins": "ナンプラー遺跡",
  "Barnacle & Dime": "タラポートショッピングパーク",
  "Eeltail Alley": "ゴンズイ地区",
  "Grand Splatlands Bowl": "グランドバンカラアリーナ",
};

const BOSS_MAP = {
  "Cohozuna": "ヨコヅナ",
  "Horrorboros": "タツ",
  "Megalodontia": "ジョー",
  "Triumvirate": "オカシラ連合",
};

const WEAPON_MAP = {
  // シューター
  ".52 Gal": ".52ガロン",
  ".96 Gal": ".96ガロン",
  "Aerospray MG": "プロモデラーMG",
  "H-3 Nozzlenose": "H3リールガン",
  "Jet Squelcher": "ジェットスイーパー",
  "L-3 Nozzlenose": "L3リールガン",
  "N-ZAP '85": "N-ZAP85",
  "Splash-o-matic": "シャープマーカー",
  "Splattershot": "スプラシューター",
  "Splattershot Jr.": "わかばシューター",
  "Splattershot Nova": "スペースシューター",
  "Splattershot Pro": "プライムシューター",
  "Sploosh-o-matic": "ボールドマーカー",
  "Squeezer": "ボトルガイザー",
  // ローラー
  "Big Swig Roller": "ワイドローラー",
  "Carbon Roller": "カーボンローラー",
  "Dynamo Roller": "ダイナモローラー",
  "Flingza Roller": "ヴァリアブルローラー",
  "Splat Roller": "スプラローラー",
  // チャージャー
  "Bamboozler 14 Mk I": "14式竹筒銃・甲",
  "Classic Squiffer": "スクイックリンα",
  "E-liter 4K": "リッター4K",
  "Goo Tuber": "ソイチューバー",
  "Snipewriter 5H": "R-PEN/5H",
  "Splat Charger": "スプラチャージャー",
  // ブラスター
  "Blaster": "ホットブラスター",
  "Clash Blaster": "クラッシュブラスター",
  "Luna Blaster": "ノヴァブラスター",
  "Range Blaster": "ロングブラスター",
  "Rapid Blaster": "ラピッドブラスター",
  "Rapid Blaster Pro": "Rブラスターエリート",
  "S-BLAST '92": "S-BLAST92",
  // フデ
  "Inkbrush": "パブロ",
  "Octobrush": "ホクサイ",
  "Painbrush": "フィンセント",
  // スロッシャー
  "Bloblobber": "オーバーフロッシャー",
  "Dread Wringer": "モップリン",
  "Explosher": "エクスプロッシャー",
  "Slosher": "バケットスロッシャー",
  "Sloshing Machine": "スクリュースロッシャー",
  "Tri-Slosher": "ヒッセン",
  // スピナー
  "Ballpoint Splatling": "クーゲルシュライバー",
  "Heavy Splatling": "バレルスピナー",
  "Hydra Splatling": "ハイドラント",
  "Mini Splatling": "スプラスピナー",
  "Nautilus 47": "ノーチラス47",
  "Heavy Edit Splatling": "イグザミナー",
  // マニューバー
  "Dapple Dualies": "スパッタリー",
  "Douser Dualies FF": "ガエンFF",
  "Dark Tetra Dualies": "クアッドホッパーブラック",
  "Dualie Squelchers": "デュアルスイーパー",
  "Glooga Dualies": "ケルビン525",
  "Splat Dualies": "スプラマニューバー",
  // シェルター
  "Brella": "パラシェルター",  // "Splat Brella" sometimes
  "Splat Brella": "パラシェルター",
  "Recycled Brella 24 Mk I": "24式張替傘・甲",
  "Tenta Brella": "キャンピングシェルター",
  "Undercover Brella": "スパイガジェット",
  // ストリンガー
  "REEF-LUX 450": "LACT-450",
  "Tri-Stringer": "トライストリンガー",
  // ワイパー
  "Splatana Stamper": "ジムワイパー",
  "Splatana Wiper": "ドライブワイパー",
  "Mint Decavitator": "デンタルワイパーミント",
  "Wellstring V": "フルイドV",
  // クマサン印
  "Grizzco Blaster": "クマサン印のブラスター",
  "Grizzco Brella": "クマサン印のシェルター",
  "Grizzco Charger": "クマサン印のチャージャー",
  "Grizzco Dualies": "クマサン印のマニューバー",
  "Grizzco Roller": "クマサン印のローラー",
  "Grizzco Slosher": "クマサン印のスロッシャー",
  "Grizzco Stringer": "クマサン印のストリンガー",
  "Grizzco Splatana": "クマサン印のワイパー",
  // ランダム
  "Random": "？",
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function utcToJST(isoStr) {
  const d = new Date(new Date(isoStr).getTime() + 9 * 60 * 60 * 1000);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return { dateStr: `${mm}/${dd} ${hh}:${min}`, year: d.getUTCFullYear() };
}

// 通常ランダム（緑ハテナ）のimage URL hash
const RANDOM_GREEN_HASH = "473fffb2442075078d8bb7125744905abdeae651b6a5b7453ae295582e45f7d1_0";

// ブキ配列から黄金判定: 全ランダムかつ通常ランダムでないimage URLがあれば黄金
function detectGolden(weapons) {
  if (!weapons.every(w => w.name === "Random")) return false;
  return weapons.some(w => {
    const url = w.image?.url || "";
    return !url.includes(RANDOM_GREEN_HASH);
  });
}

function mapWeapon(name) {
  if (!name) return "？";
  if (name === "Random" || !name) return "？";
  const jp = WEAPON_MAP[name];
  if (!jp) {
    console.error(`WARNING: Unknown weapon: "${name}"`);
    return name;
  }
  return jp;
}

function mapStage(name) {
  const jp = STAGE_MAP[name];
  if (!jp) {
    console.error(`WARNING: Unknown stage: "${name}"`);
    return name;
  }
  return jp;
}

function mapBoss(name) {
  if (!name) return "不明";
  const jp = BOSS_MAP[name];
  if (!jp) {
    console.error(`WARNING: Unknown boss: "${name}"`);
    return name;
  }
  return jp;
}

async function main() {
  // 既存データ読み込み
  const existing = JSON.parse(fs.readFileSync('data/salmon_history.json', 'utf-8'));
  const lastNo = existing[existing.length - 1].no;
  const lastEnd = existing[existing.length - 1].endDate;
  const lastYear = existing[existing.length - 1].year;
  console.error(`Existing: ${existing.length} records, last No.${lastNo}, ends ${lastYear}/${lastEnd}`);

  // 既存の開始日セット（重複チェック用）
  const existingDates = new Set(existing.map(r => `${r.year}/${r.startDate}`));

  // API取得
  const api = await fetchJSON('https://splatoon3.ink/data/schedules.json');

  const newRecords = [];

  // Regular schedules
  const regular = api.data?.coopGroupingSchedule?.regularSchedules?.nodes || [];
  for (const node of regular) {
    const start = utcToJST(node.startTime);
    const end = utcToJST(node.endTime);
    const key = `${start.year}/${start.dateStr}`;
    if (existingDates.has(key)) continue;

    const setting = node.setting;
    if (!setting) continue;

    const isGolden = detectGolden(setting.weapons);
    const weapons = setting.weapons.map(w => {
      if (w.name === "Random") return "？";
      return mapWeapon(w.name);
    });
    const bossName = setting.boss ? mapBoss(setting.boss.name) : "不明";

    newRecords.push({
      startTime: node.startTime,
      startDateStr: start.dateStr,
      endDateStr: end.dateStr,
      startYear: start.year,
      stage: mapStage(setting.coopStage.name),
      boss: bossName,
      weapons: weapons,
      eventType: "regular",
      isGolden: isGolden,
    });
  }

  // Big Run schedules
  const bigrun = api.data?.coopGroupingSchedule?.bigRunSchedules?.nodes || [];
  for (const node of bigrun) {
    const start = utcToJST(node.startTime);
    const end = utcToJST(node.endTime);
    const key = `${start.year}/${start.dateStr}`;
    if (existingDates.has(key)) continue;

    const setting = node.setting;
    if (!setting) continue;

    const isGolden = detectGolden(setting.weapons);
    const weapons = setting.weapons.map(w => {
      if (w.name === "Random") return "？";
      return mapWeapon(w.name);
    });
    const bossName = setting.boss ? mapBoss(setting.boss.name) : "不明";

    newRecords.push({
      startTime: node.startTime,
      startDateStr: start.dateStr,
      endDateStr: end.dateStr,
      startYear: start.year,
      stage: mapStage(setting.coopStage.name),
      boss: bossName,
      weapons: weapons,
      eventType: "bigrun",
      isGolden: isGolden,
    });
  }

  // Team Contest — バイトチームコンテストは対象外（スキップ）

  // 時系列ソート
  newRecords.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  console.error(`New schedules from API: ${newRecords.length}`);

  if (newRecords.length === 0) {
    console.error("No new records to add.");
    process.exit(0);
  }

  // 連番付与
  let nextNo = lastNo + 1;

  // ギャップ検出
  const lastEndFull = `${lastYear}/${lastEnd}`;
  const firstNewStart = `${newRecords[0].startYear}/${newRecords[0].startDateStr}`;
  if (lastEndFull !== firstNewStart) {
    console.error(`WARNING: Gap detected! Last record ends at ${lastEndFull}, first new starts at ${firstNewStart}`);
    console.error(`You may need to fill records ${nextNo}-??? manually or via wiki fetch.`);
  }

  // マージ
  for (const rec of newRecords) {
    existing.push({
      no: nextNo++,
      year: rec.startYear,
      startDate: rec.startDateStr,
      endDate: rec.endDateStr,
      stage: rec.stage,
      boss: rec.boss,
      weapons: rec.weapons,
      eventType: rec.eventType,
      isGolden: rec.isGolden,
    });
  }

  // 書き出し
  const json = JSON.stringify(existing, null, 2);
  fs.writeFileSync('data/salmon_history.json', json + '\n');
  fs.writeFileSync('js/schedule_data.js', 'const SCHEDULE_DATA = ' + json.trim() + ';\n');

  console.error(`Done! Total records: ${existing.length} (added ${newRecords.length})`);
  // 追加されたレコードを表示
  for (const rec of newRecords) {
    console.error(`  No.${existing.find(r => r.startDate === rec.startDateStr && r.year === rec.startYear).no}: ${rec.startYear}/${rec.startDateStr} - ${rec.endDateStr} ${rec.stage} [${rec.eventType}]`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
