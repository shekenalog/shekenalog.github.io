// ブキ評価ページ
// WEAPON_DATA, WEAPON_RATINGS は weapon_data.js でグローバル定義済み

var ICON_DIR = "png/";

// WEAPON_ICONS は weapon_data.js で定義

// --- クマサン印ブキ（カテゴリマッピング） ---
var GRIZZCO_WEAPONS = {
  "クマサン印のマニューバー": "maneuver",
  "クマサン印のブラスター": "blaster",
  "クマサン印のローラー": "roller",
  "クマサン印のチャージャー": "charger",
  "クマサン印のスロッシャー": "slosher",
  "クマサン印のシェルター": "shelter",
  "クマサン印のストリンガー": "stringer",
  "クマサン印のワイパー": "wiper"
};

// --- ブキ内部番号順（WEAPON_DATAの定義順から生成、同スコア時のソート用） ---
// クマサン印ブキは各カテゴリの最後に配置
var WEAPON_ORDER = {};
(function () {
  var i = 0;
  var categoryMax = {};
  for (var name in WEAPON_DATA) {
    WEAPON_ORDER[name] = i;
    var cat = WEAPON_DATA[name].category;
    categoryMax[cat] = i;
    i++;
  }
  for (var gName in GRIZZCO_WEAPONS) {
    var gCat = GRIZZCO_WEAPONS[gName];
    WEAPON_ORDER[gName] = (categoryMax[gCat] != null ? categoryMax[gCat] : i) + 0.5;
  }
})();

// --- ティア定義（正規化後の0-100スケール用） ---
var TIERS = [
  { name: "X",  min: 90, color: "#ff2496" },
  { name: "S+", min: 75, color: "#c77dff" },
  { name: "S",  min: 65, color: "#4a90d9" },
  { name: "A",  min: 50, color: "#ff6b35" },
  { name: "B",  min: 30, color: "#ffd700" },
  { name: "C",  min: 0,  color: "#50c878" }
];

// --- オオモノ定義 ---
var BOSS_LIST = [
  { key: "steelhead",  name: "バクダン",   icon: "salmon_steelhead.png" },
  { key: "flyfish",    name: "カタパッド",  icon: "salmon_flyfish.png" },
  { key: "scrapper",   name: "テッパン",   icon: "salmon_scrapper.png" },
  { key: "steeleel",   name: "ヘビ",      icon: "salmon_steeleel.png" },
  { key: "stinger",    name: "タワー",    icon: "salmon_stinger.png" },
  { key: "maws",       name: "モグラ",    icon: "salmon_maws.png" },
  { key: "drizzler",   name: "コウモリ",   icon: "salmon_drizzler.png" },
  { key: "fishstick",  name: "ハシラ",    icon: "salmon_fishstick.png" },
  { key: "flipper",    name: "ダイバー",   icon: "salmon_flipper-flopper.png" },
  { key: "bigshot",    name: "テッキュウ",  icon: "salmon_bigshot.png" },
  { key: "slamminlid", name: "ナベブタ",   icon: "salmon_slamminlid.png" }
];

var RATING_SYMBOLS = [
  null,
  { symbol: "\u00D7", cls: "rating-1" },  // ×
  { symbol: "\u25B3", cls: "rating-2" },  // △
  { symbol: "\u3007", cls: "rating-3" },  // 〇
  { symbol: "\u25CE", cls: "rating-4" },  // ◎
  { symbol: "\u2605", cls: "rating-5" }   // ★
];

// --- 実効射程トグル状態 ---
var effectiveRangeMode = false;

