// Firebase初期化 + 認証ヘルパー
// HTTPS環境でのみFirebaseを有効化、file://ではモックデータにフォールバック
(function () {
  var config = {
    apiKey: "AIzaSyAQVmk-BmHzC8zl3CAlEeYAwO4kHE2TnHA",
    authDomain: "shekenalog.firebaseapp.com",
    projectId: "shekenalog",
    storageBucket: "shekenalog.firebasestorage.app",
    messagingSenderId: "569934297732",
    appId: "1:569934297732:web:d1294eda0a89e8c87ea0d1"
  };

  var available = false;
  var db = null;
  var auth = null;
  var currentUser = null;     // { uid, displayName }
  var authCallbacks = [];

  if (typeof firebase !== "undefined" && location.protocol === "https:") {
    try {
      firebase.initializeApp(config);
      if (typeof firebase.firestore === "function") {
        db = firebase.firestore();
      }
      auth = firebase.auth();
      available = true;

      auth.onAuthStateChanged(function (user) {
        if (user) {
          if (db) {
            db.collection("users").doc(user.uid).get().then(function (doc) {
              if (doc.exists && doc.data().displayName) {
                currentUser = { uid: user.uid, displayName: doc.data().displayName, needsName: false };
                try { localStorage.setItem("fb_displayName", doc.data().displayName); } catch(e) {}
              } else {
                currentUser = { uid: user.uid, displayName: user.displayName || "", needsName: true };
              }
              fireAuthChange();
            });
          } else {
            // Firestore未読込ページ: キャッシュ済み表示名を使用
            var cached = "";
            try { cached = localStorage.getItem("fb_displayName") || ""; } catch(e) {}
            currentUser = { uid: user.uid, displayName: cached || user.displayName || "", needsName: false };
            fireAuthChange();
          }
        } else {
          currentUser = null;
          try { localStorage.removeItem("fb_displayName"); } catch(e) {}
          fireAuthChange();
        }
      });
    } catch (e) {
      available = false;
    }
  }

  function fireAuthChange() {
    for (var i = 0; i < authCallbacks.length; i++) {
      authCallbacks[i](currentUser);
    }
  }

  window.FB = {
    available: available,
    db: db,
    auth: auth,

    get currentUser() { return currentUser; },

    onAuthChange: function (cb) {
      authCallbacks.push(cb);
      // 既にログイン済みなら即通知
      if (currentUser !== null) cb(currentUser);
    },

    signIn: function () {
      if (!auth) return;
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    },

    signOut: function () {
      if (auth) auth.signOut();
    },

    // 表示名をFirestoreに保存
    setDisplayName: function (name, callback) {
      if (!db || !currentUser) return;
      db.collection("users").doc(currentUser.uid).set({
        displayName: name,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true }).then(function () {
        currentUser.displayName = name;
        currentUser.needsName = false;
        try { localStorage.setItem("fb_displayName", name); } catch(e) {}
        fireAuthChange();
        if (callback) callback(null);
      }).catch(function (err) {
        if (callback) callback(err);
      });
    },

    // --- シナリオ CRUD ---

    // 重複チェック（コードをドキュメントIDとして使用）
    checkDuplicate: function (code, callback) {
      if (!db) return callback(null, false);
      var docId = code.replace(/-/g, "");
      db.collection("scenarios").doc(docId).get().then(function (doc) {
        callback(null, doc.exists);
      }).catch(function (err) { callback(err); });
    },

    // シナリオ投稿
    postScenario: function (data, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      var docId = data.code.replace(/-/g, "");

      var weaponsSorted = (data.weapons || []).slice().sort();
      var doc = {
        code: data.code,
        mode: data.mode,
        stage: data.stage,
        danger: data.danger,
        weapons: data.weapons || [],
        weaponsSorted: weaponsSorted,
        scheduleNo: data.scheduleNo || null,
        waves: data.waves,
        extra: data.extra || null,
        isPrivate: data.isPrivate || false,
        comment: data.comment || null,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        postedAt: firebase.firestore.FieldValue.serverTimestamp(),
        bookmarkCount: 0
      };

      db.collection("scenarios").doc(docId).set(doc).then(function () {
        callback(null, docId);
      }).catch(function (err) { callback(err); });
    },

    // 検索 (mode + stage でサーバーフィルタ、残りはクライアント)
    searchScenarios: function (filters, callback) {
      if (!db) return callback(null, []);
      var q = db.collection("scenarios")
        .where("isPrivate", "==", false);
      if (filters.mode) q = q.where("mode", "==", filters.mode);
      if (filters.stage) q = q.where("stage", "==", filters.stage);
      q = q.orderBy("postedAt", "desc").limit(100);

      q.get().then(function (snap) {
        var results = [];
        snap.forEach(function (doc) {
          var d = doc.data();
          d.id = doc.id;
          // postedAtをTimestampから文字列に変換
          if (d.postedAt && d.postedAt.toDate) {
            var dt = d.postedAt.toDate();
            d.postedAt = formatTimestamp(dt);
          }
          results.push(d);
        });
        callback(null, results);
      }).catch(function (err) { callback(err); });
    },

    // 最近の投稿
    getRecent: function (callback) {
      if (!db) return callback(null, []);
      db.collection("scenarios")
        .where("isPrivate", "==", false)
        .orderBy("postedAt", "desc")
        .limit(10)
        .get().then(function (snap) {
          var results = [];
          snap.forEach(function (doc) {
            var d = doc.data();
            d.id = doc.id;
            if (d.postedAt && d.postedAt.toDate) {
              d.postedAt = formatTimestamp(d.postedAt.toDate());
            }
            results.push(d);
          });
          callback(null, results);
        }).catch(function (err) { callback(err); });
    },

    // シナリオ1件取得
    getScenario: function (docId, callback) {
      if (!db) return callback(null, null);
      db.collection("scenarios").doc(docId).get().then(function (doc) {
        if (!doc.exists) return callback(null, null);
        var d = doc.data();
        d.id = doc.id;
        if (d.postedAt && d.postedAt.toDate) {
          d.postedAt = formatTimestamp(d.postedAt.toDate());
        }
        callback(null, d);
      }).catch(function (err) { callback(err); });
    },

    // クリア報告取得
    getClears: function (scenarioId, callback) {
      if (!db) return callback(null, []);
      db.collection("scenarios").doc(scenarioId).collection("clears")
        .orderBy("reportedAt", "desc")
        .get().then(function (snap) {
          var results = [];
          snap.forEach(function (doc) {
            var d = doc.data();
            d.id = doc.id;
            if (d.reportedAt && d.reportedAt.toDate) {
              d.reportedAt = formatTimestamp(d.reportedAt.toDate());
            }
            results.push(d);
          });
          callback(null, results);
        }).catch(function (err) { callback(err); });
    },

    // クリア報告投稿
    postClear: function (scenarioId, data, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      var doc = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        teammates: data.teammates || [],
        waveEggs: data.waveEggs,
        redEggs: data.redEggs,
        bossResult: data.bossResult || null,
        reportedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection("scenarios").doc(scenarioId).collection("clears")
        .add(doc).then(function (ref) {
          callback(null, ref.id);
        }).catch(function (err) { callback(err); });
    }
  };

  function formatTimestamp(date) {
    var y = date.getFullYear();
    var mo = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    var h = ("0" + date.getHours()).slice(-2);
    var mi = ("0" + date.getMinutes()).slice(-2);
    return y + "-" + mo + "-" + d + " " + h + ":" + mi;
  }
})();
