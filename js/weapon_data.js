// ブキデータベース（サーモンラン用）
// SR補正: wikiwiki.jp/splatoon3mix/サーモンラン/バイト専用ブキの補正 (ver.9.3.0)
// メイン性能: 各ブキページのメイン性能テーブル (ver.11.0.0)
// フレームデータ: scripts/fetch_frame_data.js で自動取得
//
// range: 有効射程（試し撃ちライン単位）。複数モード持ちは代表値
// paintRange: 塗り射程
// spread: 拡散（度）。N/Aのブキは null
// paintPerShot: 単発塗りポイント（対人値、SRでも流用）
// srDamage: SR補正ダメージ（最大）
// srDps: SR補正DPS
// srInk: SR補正インク消費量（%）
// srFireRate: 連射フレーム数（F）
// weight: 重量区分 "light" | "mid" | "heavy"
// fd*: フレームデータ（wiki自動取得）
//   fdShootSpeed: 射撃時ヒト速
//   fdNonShootSpeed: 非射撃時ヒト速
//   fdSquidSpeed: イカ速
//   fdPreFireSquid: 射撃前隙（イカ）(F)
//   fdPreFireHuman: 射撃前隙（ヒト）(F)
//   fdPostFire: 射撃後隙 (F)
//   fdInkLock: インク回復不能時間 (F)
//   fdSlideToAttack: SL開始～攻撃可能 (F) [マニューバー]
//   fdSlideToMove: SL開始～移動可能 (F) [マニューバー]
//   fdChargeMoveSpeed: チャージ中ヒト速 [チャージャー/スピナー]
//   fdRollSpeed: 転がし移動速度 [ローラー]