// --- 評価方法テキスト ---
var METHOD_TEXT = {
  overall: '<p><strong>総合力</strong>: 各指標の加重平均による総合評価です。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>総合力 = (雑魚処理 \u00D7 4.5 + 塗り \u00D7 1.5 + 対オオモノ平均 \u00D7 2.5 + 機動力 \u00D7 0.5 + 扱いやすさ \u00D7 1) / 10</pre>' +
    '<p>サーモンランで最も重要な雑魚処理を最重視（45%）し、対オオモノ（25%）、塗り（15%）、扱いやすさ（10%）、機動力（5%）の順で評価しています。</p>' +
    '<p><strong>対オオモノ平均:</strong> 全11ボスの評価値（1-4）を0-100に正規化し、均等に加重平均したスコアです。</p>' +
    '<p><strong>射程ペナルティ:</strong> スプラシューター（射程スコア23）未満のブキに、射程が短いほど大きいペナルティを適用します（-3\u301C-10）。ローラー類はヨコ振りの最長射程部分では減衰して火力が発揮されず実際は至近距離で戦うため最短扱い、拡散が10\u00B0以上のシューターも同様に弾ブレにより至近距離戦闘を強いられるため最短扱いで判定します。</p>' +
    '<pre>ペナルティ = round(3 + (21 \u2212 射程スコア) / 21 \u00D7 7)  [3\u301C10]</pre>',
  mobility: '<p><strong>機動力</strong>: サーモンランにおけるブキの「動きやすさ」と「納品のしやすさ」を0〜100で評価したスコアです。</p>' +
    '<p>以下の4要素+ボーナスで算出しています:</p>' +
    '<ul>' +
    '<li><strong>基礎移動 (20%)</strong> — 非射撃時ヒト速・イカ速・重量区分（フデは塗り進み速度を加算）</li>' +
    '<li><strong>射撃中移動 (25%)</strong> — 射撃時ヒト速（塗りながら納品できるか。フデは塗り進み速度をブレンド。スピナーはチャージ中/射撃中の時間加重平均）</li>' +
    '<li><strong>行動自由度 (35%)</strong> — 硬直の短さ＝自由に動ける時間が長い（対数スケール。マニューバーはスライド後の移動不能時間で進行型ペナルティ）</li>' +
    '<li><strong>塗り道 (20%)</strong> — 進行方向にどれだけ早く・ワイドに道を切り開けるか。1発の塗り面積÷発生時間で算出（継続塗り能力とは異なる即応性の指標）</li>' +
    '</ul>' +
    '<p><strong>チャージキープボーナス (+5)</strong>: チャージ保持可能なブキ（スプラチャージャー・リッター4K・スクイックリンα・ソイチューバー・LACT-450・ノーチラス47）に加点</p>' +
    '<p><strong>バースト射撃ペナルティ (-10)</strong>: H3リールガン（バースト射撃で長押し連射不可のため硬直が大きい）。<strong>L3リールガンは-5</strong>（連射が速く影響が小さいため半減）</p>' +
    '<p><strong>スライド硬直ペナルティ</strong>: マニューバー系はスライド後の移動不能時間（SL→移動可能）で進行型ペナルティ。スパッタリー(40F)を基準とし、超過フレーム分だけ行動自由度にペナルティを加算</p>',
  paint: '<p><strong>塗り</strong>: サーモンランにおけるブキの「足場を作る能力」を0〜100で評価したスコアです。</p>' +
    '<p>塗り進み（ローラー転がし・フデ走り）は考慮せず、射撃による塗りのみで評価しています。以下の5要素で算出:</p>' +
    '<ul>' +
    '<li><strong>塗り速度 (25%)</strong> — 時間あたりの塗り出力</li>' +
    '<li><strong>射撃中移動 (30%)</strong> — 射撃しながら動ける速度</li>' +
    '<li><strong>インク効率 (15%)</strong> — インクタンク満タンから塗れる総塗りポイント（SRでは塗りだけなら基本的にインク切れしないため一定以上は足切り）</li>' +
    '<li><strong>インク持続 (25%)</strong> — インクロックの短さ（短いほど高評価）。チャージ武器はチャージ時間もダウンタイムとして考慮</li>' +
    '<li><strong>塗り射程 (5%)</strong> — 塗り射程が長すぎてもあまり意味がないため一定以上は差がつかない</li>' +
    '</ul>',
  range: '<p><strong>射程</strong>: サーモンランにおけるブキの「攻撃が届く射程の長さ」を0〜100で評価したスコアです。</p>' +
    '<p>各ブキが取りうる最大射程を線形正規化（最短0、最長100）して算出しています。計算式による補正はなく、純粋な射程の長さのみで評価します。</p>' +
    '<p><strong>カテゴリ別の射程定義:</strong></p>' +
    '<ul>' +
    '<li><strong>シューター・スロッシャー・シェルター</strong> — 通常射撃の最大射程</li>' +
    '<li><strong>マニューバー</strong> — スライド後の最大射程（ガエンFFのみスライド前の方が射程が長いためそちらで評価）</li>' +
    '<li><strong>ブラスター</strong> — 爆風の最大到達距離（直撃ではなく爆風込み）</li>' +
    '<li><strong>ローラー</strong> — タテ振りの最大射程（ヨコ振り・塗り進みではなく最も遠くまで届くタテ振りで評価）</li>' +
    '<li><strong>フデ</strong> — 振りの最大射程</li>' +
    '<li><strong>ワイパー</strong> — タメ斬りの最大射程（ヨコ振りより長い）</li>' +
    '<li><strong>スピナー・チャージャー・ストリンガー</strong> — フルチャージの最大射程</li>' +
    '</ul>',
  effectiveRange: '<p><strong>実効射程</strong>: 斜め方向への射撃時の水平射程減衰を考慮した射程スコアです。オーバーフロッシャーなどの射程詐欺ブキを炙り出す目的があります。</p>' +
    '<p>サーモンランではバクダン処理・段差上への攻撃などで斜め上向き射撃が発生します。水平0\u00B0・15\u00B0・30\u00B0・45\u00B0の4角度で弾道をシミュレーションし、加重平均で実効射程を算出しています。</p>' +
    '<p><strong>ブキ種別の物理シミュレーション:</strong></p>' +
    '<ul>' +
    '<li><strong>シューター/スピナー/マニューバー/シェルター/ブラスター/チャージャー</strong> — 3フェーズ弾道（直進→減速→自由落下）。上向きほど水平到達距離が減少</li>' +
    '<li><strong>ローラー/フデ</strong> — 空気抵抗・重力が小さい弾道パラメータ。上向きでもほぼ射程が落ちない（effectiveRatio ~0.97）</li>' +
    '<li><strong>ストリンガー</strong> — 自由落下時の高摩擦で上向き射撃の影響は中程度（effectiveRatio ~0.95）</li>' +
    '<li><strong>スロッシャー</strong> — 放物線弾道のため上向き射撃で大幅に水平射程が減少（effectiveRatio ~0.74-0.78）</li>' +
    '<li><strong>ワイパー</strong> — 斬撃の線なので cos(θ) で水平成分が縮小（effectiveRatio ~0.95）</li>' +
    '</ul>',
  clearing: '<p><strong>雑魚処理</strong>: サーモンランにおけるブキの「雑魚シャケ殲滅力」を0〜100で評価したスコアです。</p>' +
    '<p>以下の4要素を加重平均して算出しています:</p>' +
    '<ul>' +
    '<li><strong>主観ティアリスト</strong> — 50名のサーモンランプレイヤーによる雑魚処理ティアリストを統合。以下の3要素とブレンドし、シミュレーションでは再現できない生のプレイヤーの主観も反映</li>' +
    '<li><strong>殲滅シミュレーション</strong> — カテゴリ別物理シミュレーション。敵10体（ドスコイ・中シャケ・コジャケ混成）を殲滅するタイム・インク消費・被弾の加重評価</li>' +
    '<li><strong>面制圧速度</strong> — 単位時間あたりの面制圧力を数値化。幾何面積×ダメージ補正の実効面積に、連射レートと射撃中移動速度で補正</li>' +
    '<li><strong>機動力</strong> — 既存の機動力スコアを使用。動ける＝ポジション取りが速い＝殲滅効率に寄与</li>' +
    '</ul>',
  boss: '<p><strong>対オオモノ</strong>: 各ブキが11種のオオモノシャケそれぞれに対してどれだけ有効かを、マトリクス表で表示します。</p>' +
    '<p>ブキは内部番号順で並んでいます。横スクロールで全ブキを確認できます。</p>' +
    '<p><strong>評価記号（5段階）:</strong></p>' +
    '<ul>' +
    '<li><span style="color:#ff4466">\u00D7</span> — 苦手（そのブキでは倒しにくい・非効率）</li>' +
    '<li><span style="color:#f0a050">\u25B3</span> — やや苦手（倒せるが時間やインクがかかる）</li>' +
    '<li><span style="color:#e0e0e0">\u3007</span> — 普通（標準的な対応が可能）</li>' +
    '<li><span style="color:#50c878">\u25CE</span> — 得意（効率よく倒せる）</li>' +
    '<li><span style="color:#ffd700">\u2605</span> — 特殊技能あり（特別な対処法を持つ）</li>' +
    '</ul>' +
    '<hr>' +
    '<h3>バクダン評価ロジック</h3>' +
    '<p>バクダンの膨らんだ爆弾部分を射撃で割る能力を評価します。</p>' +
    '<ul>' +
    '<li><span style="color:#ff4466">\u00D7</span>(1) — 相手にしない方がいいレベル（射程・火力ともに不足）</li>' +
    '<li><span style="color:#f0a050">\u25B3</span>(2) — 近づいても1ターンでやり漏らす可能性があるブキ</li>' +
    '<li><span style="color:#e0e0e0">\u3007</span>(3) — ある程度の距離から1ターン処理が安定するブキ</li>' +
    '<li><span style="color:#50c878">\u25CE</span>(4) — 遠距離からでも安定して1ターン処理できるブキ</li>' +
    '<li><span style="color:#ffd700">\u2605</span>(5) — 特殊技能あり（貫通・装甲無視等で特別な処理が可能）</li>' +
    '</ul>' +
    '<hr>' +
    '<h3>カタパッド評価ロジック</h3>' +
    '<p>モグラと同一の基底スコア（インクロック基準）を使用します。</p>' +
    '<p><strong>ベーススコア:</strong></p>' +
    '<pre>base = clamp(round(4 \u2212 effectiveInkLock / 25), 1, 4)</pre>' +
    '<p>ボムを投げ入れて倒すのが基本のため、インクロックが短い（ボム回転が速い）ブキほど高評価です。</p>' +
    '<p><strong>特殊評価:</strong></p>' +
    '<ul>' +
    '<li><span style="color:#ffd700">\u2605</span> エクスプロッシャー — ボム属性の弾により、通常射撃でコンテナを破壊できる</li>' +
    '<li><span style="color:#ffd700">\u2605</span> クマサン印のスロッシャー — 装甲貫通弾で本体を直接攻撃できる</li>' +
    '<li><span style="color:#ffd700">\u2605</span> クマサン印のワイパー — 装甲貫通斬撃で本体を直接攻撃できる</li>' +
    '<li><span style="color:#50c878">\u25CE</span> クマサン印のマニューバー — フタが開いたコンテナ内にスライド爆風を当ててコンテナを破壊できる（base+1）</li>' +
    '</ul>' +
    '<p><strong>重量級ペナルティ:</strong> weight=\u201Cheavy\u201D のブキは -1（ボムを投げに行く機動力が低い）。ただし★特殊技能は据え置き。</p>' +
    '<p><strong>主観調整:</strong> ミサイルが降り注ぐ中でも安定して動けるブキを加点、ミサイルの爆風で行動が制限されやすいブキを減点しています。</p>' +
    '<hr>' +
    '<h3>テッパン評価ロジック</h3>' +
    '<p>テッパンをスタンさせ、回り込んで倒す能力を、機動力とDPSの加重平均で評価します。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>DPS正規化 = clamp((DPS \u2212 180) / (625 \u2212 180) \u00D7 100, 0, 100)\nblended = 機動力 \u00D7 0.3 + DPS正規化 \u00D7 0.7</pre>' +
    '<p><strong>主観調整:</strong> テッパンに追われた際に逃げるのが困難なブキ（チャージが重い・機動力が低い等）を減点しています。また、1発あたりのダメージが高く処理しやすいにもかかわらずDPS計算上過小評価されていたブキを底上げしています。</p>' +
    '<hr>' +
    '<h3>ヘビ評価ロジック</h3>' +
    '<p>自分がヘビのターゲットである際の処理難易度・デスリスクと、他のプレイヤーを追うヘビの処理速度を総合的に評価しています。</p>' +
    '<p>計算式はなく、実際のプレイ体感に基づく手動評価です。機動力が高くDPSも出せるブキは逃げながら尻尾を叩きやすく高評価、機動力が低い・チャージが必要・連射が遅いブキは追われた際のリスクが高く低評価としています。</p>' +
    '<hr>' +
    '<h3>タワー評価ロジック</h3>' +
    '<p>タワーは遠距離から鍋を撃ち落とす射程だけでなく、タワー周辺の雑魚シャケを掻き分けて接近・処理する能力も求められます。シェケナダムの桟橋奥のように雑魚が行く手を阻む状況でも迅速に処理できるかを加味しています。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>blended = 機動力 × 0.3 + 雑魚処理 × 0.4 + 実効射程 × 0.3</pre>' +
    '<p><strong>実効射程の扱い:</strong> ローラー類は振りの射程がタワーの鍋に届きにくいため、一律20として計算しています。</p>' +
    '<p><strong>主観調整:</strong> 上記の計算結果に対して、一部ブキに主観調整を加えています。</p>' +
    '<hr>' +
    '<h3>モグラ評価ロジック</h3>' +
    '<p>インクロック（fdInkLock）を基準にベーススコアを算出し、ターンキル能力に応じてボーナスを加算します。</p>' +
    '<p><strong>ベーススコア:</strong></p>' +
    '<pre>base = clamp(round(4 \u2212 effectiveInkLock / 25), 1, 4)</pre>' +
    '<p>インクロックが短いほどボム回転が速く、モグラへの対応力が高くなります。</p>' +
    '<p><strong>ターンキルボーナス:</strong></p>' +
    '<ul>' +
    '<li><strong>0ターンキル</strong>（地形貫通で顔出し前に1200ダメージ）: +3 \u2192 <span style="color:#ffd700">\u2605</span>(5) — クマサン印のワイパーのみ</li>' +
    '<li><strong>1ターンキル</strong>（1回の顔出し中に1200ダメージ）: +2, 上限4(<span style="color:#50c878">\u25CE</span>)</li>' +
    '<li><strong>2ターンキル</strong>（2回の顔出しで1200ダメージ）: +1, 上限4(<span style="color:#50c878">\u25CE</span>)</li>' +
    '</ul>' +
    '<p><strong>※高難度指定:</strong> 理論上はターンキル可能だが実戦では高難度なブキは、ボーナスを除外しベーススコアのみとします。</p>' +
    '<ul>' +
    '<li>スプラチャージャー（2T理論値）</li>' +
    '<li>ノヴァブラスター（1T理論値）</li>' +
    '<li>ケルビン525（2T理論値）</li>' +
    '<li>クマサン印のマニューバー（1T可能だが2T扱い）</li>' +
    '<li>スプラシューター（2T理論値）</li>' +
    '<li>.96ガロン（2T理論値）</li>' +
    '<li>スプラマニューバー（2T理論値）</li>' +
    '<li>スプラスピナー（2T理論値）</li>' +
    '<li>トライストリンガー（2T理論値）</li>' +
    '<li>LACT-450（2T理論値）</li>' +
    '<li>クマサン印のシェルター（2T理論値）</li>' +
    '<li>クマサン印のブラスター（2T理論値）</li>' +
    '</ul>' +
    '<p><strong>主観調整:</strong> 後隙が大きい・足元塗りが弱いなどの理由でモグラに食べられるリスクが高いブキを減点しています。</p>' +
    '<hr>' +
    '<h3>コウモリ評価ロジック</h3>' +
    '<p>2つの指標の平均で評価します。両指標とも\u25B3の場合は\u00D7になります。</p>' +
    '<p><strong>指標1: 本体攻撃評価</strong></p>' +
    '<p>コウモリ本体にダメージを与えられる200F（約3.3秒）の間に与える総ダメージで評価します。' +
    'ローラー種はアップデートによりカサが閉じる寸前しか轢きが当たらなくなったため、基本的にヨコ振りのDPSで評価しています。</p>' +
    '<p><strong>指標2: 雨弾反射評価</strong></p>' +
    '<p>コウモリが放つ雨弾（アメフラシ弾）を打ち返す能力を、実効射程スコアで評価します。射程が長く弾速が速いブキほど反射しやすくなります。</p>' +
    '<p><strong>合算:</strong></p>' +
    '<pre>\u6700\u7D42 = round((\u672C\u4F53\u653B\u6483 + \u96E8\u5F3E\u53CD\u5C04) / 2)\n\u203B \u4E21\u6307\u6A19\u304C\u25B3\u306E\u5834\u5408 \u2192 \u00D7(1)</pre>' +
    '<p><strong>主観調整:</strong> 上記の計算結果に対して主観調整を加えています。雨弾が降って足場を奪われた際に機動力・チャージ・硬直の関係で立て直しが困難なブキを減点しています。</p>' +
    '<hr>' +
    '<h3>ハシラ評価ロジック</h3>' +
    '<p>地上からの攻撃力（ground）と柱上での処理力（pillar）を加重平均して算出します。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>fishstick = round((ground \u00D7 2 + pillar \u00D7 1) / 3)</pre>' +
    '<p>地上スコアを2倍に重み付けしています（柱に登らずに処理できるほうが実戦で重要なため）。</p>' +
    '<p><strong>ハシラ割り <span style="color:#ffd700; text-shadow:0 0 6px rgba(255,215,0,0.8), 0 0 12px rgba(255,215,0,0.4);">\u2605</span>:</strong> 地上から柱に登らずにハシラを効率的に破壊できるブキに付与されます。</p>' +
    '<ul>' +
    '<li><span style="color:#ffd700">\u2605</span> ラピッドブラスター</li>' +
    '<li><span style="color:#ffd700">\u2605</span> Rブラスターエリート</li>' +
    '<li><span style="color:#ffd700">\u2605</span> ロングブラスター</li>' +
    '<li><span style="color:#ffd700">\u2605</span> ジェットスイーパー</li>' +
    '</ul>' +
    '<p><strong>ハシラ割り <span style="color:#50c878">\u25CE</span>:</strong></p>' +
    '<ul>' +
    '<li>ハイドラント — 実用的にハシラ割りが可能</li>' +
    '<li>クーゲルシュライバー — 長射程モードでやや高難度だがハシラ割りが可能</li>' +
    '</ul>' +
    '<hr>' +
    '<h3>ダイバー評価ロジック</h3>' +
    '<p>ダイバーのリング塗り性能を中心に、機動力を加味して評価します。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>base = リング塗り(1-4) × 0.8 + 機動力(1-4) × 0.2\n→ 四捨五入して1-4にクランプ</pre>' +
    '<p><strong>リング塗り:</strong> ダイバーが出現するリング状エリアを素早く塗りつぶす能力。連射が速く塗り効率の高いブキほど高評価。</p>' +
    '<p><strong>空中撃破ボーナス:</strong> ダイバーが飛び上がった際に空中で撃破できるブキにボーナスを加算。</p>' +
    '<ul>' +
    '<li>ハイドラント +2（高DPSで空中の的を確実に仕留める）</li>' +
    '<li>リッター4K, トライストリンガー, フルイドV, ダイナモローラー, R-PEN/5H 各+1</li>' +
    '</ul>' +
    '<p>上記の計算結果に対して、一部ブキに主観調整を加えています。</p>' +
    '<hr>' +
    '<h3>テッキュウ評価ロジック</h3>' +
    '<p>テッキュウ処理に最適化した動きを想定し、DPS・雑魚処理・機動力の3指標を加重平均してスコアを算出します。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>blended = (DPSスコア \u00D7 5 + 実効雑魚処理 \u00D7 3.5 + 実効機動力 \u00D7 1.5) / 10</pre>' +
    '<p><strong>DPSスコア:</strong> テッキュウ処理に最適化したDPS値（625キャップ）を線形正規化（0〜100）。</p>' +
    '<p><strong>特殊技能 <span style="color:#ffd700; text-shadow:0 0 6px rgba(255,215,0,0.8), 0 0 12px rgba(255,215,0,0.4);">\u2605</span>:</strong> クマサン印のローラー・チャージャー・ワイパーはテッキュウを即処理できる（ストリンガーは砲台周りでの活動が怪しいため除外）。</p>' +
    '<p><strong>主観調整:</strong> テッキュウ砲台からイクラを飛ばす必要がある点を加味し、砲台付近での立ち回りが困難なブキ（チャージが重い・機動力が低い・硬直が長い等）を減点、逆に砲台周辺で柔軟に動けるブキを加点しています。</p>' +
    '<hr>' +
    '<h3>ナベブタ評価ロジック</h3>' +
    '<p>ナベブタ本体の下に潜り込んで処理する能力を、機動力と雑魚処理の加重平均で評価します。</p>' +
    '<p><strong>計算式:</strong></p>' +
    '<pre>blended = \u6A5F\u52D5\u529B \u00D7 0.4 + \u96D1\u9B5A\u51E6\u7406 \u00D7 0.6</pre>' +
    '<p>ナベブタの下では雑魚シャケも同時に湧くため、雑魚処理能力を重視（60%）しつつ、素早く潜り込んで離脱できる機動力（40%）も評価します。</p>' +
    '<p><strong>主観調整:</strong> 上記の計算結果に対して、一部ブキに主観調整を加えています。</p>',
  handling: '<p><strong>扱いやすさ</strong>: サーモンランにおけるブキの操作難易度・汎用性を主観で評価したスコアです。</p>' +
    '<p>計算式はなく、実際のプレイ体感に基づく手動評価です。シンプルな操作で即戦力になるブキほど高評価、特殊な操作や慣れが必要なブキほど低評価としています。</p>'
};

