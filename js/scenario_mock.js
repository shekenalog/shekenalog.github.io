// モックデータ（Firebase連携前の仮データ）
// scheduleNo・stage・weapons・bossはSCHEDULE_DATAの実在データに基づく
var MOCK_SCENARIOS = [
  {
    id: "sc001",
    code: "S7KP-ABLM-2CRD-9XYZ",
    mode: "regular",
    stage: "アラマキ砦",
    danger: 300,
    weapons: ["スペースシューター", "ホットブラスター", "パラシェルター", "ジェットスイーパー"],
    scheduleNo: 53,
    waves: [
      { wave: 1, tide: "普通", event: "昼", clear: "GJ" },
      { wave: 2, tide: "満潮", event: "ラッシュ", clear: "GJ" },
      { wave: 3, tide: "干潮", event: "ハコビヤ襲来", clear: "GJ" }
    ],
    extra: { tide: "満潮", boss: "ヨコヅナ" },
    isPrivate: false,
    comment: "WAVE2のラッシュが厳しいけどクリアできた",
    userId: "user001",
    userName: "イカちゃん",
    postedAt: "2026-03-10 18:30",
    bookmarks: 12,
    clears: [
      {
        userName: "タコちゃん",
        teammates: ["イカちゃん", "サーモン太郎", "バイトリーダー"],
        waveEggs: [28, 22, 31],
        bossResult: "GJ",
        redEggs: 210,
        reportedAt: "2026-03-10 20:15"
      },
      {
        userName: "サーモン太郎",
        teammates: ["しゃけ食べたい"],
        waveEggs: [15, 18],
        bossResult: null,
        redEggs: 145,
        reportedAt: "2026-03-11 01:30"
      },
      {
        userName: "バイトリーダー",
        teammates: ["イカちゃん", "タコちゃん", "でんせつのバイトリーダー"],
        waveEggs: [32, 25, 35],
        bossResult: "GJ",
        redEggs: 280,
        reportedAt: "2026-03-11 14:00"
      }
    ]
  },
  {
    id: "sc002",
    code: "SRTM-K4NX-7PLQ-BJHW",
    mode: "regular",
    stage: "ムニ・エール海洋発電所",
    danger: 333,
    weapons: ["プロモデラーMG", "プライムシューター", "オーバーフロッシャー", "Rブラスターエリート"],
    scheduleNo: 50,
    waves: [
      { wave: 1, tide: "満潮", event: "霧", clear: "GJ" },
      { wave: 2, tide: "普通", event: "キンシャケ探し", clear: "GJ" },
      { wave: 3, tide: "普通", event: "昼", clear: "NG" }
    ],
    extra: null,
    isPrivate: false,
    comment: "WAVE3で全滅。キケン度MAXはさすがに厳しい",
    userId: "user002",
    userName: "でんせつのバイトリーダー",
    postedAt: "2026-03-11 09:15",
    bookmarks: 5,
    clears: [
      {
        userName: "イカちゃん",
        teammates: ["タコちゃん", "しゃけ食べたい", "バイトリーダー"],
        waveEggs: [20, 24, 18],
        bossResult: null,
        redEggs: 4850,
        reportedAt: "2026-03-11 22:00"
      },
      {
        userName: "でんせつのバイトリーダー",
        teammates: ["サーモン太郎", "ナワバリ職人", "イカちゃん"],
        waveEggs: [30, 28, 22],
        bossResult: null,
        redEggs: 5200,
        reportedAt: "2026-03-12 01:00"
      },
      {
        userName: "タコちゃん",
        teammates: ["イカちゃん", "バイトリーダー"],
        waveEggs: [18, 15, 20],
        bossResult: null,
        redEggs: 3800,
        reportedAt: "2026-03-12 10:30"
      },
      {
        userName: "しゃけ食べたい",
        teammates: ["サーモン太郎", "タコちゃん", "ナワバリ職人"],
        waveEggs: [25, 30, 24],
        bossResult: null,
        redEggs: 5500,
        reportedAt: "2026-03-12 14:00"
      },
      {
        userName: "バイトリーダー",
        teammates: ["でんせつのバイトリーダー"],
        waveEggs: [12, 10],
        bossResult: null,
        redEggs: 2900,
        reportedAt: "2026-03-12 18:00"
      },
      {
        userName: "サーモン太郎",
        teammates: ["イカちゃん", "タコちゃん", "しゃけ食べたい"],
        waveEggs: [22, 26, 20],
        bossResult: null,
        redEggs: 4200,
        reportedAt: "2026-03-13 09:00"
      }
    ]
  },
  {
    id: "sc003",
    code: "SWQE-8DNR-YPTL-3FGV",
    mode: "regular",
    stage: "シェケナダム",
    danger: 260,
    weapons: ["スプラシューター", "ホクサイ", "ラピッドブラスター", "リッター4K"],
    scheduleNo: 51,
    waves: [
      { wave: 1, tide: "干潮", event: "ハコビヤ襲来", clear: "GJ" },
      { wave: 2, tide: "満潮", event: "昼", clear: "GJ" },
      { wave: 3, tide: "普通", event: "グリル発進", clear: "GJ" }
    ],
    extra: { tide: "普通", boss: "ヨコヅナ" },
    isPrivate: false,
    comment: null,
    userId: "user003",
    userName: "しゃけ食べたい",
    postedAt: "2026-03-09 22:00",
    bookmarks: 8,
    clears: [
      {
        userName: "イカちゃん",
        teammates: ["タコちゃん", "しゃけ食べたい", "バイトリーダー"],
        waveEggs: [30, 28, 26],
        bossResult: "GJ",
        redEggs: 250,
        reportedAt: "2026-03-10 10:00"
      },
      {
        userName: "しゃけ食べたい",
        teammates: ["サーモン太郎", "ナワバリ職人"],
        waveEggs: [22, 20, 19],
        bossResult: "NG",
        redEggs: 190,
        reportedAt: "2026-03-10 15:30"
      }
    ]
  },
  {
    id: "sc004",
    code: "SMNB-CVXZ-LKJH-GFDS",
    mode: "private",
    stage: "難破船ドン・ブラコ",
    danger: 150,
    weapons: [],
    scheduleNo: null,
    waves: [
      { wave: 1, tide: "普通", event: "ドロシャケ噴出", clear: "GJ" },
      { wave: 2, tide: "満潮", event: "昼", clear: "GJ" },
      { wave: 3, tide: "普通", event: "霧", clear: "GJ" }
    ],
    extra: null,
    isPrivate: false,
    comment: "プラベで遊んだシナリオ。ドロシャケが楽しい",
    userId: "user004",
    userName: "サーモン太郎",
    postedAt: "2026-03-11 15:45",
    bookmarks: 3,
    clears: [
      {
        userName: "サーモン太郎",
        teammates: ["しゃけ食べたい"],
        waveEggs: [18, 20, 15],
        bossResult: null,
        redEggs: 130,
        reportedAt: "2026-03-11 16:00"
      }
    ]
  },
  {
    id: "sc005",
    code: "SQWE-RTYU-IOPA-SDFG",
    mode: "regular",
    stage: "すじこジャンクション跡",
    danger: 280,
    weapons: ["ボールドマーカー", "バケットスロッシャー", "S-BLAST92", "スプラチャージャー"],
    scheduleNo: 161,
    waves: [
      { wave: 1, tide: "満潮", event: "グリル発進", clear: "GJ" },
      { wave: 2, tide: "普通", event: "昼", clear: "GJ" },
      { wave: 3, tide: "干潮", event: "ハコビヤ襲来", clear: "GJ" }
    ],
    extra: { tide: "普通", boss: "タツ" },
    isPrivate: false,
    comment: "タツ倒せた！干潮ハコビヤがキツかった",
    userId: "user001",
    userName: "イカちゃん",
    postedAt: "2026-03-08 20:10",
    bookmarks: 21,
    clears: [
      {
        userName: "イカちゃん",
        teammates: ["タコちゃん", "でんせつのバイトリーダー", "しゃけ食べたい"],
        waveEggs: [35, 30, 28],
        bossResult: "GJ",
        redEggs: 320,
        reportedAt: "2026-03-08 21:00"
      },
      {
        userName: "でんせつのバイトリーダー",
        teammates: ["バイトリーダー", "ナワバリ職人", "サーモン太郎"],
        waveEggs: [28, 32, 25],
        bossResult: "GJ",
        redEggs: 290,
        reportedAt: "2026-03-09 11:00"
      },
      {
        userName: "ナワバリ職人",
        teammates: ["イカちゃん"],
        waveEggs: [12, 15],
        bossResult: null,
        redEggs: 95,
        reportedAt: "2026-03-10 08:30"
      }
    ]
  },
  {
    id: "sc006",
    code: "SZXC-VBNM-ASDF-GHJK",
    mode: "regular",
    stage: "どんぴこ闘技場",
    danger: 310,
    weapons: ["N-ZAP85", "ガエンFF", "モップリン", "スクイックリンα"],
    scheduleNo: 324,
    waves: [
      { wave: 1, tide: "普通", event: "巨大タツマキ", clear: null },
      { wave: 2, tide: null, event: null, clear: null },
      { wave: 3, tide: null, event: null, clear: null }
    ],
    extra: null,
    isPrivate: false,
    comment: "WAVE1の巨大タツマキどうすればいいの",
    userId: "user005",
    userName: "バイトリーダー",
    postedAt: "2026-03-12 01:20",
    bookmarks: 0,
    clears: []
  },
  {
    id: "sc007",
    code: "SPLQ-WERT-YUIO-ZXCV",
    mode: "regular",
    stage: "すじこジャンクション跡",
    danger: 290,
    weapons: ["？", "？", "？", "？"],
    scheduleNo: 183,
    waves: [
      { wave: 1, tide: "干潮", event: "昼", clear: "GJ" },
      { wave: 2, tide: "普通", event: "ドスコイ大量発生", clear: "NG" }
    ],
    extra: null,
    isPrivate: false,
    comment: "オールランダム回。WAVE2のドスコイで壊滅",
    userId: "user002",
    userName: "でんせつのバイトリーダー",
    postedAt: "2026-03-07 12:30",
    bookmarks: 15,
    clears: [
      {
        userName: "でんせつのバイトリーダー",
        teammates: ["イカちゃん", "タコちゃん"],
        waveEggs: [20, 10],
        bossResult: null,
        redEggs: 110,
        reportedAt: "2026-03-07 13:00"
      }
    ]
  },
  {
    id: "sc008",
    code: "SHJK-LMNB-VCXZ-QWER",
    mode: "regular",
    stage: "トキシラズいぶし工房",
    danger: 200,
    weapons: [".52ガロン", "モップリン", "フィンセント", "スクイックリンα"],
    scheduleNo: 217,
    waves: [
      { wave: 1, tide: "普通", event: "昼", clear: "GJ" },
      { wave: 2, tide: "普通", event: "昼", clear: "GJ" },
      { wave: 3, tide: "満潮", event: "霧", clear: "GJ" }
    ],
    extra: { tide: "満潮", boss: "タツ" },
    isPrivate: false,
    comment: "塗り編成で安定クリア。初心者にもおすすめ",
    userId: "user003",
    userName: "しゃけ食べたい",
    postedAt: "2026-03-06 16:00",
    bookmarks: 9,
    clears: [
      {
        userName: "しゃけ食べたい",
        teammates: ["イカちゃん", "バイトリーダー", "サーモン太郎"],
        waveEggs: [25, 22, 20],
        bossResult: "GJ",
        redEggs: 200,
        reportedAt: "2026-03-06 17:00"
      },
      {
        userName: "イカちゃん",
        teammates: ["タコちゃん", "しゃけ食べたい", "ナワバリ職人"],
        waveEggs: [30, 28, 25],
        bossResult: "GJ",
        redEggs: 240,
        reportedAt: "2026-03-07 09:00"
      }
    ]
  }
];