var WEAPON_DATA = {
  // ========== シューター ==========
  "ボールドマーカー": {
    category: "shooter",
    range: 1.6, paintRange: 3.1, spread: 11.66, paintPerShot: 4.7,
    srDamage: 45, srDps: 540, srInk: 0.8, srFireRate: 5, weight: "light",
    fdFireDuration: 10.417, fdInkLock: 15, fdNonShootSpeed: 1.04, fdPostFire: 2, fdPreFireHuman: 2, fdPreFireSquid: 9, fdShootSpeed: 0.8, fdSquidSpeed: 2.02
  },
  "わかばシューター": {
    category: "shooter",
    range: 2.2, paintRange: 3.5, spread: 11.66, paintPerShot: 4.5,
    srDamage: 28, srDps: 336, srInk: 0.43, srFireRate: 5, weight: "light",
    fdFireDuration: 21.25, fdInkLock: 15, fdNonShootSpeed: 1.04, fdPostFire: 2, fdPreFireHuman: 2, fdPreFireSquid: 9, fdShootSpeed: 0.76, fdSquidSpeed: 2.02
  },
  "シャープマーカー": {
    category: "shooter",
    range: 2.4, paintRange: 3.3, spread: 0, paintPerShot: 4.1,
    srDamage: 28, srDps: 336, srInk: 0.8, srFireRate: 5, weight: "light",
    fdFireDuration: 10.417, fdInkLock: 20, fdNonShootSpeed: 1.04, fdPostFire: 3, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.72, fdSquidSpeed: 2.02
  },
  "プロモデラーMG": {
    category: "shooter",
    range: 2.2, paintRange: 3.5, spread: 12.63, paintPerShot: 4.5,
    srDamage: 24, srDps: 360, srInk: 0.5, srFireRate: 4, weight: "light",
    fdFireDuration: 13.333, fdInkLock: 15, fdNonShootSpeed: 1.04, fdPostFire: 2, fdPreFireHuman: 2, fdPreFireSquid: 9, fdShootSpeed: 0.72, fdSquidSpeed: 2.02
  },
  "スプラシューター": {
    category: "shooter",
    range: 2.5, paintRange: 3.4, spread: 4.86, paintPerShot: 4,
    srDamage: 36, srDps: 360, srInk: 0.92, srFireRate: 6, weight: "mid",
    fdFireDuration: 10.8, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.72, fdSquidSpeed: 1.92
  },
  ".52ガロン": {
    category: "shooter",
    range: 2.6, paintRange: 3.5, spread: 6, paintPerShot: 6.7,
    srDamage: 52, srDps: 346.7, srInk: 1.3, srFireRate: 9, weight: "mid",
    fdFireDuration: 10, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 3, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.6, fdSquidSpeed: 1.92
  },
  "N-ZAP85": {
    category: "shooter",
    range: 2.5, paintRange: 3.3, spread: 4.75, paintPerShot: 3.6,
    srDamage: 30, srDps: 360, srInk: 0.8, srFireRate: 5, weight: "light",
    fdFireDuration: 10.417, fdInkLock: 20, fdNonShootSpeed: 1.04, fdPostFire: 3, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.88, fdSquidSpeed: 2.02
  },
  "プライムシューター": {
    category: "shooter",
    range: 3.4, paintRange: 4.2, spread: 2.5, paintPerShot: 4.7,
    srDamage: 45, srDps: 337.5, srInk: 1.6, srFireRate: 8, weight: "mid",
    fdFireDuration: 6.667, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.55, fdSquidSpeed: 1.92
  },
  ".96ガロン": {
    category: "shooter",
    range: 3.5, paintRange: 4.6, spread: 4, paintPerShot: 7.5,
    srDamage: 85, srDps: 425, srInk: 2.3, srFireRate: 12, weight: "mid",
    fdFireDuration: 8.6, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.4, fdSquidSpeed: 1.92
  },
  "ジェットスイーパー": {
    category: "shooter",
    range: 4.5, paintRange: 5.2, spread: 2.5, paintPerShot: 4.5,
    srDamage: 40, srDps: 300, srInk: 1.6, srFireRate: 8, weight: "mid",
    fdFireDuration: 8.333, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.6, fdSquidSpeed: 1.92
  },
  "スペースシューター": {
    category: "shooter",
    range: 3.1, paintRange: 4, spread: 4.5, paintPerShot: 5,
    srDamage: 30, srDps: 300, srInk: 0.8, srFireRate: 6, weight: "mid",
    fdFireDuration: 10.4, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 3, fdPreFireHuman: 2, fdPreFireSquid: 10, fdShootSpeed: 0.79, fdSquidSpeed: 1.92
  },
  "L3リールガン": {
    category: "shooter",
    range: 3.1, paintRange: 4, spread: 1, paintPerShot: 12,
    srDamage: 40, srDps: 400, srInk: 3.0, srFireRate: 18, weight: "mid",
    fdFireDuration: 8.533, fdInkLock: 25, fdNonShootSpeed: 0.96, fdShootSpeed: 0.8, fdSquidSpeed: 1.92
  },
  "H3リールガン": {
    category: "shooter",
    range: 3.4, paintRange: 4.5, spread: 1, paintPerShot: 22,
    srDamage: 70, srDps: 393.8, srInk: 5.4, srFireRate: 32, weight: "mid",
    fdFireDuration: 7.633, fdInkLock: 25, fdNonShootSpeed: 0.96, fdShootSpeed: 0.6, fdSquidSpeed: 1.92
  },
  "ボトルガイザー": {
    category: "shooter",
    range: 3.8, paintRange: 4.5, spread: 0, paintPerShot: 4.5,
    srDamage: 50, srDps: 375, srInk: 0.9, srFireRate: 7, weight: "mid",
    fdFireDuration: 5.467, fdInkLock: 20, fdNonShootSpeed: 0.96, fdShootSpeed: 0.66, fdSquidSpeed: 1.92
  },

  // ========== マニューバー ==========
  "スパッタリー": {
    category: "maneuver",
    range: 1.9, paintRange: 2.9, spread: 6.8, paintPerShot: 4,
    srDamage: 40, srDps: 480, srInk: 0.663, srFireRate: 4, weight: "light",
    fdFireDuration: 12.5, fdInkLock: 20, fdNonShootSpeed: 1.04, fdPostFire: 4, fdShootSpeed: 0.84, fdSlideToAttack: 16, fdSlideToMove: 40, fdSquidSpeed: 2.02
  },
  "スプラマニューバー": {
    category: "maneuver",
    range: 2.6, paintRange: 3.3, spread: 2, paintPerShot: 3,
    srDamage: 30, srDps: 360, srInk: 0.72, srFireRate: 4, weight: "mid",
    fdFireDuration: 11.5, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdShootSpeed: 0.8, fdSlideToAttack: 20, fdSlideToMove: 48, fdSquidSpeed: 1.92
  },
  "クアッドホッパーブラック": {
    category: "maneuver",
    range: 2.7, paintRange: 3.8, spread: 7.4, paintPerShot: 3.3,
    srDamage: 30, srDps: 300, srInk: 0.8, srFireRate: 5, weight: "mid",
    fdFireDuration: 12.5, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdShootSpeed: 0.72, fdSlideToMove: 66, fdSquidSpeed: 1.92
  },
  "デュアルスイーパー": {
    category: "maneuver",
    range: 3.4, paintRange: 4.2, spread: 4, paintPerShot: 4.2,
    srDamage: 30, srDps: 300, srInk: 0.8, srFireRate: 6, weight: "mid",
    fdFireDuration: 8.3, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdShootSpeed: 0.72, fdSlideToAttack: 24, fdSlideToMove: 48, fdSquidSpeed: 1.92
  },
  "ケルビン525": {
    category: "maneuver",
    range: 3.3, paintRange: 3.9, spread: 3.2, paintPerShot: 5.2,
    srDamage: 45, srDps: 300, srInk: 1.4, srFireRate: 9, weight: "mid",
    fdFireDuration: 10.65, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdShootSpeed: 0.6, fdSlideToAttack: 28, fdSlideToMove: 60, fdSquidSpeed: 1.92
  },
  "ガエンFF": {
    category: "maneuver",
    range: 4.1, paintRange: 5, spread: 2.5, paintPerShot: 4.6,
    srDamage: 40, srDps: 300, srInk: 1.2, srFireRate: 4, weight: "mid",
    fdFireDuration: 11.067, fdInkLock: 20, fdNonShootSpeed: 0.96, fdPostFire: 4, fdShootSpeed: 0.7, fdSlideToAttack: 26, fdSlideToMove: 62, fdSquidSpeed: 1.92
  },

  // ========== スピナー ==========
  "スプラスピナー": {
    category: "spinner",
    range: 3, paintRange: 4, spread: 4, paintPerShot: 2.5,
    srDamage: 35, srDps: 525, srInk: 15, srFireRate: 4, weight: "mid",
    chargeFrame: 27,
    fdChargeMoveSpeed: 0.72, fdFireDuration: 85, fdInkLock: 30, fdNonShootSpeed: 0.96, fdShootSpeed: 0.86, fdSquidSpeed: 1.92
  },
  "バレルスピナー": {
    category: "spinner",
    range: 4.1, paintRange: 5.1, spread: 3.3, paintPerShot: 1.8,
    srDamage: 35, srDps: 525, srInk: 22.5, srFireRate: 4, weight: "mid",
    chargeFrame: 72,
    fdChargeMoveSpeed: 0.62, fdFireDuration: 161, fdInkLock: 40, fdNonShootSpeed: 0.96, fdShootSpeed: 0.7, fdSquidSpeed: 1.92
  },
  "ハイドラント": {
    category: "spinner",
    range: 4.8, paintRange: 6, spread: 3, paintPerShot: 1.4,
    srDamage: 60, srDps: 900, srInk: 35, srFireRate: 4, weight: "heavy",
    chargeFrame: 150,
    fdChargeMoveSpeed: 0.44, fdFireDuration: 261, fdInkLock: 40, fdNonShootSpeed: 0.88, fdShootSpeed: 0.6, fdSquidSpeed: 1.728
  },
  "クーゲルシュライバー": {
    category: "spinner",
    range: 4.6, paintRange: 5.4, spread: 1.5, paintPerShot: 4.5,
    srDamage: 35, srDps: 700, srInk: 22.5, srFireRate: 3, weight: "mid",
    chargeFrame: 100,
    fdChargeMoveSpeed: 0.86, fdFireDuration: 201, fdInkLock: 40, fdNonShootSpeed: 0.96, fdShootSpeed: 0.86, fdSquidSpeed: 1.92
  },
  "ノーチラス47": {
    category: "spinner",
    range: 3.5, paintRange: 4.2, spread: 3.3, paintPerShot: 1.9,
    srDamage: 35, srDps: 525, srInk: 14, srFireRate: 4, weight: "mid",
    chargeFrame: 76,
    fdChargeMoveSpeed: 0.4, fdFireDuration: 121, fdInkLock: 40, fdNonShootSpeed: 0.96, fdPreFireSquid: 16, fdShootSpeed: 0.7, fdSquidSpeed: 1.92
  },
  "イグザミナー": {
    category: "spinner",
    range: 3.2, paintRange: 4.4, spread: 3, paintPerShot: 3.7,
    srDamage: 35, srDps: 700, srInk: 20, srFireRate: 3, weight: "mid",
    chargeFrame: 120,
    fdChargeMoveSpeed: 0.72, fdFireDuration: 181, fdInkLock: 40, fdNonShootSpeed: 0.96, fdShootSpeed: 0.86, fdSquidSpeed: 1.92
  },

  // ========== ブラスター ==========
  "ノヴァブラスター": {
    category: "blaster",
    range: 2.2, paintRange: 2.1, spread: 0, paintPerShot: 14,
    srDamage: 200, srDps: 300, srInk: 4, srFireRate: 40, weight: "mid",
    fdFireDuration: 8.667, fdInkLock: 55, fdNonShootSpeed: 1.04, fdPostFire: 26, fdPreFireHuman: 12, fdPreFireSquid: 22, fdShootSpeed: 0.5, fdSquidSpeed: 2.02
  },
  "ホットブラスター": {
    category: "blaster",
    range: 2.7, paintRange: 2.6, spread: 0, paintPerShot: 16.2,
    srDamage: 200, srDps: 240, srInk: 4.8, srFireRate: 50, weight: "mid",
    fdFireDuration: 8.333, fdInkLock: 57, fdNonShootSpeed: 0.96, fdPostFire: 21, fdPreFireHuman: 12, fdPreFireSquid: 22, fdShootSpeed: 0.45, fdSquidSpeed: 1.92
  },
  "ロングブラスター": {
    category: "blaster",
    range: 3.5, paintRange: 3, spread: 0, paintPerShot: 14.2,
    srDamage: 250, srDps: 250, srInk: 5, srFireRate: 60, weight: "mid",
    fdFireDuration: 9, fdInkLock: 70, fdNonShootSpeed: 0.96, fdPostFire: 30, fdPreFireHuman: 12, fdPreFireSquid: 22, fdShootSpeed: 0.4, fdSquidSpeed: 1.92
  },
  "ラピッドブラスター": {
    category: "blaster",
    range: 3.7, paintRange: 3.5, spread: 0, paintPerShot: 14.4,
    srDamage: 140, srDps: 240, srInk: 4.5, srFireRate: 35, weight: "mid",
    fdFireDuration: 8.167, fdInkLock: 47, fdNonShootSpeed: 0.96, fdPostFire: 20, fdPreFireHuman: 10, fdPreFireSquid: 18, fdShootSpeed: 0.55, fdSquidSpeed: 1.92
  },
  "Rブラスターエリート": {
    category: "blaster",
    range: 4.2, paintRange: 4, spread: 0, paintPerShot: 13.5,
    srDamage: 150, srDps: 225, srInk: 5, srFireRate: 40, weight: "mid",
    fdFireDuration: 6.666, fdInkLock: 50, fdNonShootSpeed: 0.96, fdPostFire: 20, fdPreFireHuman: 10, fdPreFireSquid: 19, fdShootSpeed: 0.5, fdSquidSpeed: 1.92
  },
  "クラッシュブラスター": {
    category: "blaster",
    range: 2.7, paintRange: 2.2, spread: 0, paintPerShot: 8.6,
    srDamage: 85, srDps: 255, srInk: 3.2, srFireRate: 20, weight: "mid",
    fdFireDuration: 8.333, fdInkLock: 40, fdNonShootSpeed: 1.04, fdPostFire: 20, fdPreFireHuman: 10, fdPreFireSquid: 18, fdShootSpeed: 0.68, fdSquidSpeed: 2.02
  },
  "S-BLAST92": {
    category: "blaster",
    range: 3.4, paintRange: 2.7, spread: 0, paintPerShot: 12.6,
    srDamage: 300, srDps: 327.3, srInk: 4.8, srFireRate: 55, weight: "mid",
    fdFireDuration: 10.083, fdInkLock: 60, fdNonShootSpeed: 0.96, fdPostFire: 26, fdPreFireHuman: 12, fdPreFireSquid: 22, fdShootSpeed: 0.4, fdSquidSpeed: 1.92
  },

  // ========== ローラー ==========
  "カーボンローラー": {
    category: "roller",
    range: 2.7, paintRange: 2, spread: null, paintPerShot: 12,
    srDamage: 160, srDps: 309.7, srInk: 3.5, srFireRate: 31, weight: "light",
    rollDamage: 70,
    fdFireDuration: 12.917, fdInkLock: 40, fdNonShootSpeed: 1.04, fdPostFire: 8, fdPreFireHuman: 10, fdPreFireSquid: 23, fdShootSpeed: 0.48, fdSquidSpeed: 2.016, fdSwingPost: 8, fdSwingPreHuman: 10, fdSwingPreSquid: 23
  },
  "スプラローラー": {
    category: "roller",
    range: 3.2, paintRange: 3, spread: null, paintPerShot: 20.4,
    srDamage: 200, srDps: 285.7, srInk: 6, srFireRate: 42, weight: "mid",
    rollDamage: 125,
    fdFireDuration: 7.7, fdInkLock: 43, fdNonShootSpeed: 0.96, fdPostFire: 10, fdPreFireHuman: 21, fdPreFireSquid: 34, fdShootSpeed: 0.48, fdSquidSpeed: 1.92, fdSwingPost: 10, fdSwingPreHuman: 21, fdSwingPreSquid: 34
  },
  "ヴァリアブルローラー": {
    category: "roller",
    range: 4.1, paintRange: 2.6, spread: null, paintPerShot: 11.8,
    srDamage: 200, srDps: 300, srInk: 6, srFireRate: 40, weight: "mid",
    rollDamage: 125, vertRange: 2.9, vertPaintRange: 5.2,
    fdFireDuration: 8, fdInkLock: 45, fdNonShootSpeed: 0.96, fdPostFire: 10, fdPreFireHuman: 19, fdPreFireSquid: 32, fdShootSpeed: 0.72, fdSquidSpeed: 1.92, fdSwingPost: 10, fdSwingPreHuman: 19, fdSwingPreSquid: 32
  },
  "ダイナモローラー": {
    category: "roller",
    range: 4.8, paintRange: 4.2, spread: null, paintPerShot: 45,
    srDamage: 200, srDps: 181.8, srInk: 15, srFireRate: 66, weight: "heavy",
    rollDamage: 400, vertRange: 4, vertPaintRange: 5.5,
    fdFireDuration: 5.5, fdInkLock: 55, fdNonShootSpeed: 0.88, fdPostFire: 10, fdPreFireHuman: 45, fdPreFireSquid: 58, fdShootSpeed: 0.24, fdSquidSpeed: 1.728, fdSwingPost: 10, fdSwingPreHuman: 45, fdSwingPreSquid: 58
  },
  "ワイドローラー": {
    category: "roller",
    range: 3.7, paintRange: 2.9, spread: null, paintPerShot: 34,
    srDamage: 150, srDps: 230.8, srInk: 8, srFireRate: 39, weight: "mid",
    rollDamage: 100, vertRange: 3, vertPaintRange: 5,
    fdFireDuration: 6.5, fdInkLock: 45, fdNonShootSpeed: 0.96, fdPostFire: 12, fdPreFireHuman: 18, fdPreFireSquid: 31, fdShootSpeed: 0.72, fdSquidSpeed: 1.92, fdSwingPost: 12, fdSwingPreHuman: 18, fdSwingPreSquid: 31
  },

  // ========== フデ ==========
  "パブロ": {
    category: "brush",
    range: 1.4, paintRange: 2.3, spread: 18, paintPerShot: 10.3,
    srDamage: 40, srDps: 308.6, srInk: 1.5, srFireRate: 7, weight: "light",
    runSpeed: 1.98,
    fdFireDuration: 5.817, fdInkLock: 30, fdNonShootSpeed: 1.04, fdPostFire: 10, fdPreFireHuman: 3, fdPreFireSquid: 12, fdRollSpeed: 1.98, fdShootSpeed: 0.5, fdSquidSpeed: 2.02
  },
  "ホクサイ": {
    category: "brush",
    range: 1.8, paintRange: 2.6, spread: 24, paintPerShot: 7.5,
    srDamage: 40, srDps: 327.3, srInk: 3.0, srFireRate: 11, weight: "mid",
    runSpeed: 1.68,
    fdFireDuration: 6.033, fdInkLock: 30, fdNonShootSpeed: 0.96, fdPostFire: 10, fdPreFireHuman: 3, fdPreFireSquid: 12, fdRollSpeed: 1.68, fdShootSpeed: 0.3, fdSquidSpeed: 1.92
  },
  "フィンセント": {
    category: "brush",
    range: 2.5, paintRange: 3.1, spread: 12, paintPerShot: 16,
    srDamage: 50, srDps: 642.9, srInk: 4.5, srFireRate: 14, weight: "mid",
    runSpeed: 1.8,
    fdFireDuration: 4.65, fdInkLock: 50, fdNonShootSpeed: 0.96, fdPostFire: 11, fdPreFireHuman: 25, fdPreFireSquid: 34, fdRollSpeed: 1.8, fdShootSpeed: 0.24, fdSquidSpeed: 1.92
  },

  // ========== チャージャー ==========
  "スクイックリンα": {
    category: "charger",
    range: 3.8, paintRange: 4.2, spread: null, paintPerShot: 8.2,
    srDamage: 300, srDps: 352.9, srInk: 1.493, srFireRate: 14, weight: "mid",
    chargeFrame: 51,
    fdChargeMoveSpeed: 0.96, fdFireDuration: 7.65, fdInkLock: 0, fdNonShootSpeed: 0.96, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 1.92
  },
  "スプラチャージャー": {
    category: "charger",
    range: 5.2, paintRange: 5.7, spread: null, paintPerShot: 6.8,
    srDamage: 300, srDps: 272.7, srInk: 2.25, srFireRate: 14, weight: "mid",
    chargeFrame: 66,
    fdChargeMoveSpeed: 0.2, fdFireDuration: 5.5, fdInkLock: 0, fdNonShootSpeed: 0.96, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 1.92
  },
  "リッター4K": {
    category: "charger",
    range: 6.2, paintRange: 6.7, spread: null, paintPerShot: 6.6,
    srDamage: 600, srDps: 367.3, srInk: 2.25, srFireRate: 14, weight: "heavy",
    chargeFrame: 98,
    fdChargeMoveSpeed: 0.15, fdFireDuration: 6.533, fdInkLock: 0, fdNonShootSpeed: 0.88, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 1.74
  },
  "ソイチューバー": {
    category: "charger",
    range: 4.3, paintRange: 4.7, spread: null, paintPerShot: 9.6,
    srDamage: 300, srDps: 342.9, srInk: 1.2, srFireRate: 14, weight: "mid",
    chargeFrame: 77,
    fdChargeMoveSpeed: 0.96, fdFireDuration: 7.7, fdInkLock: 0, fdNonShootSpeed: 0.96, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 1.92
  },
  "14式竹筒銃・甲": {
    category: "charger",
    range: 4.3, paintRange: 5, spread: null, paintPerShot: 15,
    srDamage: 160, srDps: 369.2, srInk: 4.0, srFireRate: 39, weight: "mid",
    chargeFrame: 26,
    fdChargeMoveSpeed: 0.6, fdFireDuration: 6.067, fdInkLock: 0, fdNonShootSpeed: 1.04, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 2.02
  },
  "R-PEN/5H": {
    category: "charger",
    range: 5.7, paintRange: 6.3, spread: null, paintPerShot: 6.6,
    srDamage: 240, srDps: 493.1, srInk: 1.97, srFireRate: 14, weight: "mid",
    chargeFrame: 72,
    fdChargeMoveSpeed: 0.68, fdFireDuration: 4.867, fdInkLock: 0, fdNonShootSpeed: 0.96, fdPreFireHuman: 1, fdPreFireSquid: 6, fdSquidSpeed: 1.92
  },

  // ========== スロッシャー ==========
  "ヒッセン": {
    category: "slosher",
    range: 2.4, paintRange: 2.6, spread: null, paintPerShot: 13.7,
    srDamage: 100, srDps: 260.8, srInk: 4.5, srFireRate: 23, weight: "mid",
    fdFireDuration: 6.133, fdInkLock: 35, fdNonShootSpeed: 1.04, fdPreFireHuman: 12, fdShootSpeed: 0.66, fdSquidSpeed: 2.02
  },
  "バケットスロッシャー": {
    category: "slosher",
    range: 3.1, paintRange: 3.4, spread: null, paintPerShot: 14.3,
    srDamage: 140, srDps: 289.7, srInk: 5.5, srFireRate: 29, weight: "mid",
    fdFireDuration: 6.283, fdInkLock: 40, fdNonShootSpeed: 0.96, fdPreFireHuman: 12, fdShootSpeed: 0.4, fdSquidSpeed: 1.92
  },
  "スクリュースロッシャー": {
    category: "slosher",
    range: 3, paintRange: 3.5, spread: null, paintPerShot: 14.7,
    srDamage: 170, srDps: 268.4, srInk: 5.5, srFireRate: 38, weight: "mid",
    fdFireDuration: 6.333, fdInkLock: 42, fdNonShootSpeed: 0.96, fdPreFireHuman: 12, fdShootSpeed: 0.7, fdSquidSpeed: 1.92
  },
  "オーバーフロッシャー": {
    category: "slosher",
    range: 4.5, paintRange: 5.4, spread: null, paintPerShot: 16.6,
    srDamage: 60, srDps: 450, srInk: 6, srFireRate: 32, weight: "mid",
    fdFireDuration: 6.4, fdInkLock: 40, fdNonShootSpeed: 0.96, fdShootSpeed: 0.5, fdSquidSpeed: 1.92
  },
  "エクスプロッシャー": {
    category: "slosher",
    range: 4.1, paintRange: 4.7, spread: null, paintPerShot: 21.8,
    srDamage: 125, srDps: 218.2, srInk: 9, srFireRate: 55, weight: "heavy",
    fdFireDuration: 7.333, fdInkLock: 70, fdNonShootSpeed: 0.88, fdPreFireHuman: 16, fdShootSpeed: 0.45, fdSquidSpeed: 1.74
  },
  "モップリン": {
    category: "slosher",
    range: 3.2, paintRange: 3.7, spread: null, paintPerShot: 28.0,
    srDamage: 125, srDps: 333.3, srInk: 8, srFireRate: 45, weight: "mid",
    fdFireDuration: 7.667, fdInkLock: 50, fdNonShootSpeed: 0.96, fdShootSpeed: 0.4, fdSquidSpeed: 1.92
  },

  // ========== シェルター ==========
  "パラシェルター": {
    category: "shelter",
    range: 2.5, paintRange: 3.5, spread: 7.2, paintPerShot: 17.2,
    srDamage: 36, srDps: 372.4, srInk: 2.5, srFireRate: 29, weight: "mid",
    pellets: 11,
    fdFireDuration: 9.666, fdInkLock: 60, fdNonShootSpeed: 0.96, fdPostFire: 20, fdPreFireHuman: 10, fdPreFireSquid: 22, fdShootSpeed: 0.65, fdSquidSpeed: 1.92
  },
  "キャンピングシェルター": {
    category: "shelter",
    range: 3.1, paintRange: 4, spread: 7, paintPerShot: 17.5,
    srDamage: 45, srDps: 423.5, srInk: 5, srFireRate: 51, weight: "heavy",
    pellets: 13,
    fdFireDuration: 7.65, fdInkLock: 70, fdNonShootSpeed: 0.88, fdPostFire: 40, fdPreFireHuman: 12, fdPreFireSquid: 27, fdShootSpeed: 0.5, fdSquidSpeed: 1.74
  },
  "スパイガジェット": {
    category: "shelter",
    range: 2.7, paintRange: 3.3, spread: 4, paintPerShot: 12.5,
    srDamage: 30, srDps: 346.2, srInk: 3, srFireRate: 26, weight: "mid",
    pellets: 7,
    fdFireDuration: 10.833, fdInkLock: 40, fdNonShootSpeed: 1.04, fdPostFire: 20, fdPreFireHuman: 10, fdPreFireSquid: 22, fdShootSpeed: 0.72, fdSquidSpeed: 2.02
  },
  "24式張替傘・甲": {
    category: "shelter",
    range: 3, paintRange: 3.5, spread: 3, paintPerShot: 14.8,
    srDamage: 35, srDps: 370.6, srInk: 4, srFireRate: 34, weight: "mid",
    pellets: 11,
    fdFireDuration: 9.067, fdInkLock: 50, fdNonShootSpeed: 0.96, fdPostFire: 25, fdPreFireHuman: 10, fdPreFireSquid: 22, fdShootSpeed: 0.58, fdSquidSpeed: 1.92
  },

  // ========== ストリンガー ==========
  "トライストリンガー": {
    category: "stringer",
    range: 5.2, paintRange: 6.1, spread: 8, paintPerShot: 19,
    srDamage: 150, srDps: 400, srInk: 3.0, srFireRate: 21, weight: "mid",
    chargeFrame: 87, arrows: 3,
    fdChargeMoveSpeed: 0.68, fdFireDuration: 7, fdInkLock: 0, fdNonShootSpeed: 0.96, fdPostFire: 10, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.96, fdSquidSpeed: 1.92
  },
  "LACT-450": {
    category: "stringer",
    range: 3.5, paintRange: 4.2, spread: 10.5, paintPerShot: 14.4,
    srDamage: 70, srDps: 411.4, srInk: 1.8, srFireRate: 14, weight: "mid",
    chargeFrame: 49, arrows: 3,
    fdChargeMoveSpeed: 0.84, fdFireDuration: 6.533, fdInkLock: 0, fdNonShootSpeed: 1.04, fdPostFire: 10, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.96, fdSquidSpeed: 2.016
  },
  "フルイドV": {
    category: "stringer",
    range: 4.7, paintRange: 5.7, spread: 12, paintPerShot: 17.3,
    srDamage: 120, srDps: 378.9, srInk: 4.0, srFireRate: 24, weight: "heavy",
    chargeFrame: 95, arrows: 5,
    fdChargeMoveSpeed: 0.4, fdFireDuration: 5.6, fdInkLock: 0, fdNonShootSpeed: 0.88, fdPostFire: 10, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.88, fdSquidSpeed: 1.73
  },

  // ========== ワイパー ==========
  "ドライブワイパー": {
    category: "wiper",
    range: 3.7, paintRange: 3.2, spread: null, paintPerShot: 9.72,
    srDamage: 35, srDps: 318.8, srInk: 2, srFireRate: 16, weight: "light",
    chargedRange: 3.7, chargedDamage: 175,
    fdFireDuration: 8.8, fdInkLock: 30, fdNonShootSpeed: 1.04, fdPostFire: 15, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.945, fdSquidSpeed: 2.016, fdSwingPost: 15
  },
  "ジムワイパー": {
    category: "wiper",
    range: 4.5, paintRange: 4, spread: null, paintPerShot: 13.65,
    srDamage: 45, srDps: 334.6, srInk: 2.5, srFireRate: 26, weight: "mid",
    chargedRange: 4.5, chargedDamage: 220,
    fdFireDuration: 10.4, fdInkLock: 40, fdNonShootSpeed: 0.96, fdPostFire: 26, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.6, fdSquidSpeed: 1.92, fdSwingPost: 26
  },
  "デンタルワイパーミント": {
    category: "wiper",
    range: 3.2, paintRange: 3.4, spread: null, paintPerShot: 16.3,
    srDamage: 60, srDps: 360, srInk: 2.5, srFireRate: 30, weight: "mid",
    chargedRange: 3.3, chargedDamage: 250,
    fdFireDuration: 7.5, fdInkLock: 50, fdNonShootSpeed: 0.96, fdPostFire: 27, fdPreFireHuman: 1, fdPreFireSquid: 6, fdShootSpeed: 0.55, fdSquidSpeed: 1.92, fdSwingPost: 27
  },

};