// --- ヘルパー ---
function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- 順位変動計算（通常射程 vs 実効射程） ---
function calcRankChanges() {
  // range と effectiveRange のスコアで順位を比較
  var weaponNames = [];
  for (var name in WEAPON_RATINGS) {
    if (WEAPON_RATINGS[name].range != null && WEAPON_RATINGS[name].effectiveRange != null) {
      weaponNames.push(name);
    }
  }

  // range順位（降順、同スコアはWEAPON_ORDER順）
  var byRange = weaponNames.slice().sort(function (a, b) {
    var sa = WEAPON_RATINGS[a].range, sb = WEAPON_RATINGS[b].range;
    if (sb !== sa) return sb - sa;
    var oa = WEAPON_ORDER[a] || 999, ob = WEAPON_ORDER[b] || 999;
    return oa - ob;
  });

  // effectiveRange順位（降順、同スコアはWEAPON_ORDER順）
  var byEffective = weaponNames.slice().sort(function (a, b) {
    var sa = WEAPON_RATINGS[a].effectiveRange, sb = WEAPON_RATINGS[b].effectiveRange;
    if (sb !== sa) return sb - sa;
    var oa = WEAPON_ORDER[a] || 999, ob = WEAPON_ORDER[b] || 999;
    return oa - ob;
  });

  var rangeRank = {};
  var effectiveRank = {};
  for (var i = 0; i < byRange.length; i++) {
    rangeRank[byRange[i]] = i + 1;
  }
  for (var i = 0; i < byEffective.length; i++) {
    effectiveRank[byEffective[i]] = i + 1;
  }

  // 変動 = rangeRank - effectiveRank（正=上昇、負=下降）
  var changes = {};
  for (var j = 0; j < weaponNames.length; j++) {
    var name = weaponNames[j];
    changes[name] = rangeRank[name] - effectiveRank[name];
  }
  return changes;
}

