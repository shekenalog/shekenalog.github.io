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
                try { localStorage.setItem("fb_displayName", doc.data().displayName); localStorage.setItem("fb_uid", user.uid); } catch(e) {}
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
          try { localStorage.removeItem("fb_displayName"); localStorage.removeItem("fb_uid"); } catch(e) {}
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

  // UIDからアバター背景色を決定（Google方式: ハッシュで14色から選択）
  var AVATAR_COLORS = [
    "#e53935", "#d81b60", "#8e24aa", "#5e35b1",
    "#3949ab", "#1e88e5", "#00897b", "#43a047",
    "#7cb342", "#c0ca33", "#ffb300", "#fb8c00",
    "#f4511e", "#6d4c41"
  ];
  function avatarColor(uid) {
    if (!uid) return AVATAR_COLORS[0];
    var hash = 0;
    for (var i = 0; i < uid.length; i++) {
      hash = ((hash << 5) - hash + uid.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  window.FB = {
    available: available,
    db: db,
    auth: auth,
    avatarColor: avatarColor,

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
        try { localStorage.setItem("fb_displayName", name); localStorage.setItem("fb_uid", currentUser.uid); } catch(e) {}
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

    // 自分の投稿シナリオ一覧
    getMyScenarios: function (callback) {
      if (!db || !currentUser) return callback(null, []);
      db.collection("scenarios")
        .where("userId", "==", currentUser.uid)
        .orderBy("postedAt", "desc")
        .limit(50)
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

    // 自分のクリア報告一覧（全シナリオ横断: collectionGroup）
    getMyClears: function (callback) {
      if (!db || !currentUser) return callback(null, []);
      db.collectionGroup("clears")
        .where("userId", "==", currentUser.uid)
        .orderBy("reportedAt", "desc")
        .limit(50)
        .get().then(function (snap) {
          var results = [];
          snap.forEach(function (doc) {
            var d = doc.data();
            d.id = doc.id;
            d.scenarioId = doc.ref.parent.parent.id;
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
    },

    // --- ブックマーク ---

    // ブックマークトグル（追加/削除 + カウント更新をバッチ処理）
    toggleBookmark: function (scenarioId, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      var bmDocId = scenarioId + "_" + currentUser.uid;
      var bmRef = db.collection("bookmarks").doc(bmDocId);
      var scenarioRef = db.collection("scenarios").doc(scenarioId);

      bmRef.get().then(function (doc) {
        var batch = db.batch();
        var wasBookmarked = doc.exists;

        if (wasBookmarked) {
          batch.delete(bmRef);
          batch.update(scenarioRef, {
            bookmarkCount: firebase.firestore.FieldValue.increment(-1)
          });
        } else {
          batch.set(bmRef, {
            scenarioId: scenarioId,
            userId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          batch.update(scenarioRef, {
            bookmarkCount: firebase.firestore.FieldValue.increment(1)
          });
        }

        return batch.commit().then(function () {
          // ローカルのbookmarkSetも更新
          if (wasBookmarked) {
            bookmarkSet["delete"](scenarioId);
          } else {
            bookmarkSet.add(scenarioId);
          }
          callback(null, { bookmarked: !wasBookmarked });
        });
      }).catch(function (err) { callback(err); });
    },

    // 自分のブックマーク済みシナリオIDセットを取得（ページロード時に1回呼ぶ）
    loadMyBookmarks: function (callback) {
      if (!db || !currentUser) { bookmarkSet = new Set(); return callback(null, bookmarkSet); }
      db.collection("bookmarks")
        .where("userId", "==", currentUser.uid)
        .get().then(function (snap) {
          bookmarkSet = new Set();
          snap.forEach(function (doc) {
            bookmarkSet.add(doc.data().scenarioId);
          });
          callback(null, bookmarkSet);
        }).catch(function (err) { callback(err); });
    },

    // --- 個人記録 ---

    // 個人記録を保存（新規 or 更新）
    savePersonalRecord: function (record, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      var docId = currentUser.uid + "_" + record.id;
      var doc = JSON.parse(JSON.stringify(record));
      doc.userId = currentUser.uid;
      doc.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      db.collection("personalRecords").doc(docId).set(doc).then(function () {
        callback(null);
      }).catch(function (err) { callback(err); });
    },

    // 個人記録を全件取得
    getPersonalRecords: function (callback) {
      if (!db || !currentUser) return callback(null, []);
      db.collection("personalRecords")
        .where("userId", "==", currentUser.uid)
        .get().then(function (snap) {
          var results = [];
          snap.forEach(function (doc) {
            var d = doc.data();
            // serverTimestampをミリ秒に変換
            if (d.updatedAt && d.updatedAt.toDate) {
              d.updatedAt = d.updatedAt.toDate().getTime();
            }
            results.push(d);
          });
          callback(null, results);
        }).catch(function (err) { callback(err); });
    },

    // 個人記録を削除
    deletePersonalRecord: function (recordId, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      var docId = currentUser.uid + "_" + recordId;
      db.collection("personalRecords").doc(docId).delete().then(function () {
        callback(null);
      }).catch(function (err) { callback(err); });
    },

    // localStorageの記録をFirestoreにマージ
    mergeLocalRecords: function (localRecords, callback) {
      if (!db || !currentUser) return callback(new Error("ログインが必要です"));
      if (!localRecords || localRecords.length === 0) return callback(null);

      // 既存のFirestoreデータを取得
      var self = this;
      self.getPersonalRecords(function (err, firestoreRecords) {
        if (err) return callback(err);

        // 既存IDセット
        var existingIds = {};
        firestoreRecords.forEach(function (r) { existingIds[r.id] = true; });

        // 重複しないローカル記録をFirestoreに追加
        var batch = db.batch();
        var count = 0;
        localRecords.forEach(function (r) {
          if (existingIds[r.id]) return; // 重複スキップ
          var docId = currentUser.uid + "_" + r.id;
          var doc = JSON.parse(JSON.stringify(r));
          doc.userId = currentUser.uid;
          doc.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
          batch.set(db.collection("personalRecords").doc(docId), doc);
          count++;
        });

        if (count === 0) return callback(null);

        batch.commit().then(function () {
          callback(null);
        }).catch(function (err) { callback(err); });
      });
    },

    // ブックマーク済みかチェック（loadMyBookmarks後に使う）
    isBookmarked: function (scenarioId) {
      return bookmarkSet.has(scenarioId);
    },

    // ブックマークしたシナリオ一覧を取得
    getMyBookmarkedScenarios: function (callback) {
      if (!db || !currentUser) return callback(null, []);
      db.collection("bookmarks")
        .where("userId", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .limit(50)
        .get().then(function (snap) {
          var ids = [];
          snap.forEach(function (doc) { ids.push(doc.data().scenarioId); });
          if (ids.length === 0) return callback(null, []);

          // シナリオ本体を取得（10件ずつwhereInで分割）
          var chunks = [];
          for (var i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
          }
          var results = [];
          var done = 0;
          for (var c = 0; c < chunks.length; c++) {
            (function (chunk) {
              db.collection("scenarios").where(firebase.firestore.FieldPath.documentId(), "in", chunk)
                .get().then(function (snap2) {
                  snap2.forEach(function (doc2) {
                    var d = doc2.data();
                    d.id = doc2.id;
                    if (d.postedAt && d.postedAt.toDate) {
                      d.postedAt = formatTimestamp(d.postedAt.toDate());
                    }
                    results.push(d);
                  });
                  done++;
                  if (done === chunks.length) {
                    // ブックマーク順（createdAt desc）に並べ直す
                    var order = {};
                    for (var j = 0; j < ids.length; j++) order[ids[j]] = j;
                    results.sort(function (a, b) { return (order[a.id] || 0) - (order[b.id] || 0); });
                    callback(null, results);
                  }
                }).catch(function (err) { callback(err); });
            })(chunks[c]);
          }
        }).catch(function (err) { callback(err); });
    }
  };

  var bookmarkSet = new Set();

  function formatTimestamp(date) {
    var y = date.getFullYear();
    var mo = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    var h = ("0" + date.getHours()).slice(-2);
    var mi = ("0" + date.getMinutes()).slice(-2);
    return y + "-" + mo + "-" + d + " " + h + ":" + mi;
  }
})();