// ブキ評価スコア（0-100）
// mobility: 基礎移動(20%) + 射撃中移動(25%) + 行動自由度(35%) + 塗り道(20%)
// paint: 塗り速度(40%) + インク効率(30%) + 塗り射程(30%)
// スコアは scripts/fetch_frame_data.js で自動計算
var WEAPON_RATINGS = {
  "ボールドマーカー":                { mobility: 77, paint: 92, range: 4, effectiveRange: 3, handling: 100, clearing: 91 },
  "ドライブワイパー":                { mobility: 70, paint: 78, range: 48, effectiveRange: 45, handling: 75, clearing: 83 },
  "N-ZAP85":                 { mobility: 69, paint: 86, range: 23, effectiveRange: 22, handling: 100, clearing: 59 },
  "わかばシューター":                { mobility: 68, paint: 95, range: 17, effectiveRange: 16, handling: 90, clearing: 58 },
  "プロモデラーMG":                { mobility: 68, paint: 90, range: 17, effectiveRange: 16, handling: 75, clearing: 56 },
  "スパッタリー":                  { mobility: 68, paint: 79, range: 10, effectiveRange: 9, handling: 90, clearing: 85 },
  "シャープマーカー":                { mobility: 64, paint: 79, range: 21, effectiveRange: 20, handling: 100, clearing: 55 },
  "スペースシューター":               { mobility: 59, paint: 82, range: 35, effectiveRange: 33, handling: 75, clearing: 48 },
  "LACT-450":                { mobility: 58, paint: 96, range: 44, effectiveRange: 41, handling: 90, clearing: 65 },
  "スプラシューター":                { mobility: 56, paint: 77, range: 23, effectiveRange: 22, handling: 100, clearing: 57 },
  "デュアルスイーパー":               { mobility: 56, paint: 71, range: 42, effectiveRange: 40, handling: 75, clearing: 47 },
  "スプラマニューバー":               { mobility: 55, paint: 66, range: 25, effectiveRange: 24, handling: 90, clearing: 66 },
  "パブロ":                     { mobility: 71, paint: 61, range: 0, effectiveRange: 0, handling: 35, clearing: 39 },
  "ヒッセン":                    { mobility: 54, paint: 59, range: 21, effectiveRange: 16, handling: 50, clearing: 72 },
  "ボトルガイザー":                 { mobility: 53, paint: 74, range: 50, effectiveRange: 47, handling: 50, clearing: 46 },
  ".52ガロン":                  { mobility: 52, paint: 74, range: 25, effectiveRange: 24, handling: 100, clearing: 58 },
  "スプラスピナー":                 { mobility: 52, paint: 66, range: 33, effectiveRange: 31, handling: 90, clearing: 66 },
  "ジェットスイーパー":               { mobility: 51, paint: 63, range: 65, effectiveRange: 62, handling: 75, clearing: 51 },
  "プライムシューター":               { mobility: 50, paint: 63, range: 42, effectiveRange: 40, handling: 75, clearing: 52 },
  "カーボンローラー":                { mobility: 50, paint: 56, range: 27, effectiveRange: 26, handling: 50, clearing: 69 },
  "L3リールガン":                 { mobility: 49, paint: 60, range: 35, effectiveRange: 33, handling: 75, clearing: 57 },
  "クラッシュブラスター":              { mobility: 49, paint: 51, range: 27, effectiveRange: 25, handling: 50, clearing: 60 },
  "スパイガジェット":                { mobility: 49, paint: 68, range: 27, effectiveRange: 25, handling: 55, clearing: 53 },
  "ジムワイパー":                  { mobility: 49, paint: 58, range: 65, effectiveRange: 61, handling: 90, clearing: 93 },
  "クアッドホッパーブラック":            { mobility: 48, paint: 56, range: 27, effectiveRange: 25, handling: 50, clearing: 49 },
  "ガエンFF":                   { mobility: 48, paint: 51, range: 56, effectiveRange: 53, handling: 55, clearing: 68 },
  "ヴァリアブルローラー":              { mobility: 46, paint: 56, range: 56, effectiveRange: 54, handling: 35, clearing: 65 },
  "ワイドローラー":                 { mobility: 46, paint: 61, range: 48, effectiveRange: 46, handling: 35, clearing: 59 },
  "ホクサイ":                    { mobility: 57, paint: 43, range: 8, effectiveRange: 7, handling: 50, clearing: 67 },
  "デンタルワイパーミント":             { mobility: 46, paint: 62, range: 38, effectiveRange: 36, handling: 90, clearing: 100 },
  ".96ガロン":                  { mobility: 45, paint: 51, range: 44, effectiveRange: 42, handling: 75, clearing: 55 },
  "ケルビン525":                 { mobility: 45, paint: 52, range: 40, effectiveRange: 38, handling: 35, clearing: 43 },
  "スクイックリンα":                { mobility: 45, paint: 65, range: 50, effectiveRange: 47, handling: 100, clearing: 75 },
  "H3リールガン":                 { mobility: 35, paint: 40, range: 42, effectiveRange: 40, handling: 35, clearing: 38 },
  "スクリュースロッシャー":             { mobility: 44, paint: 55, range: 33, effectiveRange: 25, handling: 55, clearing: 46 },
  "ソイチューバー":                 { mobility: 41, paint: 63, range: 60, effectiveRange: 57, handling: 50, clearing: 57 },
  "オーバーフロッシャー":              { mobility: 41, paint: 52, range: 65, effectiveRange: 47, handling: 50, clearing: 67 },
  "クーゲルシュライバー":              { mobility: 50, paint: 59, range: 67, effectiveRange: 64, handling: 50, clearing: 70 },
  "ノーチラス47":                 { mobility: 40, paint: 53, range: 44, effectiveRange: 42, handling: 50, clearing: 49 },
  "14式竹筒銃・甲":                { mobility: 40, paint: 44, range: 60, effectiveRange: 57, handling: 35, clearing: 30 },
  "ノヴァブラスター":                { mobility: 39, paint: 57, range: 17, effectiveRange: 16, handling: 100, clearing: 94 },
  "スプラローラー":                 { mobility: 39, paint: 53, range: 38, effectiveRange: 36, handling: 35, clearing: 67 },
  "トライストリンガー":               { mobility: 38, paint: 69, range: 79, effectiveRange: 75, handling: 50, clearing: 57 },
  "バレルスピナー":                 { mobility: 38, paint: 51, range: 56, effectiveRange: 53, handling: 50, clearing: 59 },
  "バケットスロッシャー":              { mobility: 38, paint: 56, range: 35, effectiveRange: 26, handling: 75, clearing: 71 },
  "パラシェルター":                 { mobility: 38, paint: 62, range: 23, effectiveRange: 22, handling: 80, clearing: 64 },
  "イグザミナー":                  { mobility: 37, paint: 69, range: 38, effectiveRange: 36, handling: 50, clearing: 69 },
  "24式張替傘・甲":                { mobility: 37, paint: 58, range: 33, effectiveRange: 31, handling: 70, clearing: 66 },
  "ラピッドブラスター":               { mobility: 36, paint: 51, range: 48, effectiveRange: 45, handling: 50, clearing: 57 },
  "フィンセント":                  { mobility: 42, paint: 41, range: 23, effectiveRange: 22, handling: 35, clearing: 86 },
  "モップリン":                   { mobility: 36, paint: 46, range: 38, effectiveRange: 28, handling: 70, clearing: 91 },
  "Rブラスターエリート":              { mobility: 33, paint: 43, range: 58, effectiveRange: 55, handling: 35, clearing: 53 },
  "スプラチャージャー":               { mobility: 32, paint: 54, range: 79, effectiveRange: 75, handling: 50, clearing: 30 },
  "ホットブラスター":                { mobility: 30, paint: 54, range: 27, effectiveRange: 25, handling: 50, clearing: 69 },
  "フルイドV":                   { mobility: 25, paint: 61, range: 69, effectiveRange: 65, handling: 90, clearing: 80 },
  "S-BLAST92":               { mobility: 27, paint: 42, range: 42, effectiveRange: 40, handling: 75, clearing: 90 },
  "ロングブラスター":                { mobility: 25, paint: 40, range: 44, effectiveRange: 42, handling: 35, clearing: 77 },
  "R-PEN/5H":                { mobility: 33, paint: 53, range: 90, effectiveRange: 86, handling: 50, clearing: 35 },
  "エクスプロッシャー":               { mobility: 19, paint: 26, range: 56, effectiveRange: 41, handling: 20, clearing: 25 },
  "リッター4K":                  { mobility: 17, paint: 41, range: 100, effectiveRange: 95, handling: 35, clearing: 24 },
  "キャンピングシェルター":             { mobility: 17, paint: 45, range: 35, effectiveRange: 33, handling: 20, clearing: 65 },
  "ハイドラント":                  { mobility: 16, paint: 28, range: 71, effectiveRange: 67, handling: 20, clearing: 62 },
  "ダイナモローラー":                { mobility: 16, paint: 35, range: 71, effectiveRange: 68, handling: 20, clearing: 97 },
};