// --- 対オオモノ マトリクス描画 ---
function renderBossMatrix() {
  var container = document.getElementById("tier-container");
  var comingSoon = document.getElementById("coming-soon");
  comingSoon.style.display = "none";

  // ブキを内部番号順で並べる（クマサン印は各カテゴリの最後）
  var weaponNames = [];
  for (var name in BOSS_MATCHUPS) {
    weaponNames.push(name);
  }
  weaponNames.sort(function (a, b) {
    var oa = WEAPON_ORDER[a] != null ? WEAPON_ORDER[a] : 999;
    var ob = WEAPON_ORDER[b] != null ? WEAPON_ORDER[b] : 999;
    return oa - ob;
  });

  // HTML構築（縦=ブキ、横=オオモノ）
  var html = '<div class="boss-matrix-wrapper">';
  html += '<table class="boss-matrix">';

  // ヘッダー行: 空セル + ブキ名(広幅時) + ボスアイコン11体
  html += '<thead><tr>';
  html += '<th class="boss-weapon-col"></th>';
  html += '<th class="boss-weapon-name-col"></th>';
  for (var b = 0; b < BOSS_LIST.length; b++) {
    var boss = BOSS_LIST[b];
    html += '<th class="boss-col-header">';
    html += '<span class="icon-wrap" data-tooltip="' + escapeAttr(boss.name) + '">' +
      '<img class="icon icon-boss" src="' + ICON_DIR + boss.icon +
      '" alt="' + escapeAttr(boss.name) + '">' +
      '</span>';
    html += '</th>';
  }
  html += '</tr></thead>';

  // ブキ行（射程順）
  html += '<tbody>';
  for (var i = 0; i < weaponNames.length; i++) {
    var wName = weaponNames[i];
    var iconSrc = WEAPON_ICONS[wName];
    if (!iconSrc) continue;
    html += '<tr>';
    html += '<td class="boss-weapon-col">';
    html += '<span class="icon-wrap" data-tooltip="' + escapeAttr(wName) + '">' +
      '<img class="icon icon-weapon" src="' + ICON_DIR + iconSrc +
      '" alt="' + escapeAttr(wName) + '">' +
      '</span>';
    html += '</td>';
    html += '<td class="boss-weapon-name-col">' + escapeHtml(wName) + '</td>';

    var matchup = BOSS_MATCHUPS[wName];
    for (var b2 = 0; b2 < BOSS_LIST.length; b2++) {
      var val = matchup ? matchup[BOSS_LIST[b2].key] : 3;
      var rating = RATING_SYMBOLS[val] || RATING_SYMBOLS[3];
      html += '<td class="boss-cell ' + rating.cls + '">' + rating.symbol + '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody>';

  html += '</table>';
  html += '</div>';

  container.innerHTML = html;

  // 横スクロール時にstickyブキ列にシャドウを付ける
  var wrapper = container.querySelector(".boss-matrix-wrapper");
  if (wrapper) {
    wrapper.addEventListener("scroll", function () {
      var isScrolled = wrapper.scrollLeft > 0;
      if (isScrolled) {
        wrapper.classList.add("scrolled");
      } else {
        wrapper.classList.remove("scrolled");
      }
      // 角セルのシャドウも連動
      var cornerEl = document.querySelector(".boss-matrix-floating-corner");
      if (cornerEl) {
        if (isScrolled) {
          cornerEl.classList.add("scrolled");
        } else {
          cornerEl.classList.remove("scrolled");
        }
      }
      // フローティングヘッダーも横スクロール同期
      syncFloatingHeader(wrapper);
    });
  }

  // フローティングヘッダー: ページスクロールでtheadが隠れたら固定表示
  setupFloatingHeader(wrapper);
}

var _floatingCleanup = null;
function setupFloatingHeader(wrapper) {
  // 前回のリスナーを解除
  if (_floatingCleanup) {
    _floatingCleanup();
    _floatingCleanup = null;
  }

  if (!wrapper) return;
  var table = wrapper.querySelector(".boss-matrix");
  var thead = table ? table.querySelector("thead") : null;
  if (!thead) return;

  // フローティングヘッダー要素を作成（ボスアイコン行）
  var floater = document.createElement("div");
  floater.className = "boss-matrix-floating-header";
  floater.style.display = "none";
  document.body.appendChild(floater);

  // 左上角セル（両方向固定・ラベル付き）
  var corner = document.createElement("div");
  corner.className = "boss-matrix-floating-corner";
  corner.innerHTML = '<span class="corner-label-boss">\u5927\u7269</span>' +
    '<span class="corner-label-weapon">\u30D6\u30AD</span>';
  corner.style.display = "none";
  document.body.appendChild(corner);

  function update() {
    var wrapperRect = wrapper.getBoundingClientRect();
    var theadRect = thead.getBoundingClientRect();
    var tableRect = table.getBoundingClientRect();

    var headerEl = document.querySelector("header");
    var headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 0;

    // 元テーブルの左上セル（boss-weapon-col）の幅を取得
    var origCorner = thead.querySelector(".boss-weapon-col");
    var cornerWidth = origCorner ? origCorner.offsetWidth : 48;
    var cornerHeight = thead.offsetHeight;

    if (theadRect.top < headerBottom && tableRect.bottom > headerBottom + cornerHeight) {
      // theadがヘッダーの下に隠れた → フローティング表示
      floater.style.display = "block";
      floater.style.top = headerBottom + "px";
      floater.style.left = wrapperRect.left + "px";
      floater.style.width = wrapperRect.width + "px";

      // 角セルを表示
      corner.style.display = "block";
      corner.style.top = headerBottom + "px";
      corner.style.left = wrapperRect.left + "px";
      corner.style.width = cornerWidth + "px";
      corner.style.height = cornerHeight + "px";

      // thead の中身をコピー（毎回ではなく初回 or サイズ変更時）
      if (!floater._built) {
        var ftable = document.createElement("table");
        ftable.style.width = table.getBoundingClientRect().width + "px";
        var clonedHead = thead.cloneNode(true);
        ftable.appendChild(clonedHead);
        floater.innerHTML = "";
        floater.appendChild(ftable);
        // 各セルの幅を元テーブルに合わせる
        var origCells = thead.querySelectorAll("th");
        var clonedCells = clonedHead.querySelectorAll("th");
        for (var i = 0; i < origCells.length; i++) {
          var w = origCells[i].getBoundingClientRect().width;
          clonedCells[i].style.width = w + "px";
          clonedCells[i].style.minWidth = w + "px";
        }
        floater._built = true;
      }

      // 横スクロール同期
      syncFloatingHeader(wrapper);
    } else {
      floater.style.display = "none";
      corner.style.display = "none";
    }
  }

  function onScroll() { update(); }
  function onResize() { floater._built = false; update(); }

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onResize);

  _floatingCleanup = function () {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    if (floater.parentNode) floater.parentNode.removeChild(floater);
    if (corner.parentNode) corner.parentNode.removeChild(corner);
  };
}

function syncFloatingHeader(wrapper) {
  var floater = document.querySelector(".boss-matrix-floating-header");
  if (!floater || floater.style.display === "none") return;
  var ftable = floater.querySelector("table");
  if (ftable) {
    ftable.style.marginLeft = -wrapper.scrollLeft + "px";
  }
}

// --- ティア描画 ---
function renderTiers(metric) {
  // 前のフローティングヘッダーをクリーンアップ
  if (_floatingCleanup) {
    _floatingCleanup();
    _floatingCleanup = null;
  }

  var container = document.getElementById("tier-container");
  var comingSoon = document.getElementById("coming-soon");
  var methodText = document.getElementById("method-text");
  var methodDetails = document.getElementById("method-details");
  if (methodDetails) methodDetails.removeAttribute("open");

  methodText.innerHTML = METHOD_TEXT[metric] || "";

  // 対オオモノはマトリクス表で表示
  if (metric === 'boss') {
    renderBossMatrix();
    return;
  }

  // スコア付きブキ一覧を作成
  var weapons = [];
  for (var name in WEAPON_RATINGS) {
    var score = WEAPON_RATINGS[name][metric];
    if (score == null) continue;
    weapons.push({ name: name, score: score });
  }

  // データがないメトリクスは準備中表示
  if (weapons.length === 0) {
    container.innerHTML = "";
    comingSoon.style.display = "block";
    return;
  }

  comingSoon.style.display = "none";

  // 最高スコアを100に正規化（handlingはティア値そのものなのでスキップ）
  if (metric !== 'handling') {
    var maxScore = 0;
    weapons.forEach(function (w) {
      if (w.score > maxScore) maxScore = w.score;
    });
    if (maxScore > 0) {
      weapons.forEach(function (w) {
        w.score = Math.round(w.score * 100 / maxScore);
      });
    }
  }

  // ティアごとに分類
  // handlingはティア値そのもの（100/89/75/50/35/20）なので専用境界を使う
  var activeTiers = (metric === 'overall') ? [
    { name: "X",  min: 96, color: "#ff2496" },
    { name: "S+", min: 86, color: "#c77dff" },
    { name: "S",  min: 76, color: "#4a90d9" },
    { name: "A",  min: 66, color: "#ff6b35" },
    { name: "B",  min: 46, color: "#ffd700" },
    { name: "C",  min: 0,  color: "#50c878" }
  ] : (metric === 'paint') ? [
    { name: "X",  min: 96, color: "#ff2496" },
    { name: "S+", min: 81, color: "#c77dff" },
    { name: "S",  min: 66, color: "#4a90d9" },
    { name: "A",  min: 56, color: "#ff6b35" },
    { name: "B",  min: 41, color: "#ffd700" },
    { name: "C",  min: 0,  color: "#50c878" }
  ] : (metric === 'clearing') ? [
    { name: "X",  min: 90, color: "#ff2496" },
    { name: "S+", min: 75, color: "#c77dff" },
    { name: "S",  min: 65, color: "#4a90d9" },
    { name: "A",  min: 55, color: "#ff6b35" },
    { name: "B",  min: 40, color: "#ffd700" },
    { name: "C",  min: 0,  color: "#50c878" }
  ] : (metric === 'range' || metric === 'effectiveRange') ? [
    { name: "X",  min: 90, color: "#ff2496" },
    { name: "S+", min: 70, color: "#c77dff" },
    { name: "S",  min: 60, color: "#4a90d9" },
    { name: "A",  min: 40, color: "#ff6b35" },
    { name: "B",  min: 20, color: "#ffd700" },
    { name: "C",  min: 0,  color: "#50c878" }
  ] : (metric === 'mobility') ? [
    { name: "X",  min: 91, color: "#ff2496" },
    { name: "S+", min: 86, color: "#c77dff" },
    { name: "S",  min: 66, color: "#4a90d9" },
    { name: "A",  min: 56, color: "#ff6b35" },
    { name: "B",  min: 26, color: "#ffd700" },
    { name: "C",  min: 0,  color: "#50c878" }
  ] : (metric === 'handling') ? [
    { name: "X",  min: 100, color: "#ff2496" },
    { name: "S+", min: 90,  color: "#c77dff" },
    { name: "S",  min: 75,  color: "#4a90d9" },
    { name: "A",  min: 50,  color: "#ff6b35" },
    { name: "B",  min: 35,  color: "#ffd700" },
    { name: "C",  min: 0,   color: "#50c878" }
  ] : TIERS;

  var tierData = activeTiers.map(function (t) {
    return { tier: t, items: [] };
  });

  weapons.forEach(function (w) {
    for (var i = 0; i < activeTiers.length; i++) {
      if (w.score >= activeTiers[i].min) {
        tierData[i].items.push(w);
        break;
      }
    }
  });

  // 各ティア内を降順ソート（同スコアはWEAPON_DATAの定義順=内部番号順）
  tierData.forEach(function (td) {
    td.items.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      var orderA = WEAPON_ORDER[a.name]; if (orderA == null) orderA = 999;
      var orderB = WEAPON_ORDER[b.name]; if (orderB == null) orderB = 999;
      return orderA - orderB;
    });
  });

  // 実効射程モード時の順位変動データ
  var rankChanges = null;
  if (metric === 'effectiveRange') {
    rankChanges = calcRankChanges();
  }

  // HTML構築
  var html = "";
  tierData.forEach(function (td) {
    html += '<div class="tier-row">';
    html += '<div class="tier-label" style="background-color:' + td.tier.color + '">' +
      escapeHtml(td.tier.name) + '</div>';
    html += '<div class="tier-items">';
    td.items.forEach(function (w) {
      var iconSrc = WEAPON_ICONS[w.name];
      if (!iconSrc) return;
      html += '<div class="tier-weapon">';
      html += '<span class="icon-wrap" data-tooltip="' + escapeAttr(w.name) + '">' +
        '<img class="icon icon-weapon" src="' + ICON_DIR + iconSrc +
        '" alt="' + escapeAttr(w.name) + '">';
      // 順位変動インジケーター
      if (rankChanges) {
        var change = rankChanges[w.name] || 0;
        if (change > 0) {
          html += '<span class="rank-change rank-up">&#9650;' + change + '</span>';
        } else if (change < 0) {
          html += '<span class="rank-change rank-down">&#9660;' + (-change) + '</span>';
        } else {
          html += '<span class="rank-change rank-same">&minus;</span>';
        }
      }
      html += '</span>';
      if (metric !== 'handling') {
        html += '<span class="tier-score">' + w.score + '</span>';
      }
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// --- タブ切り替え ---
function initTabs() {
  var tabs = document.querySelectorAll(".ranking-tab");
  var toggleContainer = document.getElementById("range-toggle-container");
  var btnNormal = document.getElementById("range-toggle-normal");
  var btnEffective = document.getElementById("range-toggle-effective");

  function setRangeMode(isEffective) {
    effectiveRangeMode = isEffective;
    if (isEffective) {
      btnNormal.classList.remove("active");
      btnEffective.classList.add("active");
      renderTiers("effectiveRange");
    } else {
      btnEffective.classList.remove("active");
      btnNormal.classList.add("active");
      renderTiers("range");
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");

      var metric = tab.dataset.metric;

      // 射程タブならトグルコンテナを表示、それ以外なら非表示にしてリセット
      if (metric === "range") {
        toggleContainer.style.display = "block";
        setRangeMode(effectiveRangeMode);
      } else {
        toggleContainer.style.display = "none";
        effectiveRangeMode = false;
        btnEffective.classList.remove("active");
        btnNormal.classList.add("active");
        renderTiers(metric);
      }
    });
  });

  btnNormal.addEventListener("click", function () {
    setRangeMode(false);
  });

  btnEffective.addEventListener("click", function () {
    setRangeMode(true);
  });
}

// --- ツールチップ ---
function initTooltip() {
  var tip = document.createElement("div");
  tip.id = "tooltip";
  document.body.appendChild(tip);

  document.addEventListener("mouseover", function (e) {
    var wrap = e.target.closest(".icon-wrap");
    if (!wrap) return;
    showTooltip(wrap, tip);
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(".icon-wrap")) {
      tip.classList.remove("visible");
    }
  });

  document.addEventListener("click", function (e) {
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

  // スマホ: シングルタップで即表示（ダブルタップズーム遅延を回避）
  document.addEventListener("touchend", function (e) {
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
  initTabs();
  initTooltip();
  renderTiers("overall");
}

document.addEventListener("DOMContentLoaded", init);