// 対オオモノ相性（1=×苦手, 2=△やや苦手, 3=〇普通, 4=◎得意, 5=★特殊技能）
// steelhead=バクダン, flyfish=カタパッド, scrapper=テッパン, steeleel=ヘビ,
// stinger=タワー, maws=モグラ, drizzler=コウモリ, fishstick=ハシラ,
// flipper=ダイバー, bigshot=テッキュウ, slamminlid=ナベブタ
// モグラ(maws)評価ロジック:
//   ベース = clamp(round(4 - fdInkLock/25), 1, 4) … インクロック短い=ボム回転◎、長い=×
//   0ターンキル(地形貫通で顔出し前に1200dmg): +3 → ★(5)  ※クマサン印のワイパーのみ
//   特殊★: クマサン印のストリンガー（フルチャージ一撃）, クマサン印のローラー（轢き一瞬）
//     → 他の1Tキルとはレベルが違い特殊技能扱い
//   1ターンキル(顔出し中に1200dmg): +2, cap 4
//   2ターンキル(2回の顔出しで1200dmg): +1, cap 4
//
// カタパッド(flyfish)評価ロジック:
//   ベース = clamp(round(4 - fdInkLock/25), 1, 4) … モグラと同一の基底スコア
//   チャージャー: effectiveInkLock = max(fdInkLock, chargeFrame × 0.5)
//   ストリンガー: effectiveInkLock = max(fdInkLock, chargeFrame × 0.25)（一律）
//   特殊: エクスプロッシャー→★(5), クマサン印のスロッシャー→★(5), クマサン印のワイパー→★(5)
//         （コンテナに弾を直接入れられるブキ）
//   特殊: クマサン印のマニューバー → base+1（スライド爆風でコンテナ破壊可能）
//   重量級ペナルティ: weight="heavy" → -1（★特殊技能は据え置き）
//   クマサン印ペナルティ: ワイパー/ストリンガーのみ -1（★は除外）
//
// ハシラ(fishstick)評価ロジック:
//   地上スコア(ground)と柱上スコア(pillar)の加重平均で算出
//   fishstick = round((ground×2 + pillar×1) / 3)
//   ground: 地上からハシラ柱に与えるダメージ効率（1〜4）
//   pillar: 柱上に登って倒す効率（1〜4）
//   ハシラ割り★: ラピッドブラスター, Rブラスターエリート, ロングブラスター, ジェットスイーパー → ★(5)
//     （ブラスター3種は爆風で空中破壊、ジェットは長射程で空中破壊可能）
//   +1ボーナス(cap4): ハイドラント, クーゲルシュライバー
//     （実用的にハシラを空中から破壊可能、ただし★にはならない）
//   フデボーナス: パブロ, ホクサイ, フィンセント → 最終スコア+1（柱上での行動が圧倒的に速い）
//   特殊: スクリュースロッシャー → ◎(4)（地上性能が圧倒的で柱に登る必要が皆無）
//   低塗りペナルティ: ground≤2 かつ paint<50 → -1（柱を登りにくいため）
//     チャージャーは免除（塗り形状がハシラ幅と同じで登りやすい）
//     対象: ダイナモローラー(35), フィンセント(41), ホクサイ(43),
//           クマサン印のワイパー(B), クマサン印のローラー(B)
//
// コウモリ(drizzler)評価ロジック:
//   2指標の平均で算出。両指標とも△の場合は×(1)
//   指標1 本体攻撃: DPS × (200/60) の総ダメージ（200F=ダメージ可能時間）
//     ◎(4) ≥ 1500, 〇(3) ≥ 1100, △(2) < 1100
//     ※ローラーはカサが閉じる寸前しか轢きが当たらないため振りDPSを使用
//       (カーボン309.7, スプラ285.7, ヴァリアブル300, ダイナモ181.8, ワイド230.8)
//   指標2 雨弾反射: 実効射程スコアで評価
//     ◎(4) ≥ 50, 〇(3) ≥ 23, △(2) < 23
//     オーバーライド: チャージ/振り/連射の遅さで反射が困難なブキは降格
//   合算: final = round((本体 + 反射) / 2)、両方△なら×(1)
//   ★: クマワイパー, クマスロッシャー, クマチャージャー
var BOSS_MATCHUPS = {
  // ========== シューター ==========
  "ボールドマーカー":    { steelhead: 2, flyfish: 4, scrapper: 4, steeleel: 4, stinger: 3, maws: 4, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 4, slamminlid: 4 },
  "わかばシューター":    { steelhead: 2, flyfish: 3, scrapper: 3, steeleel: 2, stinger: 2, maws: 3, drizzler: 1, fishstick: 2, flipper: 4, bigshot: 2, slamminlid: 2 },
  "シャープマーカー":    { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 2, slamminlid: 3 },
  "プロモデラーMG":    { steelhead: 2, flyfish: 3, scrapper: 3, steeleel: 2, stinger: 2, maws: 3, drizzler: 1, fishstick: 2, flipper: 4, bigshot: 2, slamminlid: 3 },
  "スプラシューター":    { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  ".52ガロン":        { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "N-ZAP85":         { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 4, bigshot: 3, slamminlid: 3 },
  "プライムシューター":   { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 3 },
  ".96ガロン":        { steelhead: 4, flyfish: 2, scrapper: 3, steeleel: 2, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 2, bigshot: 2, slamminlid: 3 },
  "ジェットスイーパー":   { steelhead: 4, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 3, maws: 3, drizzler: 4, fishstick: 5, flipper: 3, bigshot: 2, slamminlid: 4 },
  "スペースシューター":   { steelhead: 2, flyfish: 3, scrapper: 2, steeleel: 2, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 4, bigshot: 2, slamminlid: 2 },
  "L3リールガン":      { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "H3リールガン":      { steelhead: 3, flyfish: 2, scrapper: 3, steeleel: 2, stinger: 3, maws: 2, drizzler: 3, fishstick: 2, flipper: 2, bigshot: 2, slamminlid: 2 },
  "ボトルガイザー":     { steelhead: 4, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 3 },
  // ========== マニューバー ==========
  "スパッタリー":      { steelhead: 2, flyfish: 4, scrapper: 4, steeleel: 4, stinger: 3, maws: 4, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 4, slamminlid: 4 },
  "スプラマニューバー":   { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "クアッドホッパーブラック": { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 2, maws: 3, drizzler: 2, fishstick: 3, flipper: 2, bigshot: 2, slamminlid: 2 },
  "デュアルスイーパー":   { steelhead: 2, flyfish: 3, scrapper: 2, steeleel: 3, stinger: 2, maws: 3, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 2 },
  "ケルビン525":      { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 3, maws: 2, drizzler: 2, fishstick: 4, flipper: 2, bigshot: 2, slamminlid: 2 },
  "ガエンFF":        { steelhead: 3, flyfish: 2, scrapper: 3, steeleel: 3, stinger: 3, maws: 4, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 3, slamminlid: 3 },
  // ========== スピナー（全て2ターンキル、ハイドラントは1ターン） ==========
  "スプラスピナー":     { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 4, fishstick: 4, flipper: 3, bigshot: 3, slamminlid: 3 },
  "バレルスピナー":     { steelhead: 4, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 3, maws: 3, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 3 },
  "ハイドラント":      { steelhead: 4, flyfish: 1, scrapper: 2, steeleel: 2, stinger: 2, maws: 2, drizzler: 2, fishstick: 4, flipper: 4, bigshot: 3, slamminlid: 3 },
  "クーゲルシュライバー":  { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 4, flipper: 4, bigshot: 3, slamminlid: 3 },
  "ノーチラス47":      { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 4, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 2 },
  "イグザミナー":      { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 2, maws: 2, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 2, slamminlid: 2 },
  // ========== ブラスター ==========
  "ノヴァブラスター":    { steelhead: 2, flyfish: 2, scrapper: 3, steeleel: 3, stinger: 4, maws: 3, drizzler: 2, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "ホットブラスター":    { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 3, maws: 2, drizzler: 1, fishstick: 3, flipper: 2, bigshot: 1, slamminlid: 2 },
  "ロングブラスター":    { steelhead: 2, flyfish: 1, scrapper: 2, steeleel: 2, stinger: 3, maws: 1, drizzler: 1, fishstick: 5, flipper: 1, bigshot: 1, slamminlid: 2 },
  "ラピッドブラスター":   { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 4, maws: 2, drizzler: 2, fishstick: 5, flipper: 2, bigshot: 1, slamminlid: 2 },
  "Rブラスターエリート":  { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 4, maws: 2, drizzler: 2, fishstick: 5, flipper: 1, bigshot: 1, slamminlid: 3 },
  "クラッシュブラスター":  { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 3, maws: 3, drizzler: 2, fishstick: 4, flipper: 2, bigshot: 1, slamminlid: 2 },
  "S-BLAST92":       { steelhead: 4, flyfish: 2, scrapper: 4, steeleel: 3, stinger: 4, maws: 3, drizzler: 3, fishstick: 3, flipper: 2, bigshot: 3, slamminlid: 3 },
  // ========== ローラー（全て2ターンキル、ダイナモは1ターン） ==========
  "カーボンローラー":    { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 3, stinger: 2, maws: 3, drizzler: 3, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "スプラローラー":     { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 3, stinger: 1, maws: 2, drizzler: 2, fishstick: 3, flipper: 2, bigshot: 2, slamminlid: 2 },
  "ヴァリアブルローラー":  { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 3, stinger: 1, maws: 2, drizzler: 2, fishstick: 3, flipper: 2, bigshot: 2, slamminlid: 2 },
  "ダイナモローラー":    { steelhead: 3, flyfish: 1, scrapper: 1, steeleel: 2, stinger: 1, maws: 1, drizzler: 1, fishstick: 1, flipper: 2, bigshot: 4, slamminlid: 3 },
  "ワイドローラー":     { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 1, maws: 2, drizzler: 2, fishstick: 3, flipper: 4, bigshot: 2, slamminlid: 2 },
  // ========== フデ ==========
  "パブロ":          { steelhead: 1, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 1, maws: 3, drizzler: 1, fishstick: 3, flipper: 3, bigshot: 1, slamminlid: 2 },
  "ホクサイ":         { steelhead: 2, flyfish: 3, scrapper: 2, steeleel: 3, stinger: 3, maws: 3, drizzler: 2, fishstick: 2, flipper: 3, bigshot: 2, slamminlid: 3 },
  "フィンセント":      { steelhead: 3, flyfish: 2, scrapper: 3, steeleel: 2, stinger: 3, maws: 2, drizzler: 2, fishstick: 2, flipper: 2, bigshot: 3, slamminlid: 2 },
  // ========== チャージャー ==========
  "スクイックリンα":    { steelhead: 4, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 2, maws: 4, drizzler: 4, fishstick: 2, flipper: 3, bigshot: 3, slamminlid: 3 },
  "スプラチャージャー":   { steelhead: 4, flyfish: 2, scrapper: 2, steeleel: 3, stinger: 1, maws: 3, drizzler: 2, fishstick: 2, flipper: 2, bigshot: 2, slamminlid: 3 },
  "リッター4K":       { steelhead: 4, flyfish: 2, scrapper: 2, steeleel: 4, stinger: 1, maws: 2, drizzler: 2, fishstick: 2, flipper: 3, bigshot: 3, slamminlid: 4 },
  "ソイチューバー":     { steelhead: 4, flyfish: 2, scrapper: 3, steeleel: 3, stinger: 3, maws: 2, drizzler: 3, fishstick: 2, flipper: 3, bigshot: 2, slamminlid: 3 },
  "14式竹筒銃・甲":    { steelhead: 4, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 4, maws: 2, drizzler: 2, fishstick: 4, flipper: 2, bigshot: 2, slamminlid: 3 },
  "R-PEN/5H":        { steelhead: 4, flyfish: 2, scrapper: 3, steeleel: 3, stinger: 2, maws: 2, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 3, slamminlid: 4 },
  // ========== スロッシャー ==========
  "ヒッセン":         { steelhead: 2, flyfish: 3, scrapper: 2, steeleel: 3, stinger: 2, maws: 3, drizzler: 2, fishstick: 3, flipper: 3, bigshot: 2, slamminlid: 3 },
  "バケットスロッシャー":  { steelhead: 2, flyfish: 2, scrapper: 2, steeleel: 3, stinger: 2, maws: 3, drizzler: 2, fishstick: 3, flipper: 3, bigshot: 2, slamminlid: 3 },
  "スクリュースロッシャー": { steelhead: 3, flyfish: 2, scrapper: 2, steeleel: 2, stinger: 2, maws: 3, drizzler: 2, fishstick: 4, flipper: 2, bigshot: 1, slamminlid: 2 },
  "オーバーフロッシャー":  { steelhead: 2, flyfish: 2, scrapper: 3, steeleel: 2, stinger: 3, maws: 3, drizzler: 3, fishstick: 3, flipper: 2, bigshot: 3, slamminlid: 2 },
  "エクスプロッシャー":   { steelhead: 2, flyfish: 5, scrapper: 1, steeleel: 1, stinger: 1, maws: 1, drizzler: 1, fishstick: 2, flipper: 2, bigshot: 1, slamminlid: 2 },
  "モップリン":        { steelhead: 3, flyfish: 2, scrapper: 3, steeleel: 4, stinger: 3, maws: 2, drizzler: 2, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 4 },
  // ========== シェルター ==========
  "パラシェルター":     { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 2, fishstick: 2, flipper: 3, bigshot: 3, slamminlid: 3 },
  "キャンピングシェルター": { steelhead: 4, flyfish: 1, scrapper: 2, steeleel: 2, stinger: 2, maws: 2, drizzler: 1, fishstick: 1, flipper: 2, bigshot: 2, slamminlid: 2 },
  "スパイガジェット":    { steelhead: 2, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 2, maws: 3, drizzler: 2, fishstick: 2, flipper: 3, bigshot: 2, slamminlid: 2 },
  "24式張替傘・甲":    { steelhead: 3, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 2, flipper: 3, bigshot: 3, slamminlid: 3 },
  // ========== ストリンガー ==========
  "トライストリンガー":   { steelhead: 4, flyfish: 3, scrapper: 2, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 4, flipper: 4, bigshot: 3, slamminlid: 4 },
  "LACT-450":        { steelhead: 2, flyfish: 4, scrapper: 3, steeleel: 3, stinger: 3, maws: 3, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 3, slamminlid: 3 },
  "フルイドV":        { steelhead: 4, flyfish: 2, scrapper: 4, steeleel: 4, stinger: 3, maws: 4, drizzler: 4, fishstick: 2, flipper: 4, bigshot: 4, slamminlid: 4 },
  // ========== ワイパー ==========
  "ドライブワイパー":    { steelhead: 4, flyfish: 3, scrapper: 4, steeleel: 4, stinger: 3, maws: 4, drizzler: 4, fishstick: 3, flipper: 3, bigshot: 3, slamminlid: 3 },
  "ジムワイパー":      { steelhead: 4, flyfish: 3, scrapper: 4, steeleel: 4, stinger: 4, maws: 4, drizzler: 4, fishstick: 2, flipper: 3, bigshot: 4, slamminlid: 4 },
  "デンタルワイパーミント": { steelhead: 2, flyfish: 3, scrapper: 4, steeleel: 4, stinger: 3, maws: 3, drizzler: 4, fishstick: 2, flipper: 3, bigshot: 4, slamminlid: 3 },
  // ========== クマサン印 ==========
  "クマサン印のマニューバー": { steelhead: 2, flyfish: 4, scrapper: 3, steeleel: 3, stinger: 4, maws: 4, drizzler: 3, fishstick: 2, flipper: 4, bigshot: 4, slamminlid: 4 },
  "クマサン印のブラスター":  { steelhead: 2, flyfish: 4, scrapper: 3, steeleel: 3, stinger: 4, maws: 3, drizzler: 3, fishstick: 4, flipper: 3, bigshot: 3, slamminlid: 3 },
  "クマサン印のローラー":   { steelhead: 4, flyfish: 3, scrapper: 4, steeleel: 4, stinger: 4, maws: 5, drizzler: 2, fishstick: 1, flipper: 5, bigshot: 5, slamminlid: 4 },
  "クマサン印のチャージャー": { steelhead: 5, flyfish: 3, scrapper: 4, steeleel: 4, stinger: 4, maws: 4, drizzler: 5, fishstick: 2, flipper: 5, bigshot: 5, slamminlid: 5 },
  "クマサン印のスロッシャー": { steelhead: 5, flyfish: 5, scrapper: 5, steeleel: 3, stinger: 3, maws: 1, drizzler: 5, fishstick: 2, flipper: 2, bigshot: 2, slamminlid: 3 },
  "クマサン印のシェルター":  { steelhead: 3, flyfish: 4, scrapper: 3, steeleel: 3, stinger: 4, maws: 3, drizzler: 4, fishstick: 3, flipper: 4, bigshot: 3, slamminlid: 3 },
  "クマサン印のストリンガー": { steelhead: 4, flyfish: 3, scrapper: 3, steeleel: 3, stinger: 3, maws: 5, drizzler: 4, fishstick: 3, flipper: 4, bigshot: 4, slamminlid: 3 },
  "クマサン印のワイパー":   { steelhead: 5, flyfish: 5, scrapper: 3, steeleel: 3, stinger: 4, maws: 5, drizzler: 5, fishstick: 1, flipper: 5, bigshot: 5, slamminlid: 4 },
};

// ハシラ評価 生スコア（ground=地上, pillar=柱上, 1=×, 2=△, 3=〇, 4=◎）
var FISHSTICK_RAW = {
  // ========== シューター ==========
  "ボールドマーカー":    { ground: 1, pillar: 4 },
  "わかばシューター":    { ground: 1, pillar: 3 },
  "シャープマーカー":    { ground: 2, pillar: 3 },
  "プロモデラーMG":    { ground: 1, pillar: 4 },
  "スプラシューター":    { ground: 3, pillar: 4 },
  "N-ZAP85":         { ground: 3, pillar: 3 },
  ".52ガロン":        { ground: 3, pillar: 4 },
  "プライムシューター":   { ground: 4, pillar: 4 },
  ".96ガロン":        { ground: 3, pillar: 2 },
  "ジェットスイーパー":   { ground: 4, pillar: 3 },
  "スペースシューター":   { ground: 3, pillar: 2 },
  "L3リールガン":      { ground: 3, pillar: 3 },
  "H3リールガン":      { ground: 3, pillar: 2 },
  "ボトルガイザー":     { ground: 4, pillar: 4 },
  // ========== マニューバー ==========
  "スパッタリー":      { ground: 1, pillar: 4 },
  "スプラマニューバー":   { ground: 3, pillar: 4 },
  "デュアルスイーパー":   { ground: 4, pillar: 3 },
  "ケルビン525":      { ground: 4, pillar: 3 },
  "クアッドホッパーブラック": { ground: 3, pillar: 2 },
  "ガエンFF":        { ground: 4, pillar: 3 },
  // ========== スピナー ==========
  "スプラスピナー":     { ground: 4, pillar: 3 },
  "バレルスピナー":     { ground: 4, pillar: 4 },
  "ハイドラント":      { ground: 4, pillar: 4 },
  "クーゲルシュライバー":  { ground: 4, pillar: 4 },
  "ノーチラス47":      { ground: 4, pillar: 4 },
  "イグザミナー":      { ground: 4, pillar: 4 },
  // ========== ブラスター ==========
  "ノヴァブラスター":    { ground: 3, pillar: 3 },
  "ホットブラスター":    { ground: 4, pillar: 1 },
  "ロングブラスター":    { ground: 4, pillar: 1 },
  "ラピッドブラスター":   { ground: 4, pillar: 1 },
  "Rブラスターエリート":  { ground: 4, pillar: 1 },
  "クラッシュブラスター":  { ground: 4, pillar: 3 },
  "S-BLAST92":       { ground: 4, pillar: 2 },
  // ========== ローラー ==========
  "カーボンローラー":    { ground: 2, pillar: 4 },
  "スプラローラー":     { ground: 2, pillar: 4 },
  "ダイナモローラー":    { ground: 2, pillar: 2 },
  "ヴァリアブルローラー":  { ground: 2, pillar: 4 },
  "ワイドローラー":     { ground: 3, pillar: 4 },
  // ========== フデ ==========
  "パブロ":          { ground: 1, pillar: 4 },
  "ホクサイ":         { ground: 1, pillar: 4 },
  "フィンセント":      { ground: 2, pillar: 3 },
  // ========== チャージャー ==========
  "スクイックリンα":    { ground: 1, pillar: 3 },
  "スプラチャージャー":   { ground: 1, pillar: 3 },
  "リッター4K":       { ground: 1, pillar: 3 },
  "ソイチューバー":     { ground: 3, pillar: 3 },
  "14式竹筒銃・甲":    { ground: 4, pillar: 3 },
  "R-PEN/5H":        { ground: 3, pillar: 3 },
  // ========== スロッシャー ==========
  "ヒッセン":         { ground: 2, pillar: 4 },
  "バケットスロッシャー":  { ground: 3, pillar: 3 },
  "スクリュースロッシャー": { ground: 4, pillar: 1 },
  "オーバーフロッシャー":  { ground: 3, pillar: 3 },
  "エクスプロッシャー":   { ground: 3, pillar: 1 },
  "モップリン":        { ground: 4, pillar: 2 },
  // ========== シェルター ==========
  "パラシェルター":     { ground: 3, pillar: 2 },
  "キャンピングシェルター": { ground: 3, pillar: 3 },
  "スパイガジェット":    { ground: 3, pillar: 2 },
  "24式張替傘・甲":    { ground: 3, pillar: 2 },
  // ========== ストリンガー ==========
  "トライストリンガー":   { ground: 4, pillar: 3 },
  "LACT-450":        { ground: 2, pillar: 3 },
  "フルイドV":        { ground: 2, pillar: 3 },
  // ========== ワイパー ==========
  "ドライブワイパー":    { ground: 3, pillar: 3 },
  "ジムワイパー":      { ground: 2, pillar: 3 },
  "デンタルワイパーミント": { ground: 2, pillar: 3 },
  // ========== クマサン印 ==========
  "クマサン印のマニューバー": { ground: 1, pillar: 4 },
  "クマサン印のブラスター":  { ground: 4, pillar: 4 },
  "クマサン印のローラー":   { ground: 1, pillar: 3 },
  "クマサン印のチャージャー": { ground: 2, pillar: 2 },
  "クマサン印のスロッシャー": { ground: 3, pillar: 1 },
  "クマサン印のシェルター":  { ground: 3, pillar: 4 },
  "クマサン印のストリンガー": { ground: 3, pillar: 4 },
  "クマサン印のワイパー":   { ground: 1, pillar: 3 },
};

// 総合力スコア計算
// clearing×4 + paint×2 + bossAvg×2 + mobility×1 + handling×1
// bossAvg: 全11ボスの均等加重平均
// 射程ペナルティ: スプラシューター(range=23)未満のブキに-3〜-10
(function() {
  var bossKeys = ["steelhead","flyfish","scrapper","steeleel","stinger","maws","drizzler","fishstick","flipper","bigshot","slamminlid"];
  // rangeOverride: rangeスコアではなく実戦射程でペナルティを判定するブキ
  //   ローラー: 轢きの射程が極めて短く至近距離必須のため最短扱い
  //   ブラスター: 爆風射程で判定（爆風が届くため実質射程は長い）
  //   高拡散シューター: 弾ブレが大きく至近距離まで詰める必要があるため最短扱い
  var rangeOverride = {
    "カーボンローラー": 0,
    "スプラローラー": 0,
    "ヴァリアブルローラー": 0,
    "ダイナモローラー": 0,
    "ワイドローラー": 0,
    "ノヴァブラスター": 22,
    "わかばシューター": 0,
    "プロモデラーMG": 0
  };
  var RANGE_THRESHOLD = 23; // スプラシューターの射程スコア
  for (var name in WEAPON_RATINGS) {
    var r = WEAPON_RATINGS[name];
    var b = BOSS_MATCHUPS[name];
    if (!b) continue;
    // ボススコアを0-100に正規化 (1→0, 2→25, 3→50, 4→75, 5→100)
    var bossSum = 0;
    for (var i = 0; i < bossKeys.length; i++) {
      bossSum += (b[bossKeys[i]] - 1) * 25;
    }
    var bossAvg = bossSum / bossKeys.length;
    var hScore = r.handling;
    var base = Math.round(
      (r.clearing * 4.5 + r.paint * 1.5 + bossAvg * 2.5 + r.mobility * 0.5 + hScore * 1) / 10
    );
    // 射程ペナルティ（最低3、最大10）
    var penaltyRange = (rangeOverride[name] != null) ? rangeOverride[name] : r.range;
    var rangePenalty = 0;
    if (penaltyRange < RANGE_THRESHOLD) {
      var MAX_PENALTY_RANGE = 21; // ペナルティ対象の最長射程スコア
      rangePenalty = Math.round(3 + (MAX_PENALTY_RANGE - penaltyRange) / MAX_PENALTY_RANGE * 7);
    }
    // ボールドマーカー: 圧倒的火力で射程の短さを補えるためペナルティ軽減
    if (name === "ボールドマーカー") rangePenalty = Math.round(rangePenalty * 2 / 3);
    r.overall = base - rangePenalty;
  }
})();

// ブキアイコンマッピング（schedule.js, ranking.js 共通）
var WEAPON_ICONS = {
  ".52ガロン": "weapon_shooter_52gal.png",
  ".96ガロン": "weapon_shooter_96gal.png",
  "プロモデラーMG": "weapon_shooter_aerospraymg.png",
  "H3リールガン": "weapon_shooter_h-3nozzlenose.png",
  "ジェットスイーパー": "weapon_shooter_jetsquelcher.png",
  "L3リールガン": "weapon_shooter_l-3nozzlenose.png",
  "N-ZAP85": "weapon_shooter_n-zap85.png",
  "シャープマーカー": "weapon_shooter_splash-o-matic.png",
  "スプラシューター": "weapon_shooter_splattershot.png",
  "わかばシューター": "weapon_shooter_splattershotjr.png",
  "スペースシューター": "weapon_shooter_splattershotnova.png",
  "プライムシューター": "weapon_shooter_splattershotpro.png",
  "ボールドマーカー": "weapon_shooter_sploosh-o-matic.png",
  "ボトルガイザー": "weapon_shooter_squeezer.png",
  "ワイドローラー": "weapon_roller_bigswigroller.png",
  "カーボンローラー": "weapon_roller_carbonroller.png",
  "ダイナモローラー": "weapon_roller_dynamoroller.png",
  "ヴァリアブルローラー": "weapon_roller_flingzaroller.png",
  "スプラローラー": "weapon_roller_splatroller.png",
  "14式竹筒銃・甲": "weapon_charger_bamboozler14mki.png",
  "スクイックリンα": "weapon_charger_classicsquiffer.png",
  "リッター4K": "weapon_charger_e-liter4k.png",
  "ソイチューバー": "weapon_charger_gootuber.png",
  "R-PEN/5H": "weapon_charger_snipewriter5h.png",
  "スプラチャージャー": "weapon_charger_splatcharger.png",
  "ホットブラスター": "weapon_blaster_blaster.png",
  "クラッシュブラスター": "weapon_blaster_clashblaster.png",
  "ノヴァブラスター": "weapon_blaster_lunablaster.png",
  "ロングブラスター": "weapon_blaster_rangeblaster.png",
  "ラピッドブラスター": "weapon_blaster_rapidblaster.png",
  "Rブラスターエリート": "weapon_blaster_rapidblasterpro.png",
  "S-BLAST92": "weapon_blaster_sblast92.png",
  "パブロ": "weapon_brush_inkbrush.png",
  "ホクサイ": "weapon_brush_octobrush.png",
  "フィンセント": "weapon_brush_painbrush.png",
  "オーバーフロッシャー": "weapon_slosher_bloblobber.png",
  "モップリン": "weapon_slosher_dreadwringer.png",
  "エクスプロッシャー": "weapon_slosher_explosher.png",
  "バケットスロッシャー": "weapon_slosher_slosher.png",
  "スクリュースロッシャー": "weapon_slosher_sloshingmachine.png",
  "ヒッセン": "weapon_slosher_trislosher.png",
  "クーゲルシュライバー": "weapon_spinner_ballpointsplatling.png",
  "イグザミナー": "weapon_spinner_heavyeditsplatling.png",
  "バレルスピナー": "weapon_spinner_heavysplatling.png",
  "ハイドラント": "weapon_spinner_hydrasplatling.png",
  "スプラスピナー": "weapon_spinner_minisplatling.png",
  "ノーチラス47": "weapon_spinner_nautilus47.png",
  "スパッタリー": "weapon_maneuver_dappledualies.png",
  "クアッドホッパーブラック": "weapon_maneuver_darktetradualies.png",
  "ガエンFF": "weapon_maneuver_douserdualiesff.png",
  "デュアルスイーパー": "weapon_maneuver_dualiesquelchers.png",
  "ケルビン525": "weapon_maneuver_gloogadualies.png",
  "スプラマニューバー": "weapon_maneuver_splatdualies.png",
  "24式張替傘・甲": "weapon_shelter_recycledbrella24mk1.png",
  "パラシェルター": "weapon_shelter_splatbrella.png",
  "キャンピングシェルター": "weapon_shelter_tentabrella.png",
  "スパイガジェット": "weapon_shelter_undercoverbrella.png",
  "LACT-450": "weapon_stringer_reeflux450.png",
  "トライストリンガー": "weapon_stringer_tristringer.png",
  "フルイドV": "weapon_stringer_wellstringv.png",
  "デンタルワイパーミント": "weapon_saber_mintdecavitator.png",
  "ジムワイパー": "weapon_saber_splatanastamper.png",
  "ドライブワイパー": "weapon_saber_splatanawiper.png",
  "クマサン印のブラスター": "weapon_grizzco_blaster.png",
  "クマサン印のシェルター": "weapon_grizzco_brella.png",
  "クマサン印のチャージャー": "weapon_grizzco_charger.png",
  "クマサン印のマニューバー": "weapon_grizzco_dualies.png",
  "クマサン印のローラー": "weapon_grizzco_roller.png",
  "クマサン印のスロッシャー": "weapon_grizzco_slosher.png",
  "クマサン印のワイパー": "weapon_grizzco_splatana.png",
  "クマサン印のストリンガー": "weapon_grizzco_stringer.png",
  "？": "weapon_random.png"
};
