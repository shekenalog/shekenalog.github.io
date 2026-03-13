// バイトシナリオ投稿ページ
(function () {
  var ICON_DIR = "png/";
  var useFirebase = window.FB && window.FB.available;

  // === 認証UI ===
  var authLoginBtn = document.getElementById("auth-login-btn");
  var authUserInfo = document.getElementById("auth-user-info");
  var authAvatar = document.getElementById("auth-avatar");
  var authNameLabel = document.getElementById("auth-user-name-label");

  if (useFirebase) {
    // キャッシュでログイン済み推定 → チラつき防止
    var cachedName = "";
    var cachedUid = "";
    try { cachedName = localStorage.getItem("fb_displayName") || ""; cachedUid = localStorage.getItem("fb_uid") || ""; } catch(e) {}
    if (cachedName) {
      authLoginBtn.style.display = "none";
      authUserInfo.style.display = "";
      if (cachedUid) authAvatar.style.backgroundColor = FB.avatarColor(cachedUid);
      var ch = cachedName.charAt(0);
      var isJpChar = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFFa-zA-Z0-9]/.test(ch);
      if (isJpChar) { authAvatar.textContent = ch; } else {
        authAvatar.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
      }
      if (authNameLabel) authNameLabel.textContent = cachedName;
    } else {
      authLoginBtn.style.display = "";
    }
    FB.onAuthChange(function (user) {
      if (user) {
        if (user.needsName) {
          showNameModal(user.displayName);
          return;
        }
        authLoginBtn.style.display = "none";
        authUserInfo.style.display = "";
        authAvatar.style.backgroundColor = FB.avatarColor(user.uid);
        var ch = (user.displayName || "").charAt(0);
        var isJpChar = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFFa-zA-Z0-9]/.test(ch);
        if (isJpChar) {
          authAvatar.textContent = ch;
        } else {
          authAvatar.textContent = "";
          authAvatar.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
        }
        authAvatar.title = user.displayName;
        if (authNameLabel) authNameLabel.textContent = user.displayName;
      } else {
        authLoginBtn.style.display = "";
        authUserInfo.style.display = "none";
        authAvatar.textContent = "";
        if (authNameLabel) authNameLabel.textContent = "";
      }
    });
    authLoginBtn.addEventListener("click", function () { FB.signIn(); });
    authAvatar.addEventListener("click", function () {
      window.location.href = "profile.html";
    });
  }

  // 初回ログイン: 表示名設定モーダル
  function showNameModal(defaultName) {
    var overlay = document.createElement("div");
    overlay.className = "name-modal-overlay";
    var modal = document.createElement("div");
    modal.className = "name-modal";
    var title = document.createElement("div");
    title.className = "name-modal-title";
    title.textContent = "表示名を設定してください";
    modal.appendChild(title);
    var desc = document.createElement("div");
    desc.className = "name-modal-desc";
    desc.textContent = "この名前が投稿時に表示されます。あとから変更できます。";
    modal.appendChild(desc);
    var input = document.createElement("input");
    input.type = "text";
    input.className = "name-modal-input";
    input.value = defaultName || "";
    input.maxLength = 14;
    input.placeholder = "14文字以内";
    modal.appendChild(input);
    var btnRow = document.createElement("div");
    btnRow.className = "name-modal-btns";
    var okBtn = document.createElement("button");
    okBtn.className = "name-modal-ok";
    okBtn.textContent = "決定";
    btnRow.appendChild(okBtn);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    input.focus();
    input.select();

    okBtn.addEventListener("click", function () {
      var name = input.value.trim();
      if (!name) { alert("表示名を入力してください。"); return; }
      if (name.length > 14) { alert("14文字以内で入力してください。"); return; }
      okBtn.disabled = true;
      FB.setDisplayName(name, function (err) {
        if (err) { alert("保存に失敗しました: " + err.message); okBtn.disabled = false; return; }
        document.body.removeChild(overlay);
      });
    });
  }
  // file://では認証エリア非表示のまま

  var STAGE_ICONS_HIGH = {
    "シェケナダム": "stage_spawning_grounds_high.jpg",
    "難破船ドン・ブラコ": "stage_marooners_bay_high.jpg",
    "アラマキ砦": "stage_sockeye_station_high.jpg",
    "ムニ・エール海洋発電所": "stage_gone_fission_hydroplant_high.jpg",
    "すじこジャンクション跡": "stage_jammin_salmon_junction_high.jpg",
    "トキシラズいぶし工房": "stage_salmonid_smokeyard_high.jpg",
    "どんぴこ闘技場": "stage_bonerattle_arena_high.jpg"
  };

  // シナリオ機能実装日(JST) — これ以前の開催回はマッチ対象外
  var SCENARIO_START = new Date(2022, 11, 1, 9, 0); // 2022-12-01 09:00 JST

  // 存在しないWAVE組み合わせ
  var INVALID_WAVE_COMBOS = [
    ["干潮", "ラッシュ"],
    ["干潮", "グリル発進"],
    ["普通", "ドスコイ大量発生"],
    ["満潮", "ドスコイ大量発生"],
    ["干潮", "キンシャケ探し"],
    ["干潮", "ドロシャケ噴出"],
    ["普通", "巨大タツマキ"],
    ["満潮", "巨大タツマキ"]
  ];

  // --- 状態 ---
  var currentMode = "regular"; // "regular" | "private"
  var selectedWeapons = [];    // [{name, icon}]
  var popupSelectedWeapons = []; // マルチセレクト用 [{name, icon}]
  var matchedScheduleNo = null;

  // --- DOM ---
  var btnPost = document.getElementById("btn-post");
  var btnSearch = document.getElementById("btn-search");
  var actionsSection = document.getElementById("scenario-actions");
  var postSection = document.getElementById("post-section");
  var scenarioCode = document.getElementById("scenario-code");
  var modeBtns = document.querySelectorAll(".mode-btn");
  var stageSelect = document.getElementById("stage-select");
  var dangerInput = document.getElementById("danger-input");
  var weaponSection = document.getElementById("weapon-section");
  var weaponSlots = document.getElementById("weapon-slots");
  var weaponAddBtn = document.getElementById("weapon-add-btn");
  var matchResult = document.getElementById("match-result");
  var privateCheck = document.getElementById("private-check");
  var commentInput = document.getElementById("comment-input");
  var charCount = document.getElementById("char-count");
  var submitBtn = document.getElementById("submit-btn");
  var popupOverlay = document.getElementById("weapon-popup-overlay");
  var popupGrid = document.getElementById("weapon-popup-grid");
  var popupOk = document.getElementById("weapon-popup-ok");
  var popupCancel = document.getElementById("weapon-popup-cancel");
  var backLink = document.getElementById("back-link");
  var privateCard = document.getElementById("private-card");
  var popupPreview = document.getElementById("weapon-popup-preview");

  // 投稿・戻るボタンは後段のビュー管理で制御

  // === 非公開チェックボックス（カード全体クリック） ===
  privateCard.addEventListener("click", function () {
    privateCheck.checked = !privateCheck.checked;
    privateCard.classList.toggle("checked", privateCheck.checked);
  });

  // === モード切替 ===
  for (var i = 0; i < modeBtns.length; i++) {
    modeBtns[i].addEventListener("click", function () {
      for (var j = 0; j < modeBtns.length; j++) modeBtns[j].classList.remove("active");
      this.classList.add("active");
      currentMode = this.getAttribute("data-mode");
      applyMode();
    });
  }

  function applyMode() {
    var extraCard = document.querySelector('.wave-card-extra');
    var extraSelects = extraCard ? extraCard.querySelectorAll('select') : [];
    var weaponReqTag = weaponSection.closest('.form-row').querySelector('.form-required-tag');
    var extraTitle = extraCard ? extraCard.querySelector('.wave-card-title') : null;

    if (currentMode === "private") {
      // ブキクリア＆無効化
      selectedWeapons = [];
      renderWeaponSlots();
      weaponSection.classList.add("weapon-section-disabled");
      stageSelect.disabled = false;
      matchResult.textContent = "";
      matchedScheduleNo = null;
      // EX-WAVE無効化
      extraCard.style.opacity = "0.35";
      extraCard.style.pointerEvents = "none";
      for (var i = 0; i < extraSelects.length; i++) {
        extraSelects[i].disabled = true;
        extraSelects[i].value = "";
      }
      // 必須バッジ非表示
      if (weaponReqTag) weaponReqTag.style.display = "none";
    } else {
      weaponSection.classList.remove("weapon-section-disabled");
      // いつものバイト: ブキ4つ揃ったらステージは自動
      if (selectedWeapons.length === 4 && matchedScheduleNo) {
        stageSelect.disabled = true;
      } else {
        stageSelect.disabled = false;
      }
      // EX-WAVE有効化
      extraCard.style.opacity = "";
      extraCard.style.pointerEvents = "";
      for (var i = 0; i < extraSelects.length; i++) {
        extraSelects[i].disabled = false;
      }
      // 必須バッジ表示
      if (weaponReqTag) weaponReqTag.style.display = "";
    }
    validateDanger();
  }

  // === シナリオコード入力 ===
  scenarioCode.addEventListener("input", function () {
    // 大文字化 & ハイフン自動挿入
    var v = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    var parts = [];
    for (var i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, Math.min(i + 4, v.length)));
    }
    this.value = parts.join("-");
  });

  // === キケン度バリデーション ===
  dangerInput.addEventListener("blur", function () {
    validateDanger();
  });

  dangerInput.addEventListener("input", function () {
    // 半角数字のみ許可
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  function validateDanger() {
    var v = parseInt(dangerInput.value, 10);
    if (dangerInput.value === "" || isNaN(v)) return;
    var min = 0, max = 333;
    if (currentMode === "private") { min = 5; max = 200; }
    if (v < min || v > max) {
      alert("キケン度は" + min + "〜" + max + "%の範囲で入力してください。");
      dangerInput.value = "";
    }
  }

  // === ブキ選択ポップアップ（マルチセレクト） ===
  // ランダム枠の定義（WEAPON_ICONSに含まれないものを手動追加）
  var RANDOM_WEAPONS = [
    { name: "？", icon: "weapon_random.png", title: "ランダム" },
    { name: "？(金)", icon: "weapon_random_rare.png", title: "金ランダム" }
  ];

  function buildPopupGrid() {
    popupGrid.innerHTML = "";
    var names = Object.keys(WEAPON_ICONS);
    // 通常ブキ（クマサン印・？を除外）
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (name === "？") continue;
      if (name.indexOf("クマサン印") === 0) continue;
      addPopupItem(name, WEAPON_ICONS[name], name);
    }
    // ランダム枠を末尾に追加
    for (var r = 0; r < RANDOM_WEAPONS.length; r++) {
      addPopupItem(RANDOM_WEAPONS[r].name, RANDOM_WEAPONS[r].icon, RANDOM_WEAPONS[r].title);
    }
  }

  var RANDOM_NAMES = ["？", "？(金)"];

  function isRandomWeapon(name) {
    return RANDOM_NAMES.indexOf(name) >= 0;
  }

  function getRandomCount(name) {
    var count = 0;
    for (var i = 0; i < popupSelectedWeapons.length; i++) {
      if (popupSelectedWeapons[i].name === name) count++;
    }
    return count;
  }

  function addPopupItem(name, iconFile, title) {
    var item = document.createElement("div");
    item.className = "weapon-popup-item";
    if (isRandomWeapon(name)) item.classList.add("weapon-popup-random");
    item.setAttribute("data-weapon", name);
    item.setAttribute("data-icon", iconFile);
    item.title = title;
    var img = document.createElement("img");
    img.src = ICON_DIR + iconFile;
    img.alt = title;
    item.appendChild(img);
    // バッジ（ランダム用）
    if (isRandomWeapon(name)) {
      var badge = document.createElement("span");
      badge.className = "weapon-popup-badge";
      item.appendChild(badge);
    }
    item.addEventListener("click", function () {
      var wName = this.getAttribute("data-weapon");
      var wIcon = this.getAttribute("data-icon");
      var totalCount = getBaseWeaponsForPopup().length + popupSelectedWeapons.length;

      if (isRandomWeapon(wName)) {
        // ランダム: クリックで+1（上限まで）
        if (totalCount < 4) {
          popupSelectedWeapons.push({ name: wName, icon: wIcon });
        }
      } else {
        // 通常ブキ: トグル
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          for (var r = 0; r < popupSelectedWeapons.length; r++) {
            if (popupSelectedWeapons[r].name === wName) {
              popupSelectedWeapons.splice(r, 1);
              break;
            }
          }
        } else {
          if (totalCount >= 4) return;
          this.classList.add("selected");
          popupSelectedWeapons.push({ name: wName, icon: wIcon });
        }
      }
      updatePopupDisabled();
    });
    popupGrid.appendChild(item);
  }
  buildPopupGrid();

  function getBaseWeaponsForPopup() {
    return searchPopupMode ? searchSelectedWeapons : selectedWeapons;
  }

  function updatePopupDisabled() {
    var baseWeapons = getBaseWeaponsForPopup();
    var totalCount = baseWeapons.length + popupSelectedWeapons.length;
    var items = popupGrid.querySelectorAll(".weapon-popup-item");
    for (var i = 0; i < items.length; i++) {
      var wName = items[i].getAttribute("data-weapon");
      // ランダムのバッジ更新
      if (isRandomWeapon(wName)) {
        var cnt = getRandomCount(wName);
        var badge = items[i].querySelector(".weapon-popup-badge");
        if (cnt > 0) {
          badge.textContent = cnt;
          badge.style.display = "";
          items[i].classList.add("selected");
        } else {
          badge.textContent = "";
          badge.style.display = "none";
          items[i].classList.remove("selected");
        }
        if (totalCount >= 4 && cnt === 0) {
          items[i].classList.add("popup-disabled");
        } else {
          items[i].classList.remove("popup-disabled");
        }
        continue;
      }
      if (items[i].classList.contains("selected")) {
        items[i].classList.remove("popup-disabled");
      } else if (totalCount >= 4) {
        items[i].classList.add("popup-disabled");
      } else {
        items[i].classList.remove("popup-disabled");
      }
    }
    renderPopupPreview();
  }

  function renderPopupPreview() {
    popupPreview.innerHTML = "";
    var all = getBaseWeaponsForPopup().concat(popupSelectedWeapons);
    for (var i = 0; i < 4; i++) {
      var slot = document.createElement("div");
      slot.className = "weapon-popup-preview-slot";
      if (i < all.length) {
        slot.classList.add("filled");
        var img = document.createElement("img");
        img.src = ICON_DIR + all[i].icon;
        img.alt = all[i].name;
        slot.appendChild(img);
      }
      popupPreview.appendChild(slot);
    }
  }

  weaponAddBtn.addEventListener("click", function () {
    if (selectedWeapons.length >= 4) return;
    searchPopupMode = false;
    popupSelectedWeapons = [];
    // 選択状態リセット
    var items = popupGrid.querySelectorAll(".weapon-popup-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("selected");
      items[i].classList.remove("popup-disabled");
      var badge = items[i].querySelector(".weapon-popup-badge");
      if (badge) { badge.textContent = ""; badge.style.display = "none"; }
    }
    renderPopupPreview();
    popupOverlay.classList.add("active");
  });

  popupCancel.addEventListener("click", function () {
    popupOverlay.classList.remove("active");
    searchPopupMode = false;
  });

  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("active");
      searchPopupMode = false;
    }
  });

  popupOk.addEventListener("click", function () {
    if (popupSelectedWeapons.length === 0) return;
    if (searchPopupMode) {
      // 検索用ブキに追加
      for (var i = 0; i < popupSelectedWeapons.length; i++) {
        if (searchSelectedWeapons.length >= 4) break;
        searchSelectedWeapons.push(popupSelectedWeapons[i]);
      }
      popupOverlay.classList.remove("active");
      searchPopupMode = false;
      renderSearchWeaponSlots();
    } else {
      // 投稿用ブキに追加
      for (var i = 0; i < popupSelectedWeapons.length; i++) {
        if (selectedWeapons.length >= 4) break;
        selectedWeapons.push(popupSelectedWeapons[i]);
      }
      popupOverlay.classList.remove("active");
      renderWeaponSlots();
      if (selectedWeapons.length === 4) {
        tryMatchSchedule();
      }
    }
  });

  function renderWeaponSlots() {
    weaponSlots.innerHTML = "";
    for (var i = 0; i < selectedWeapons.length; i++) {
      var slot = document.createElement("div");
      slot.className = "weapon-slot";
      var img = document.createElement("img");
      img.src = ICON_DIR + selectedWeapons[i].icon;
      img.alt = selectedWeapons[i].name;
      img.title = selectedWeapons[i].name;
      slot.appendChild(img);
      var removeBtn = document.createElement("button");
      removeBtn.className = "weapon-slot-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("data-index", i);
      removeBtn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        selectedWeapons.splice(idx, 1);
        matchedScheduleNo = null;
        matchResult.textContent = "";
        matchResult.className = "match-result";
        stageSelect.disabled = false;
        renderWeaponSlots();
      });
      slot.appendChild(removeBtn);
      weaponSlots.appendChild(slot);
    }
    // ＋ボタンの状態
    weaponAddBtn.disabled = selectedWeapons.length >= 4;
  }

  // === 開催No.自動マッチ ===
  function tryMatchSchedule() {
    if (typeof SCHEDULE_DATA === "undefined") return;

    var inputSet = [];
    for (var i = 0; i < selectedWeapons.length; i++) {
      // 金ランダムも通常ランダムと同じ"？"として比較
      var wn = selectedWeapons[i].name === "？(金)" ? "？" : selectedWeapons[i].name;
      inputSet.push(wn);
    }
    inputSet.sort();

    var bestNo = null;
    var bestRec = null;

    for (var j = 0; j < SCHEDULE_DATA.length; j++) {
      var rec = SCHEDULE_DATA[j];
      // ビッグラン/ビッグビッグランは対象外
      if (rec.eventType === "bigrun" || rec.eventType === "bigbigrun") continue;
      // シナリオ実装日以降のみ
      var recYear = rec.year;
      var md = rec.startDate.split(" ")[0].split("/");
      var recMonth = parseInt(md[0], 10) - 1;
      var recDay = parseInt(md[1], 10);
      var recDate = new Date(recYear, recMonth, recDay);
      if (recDate < SCENARIO_START) continue;

      // ブキセット比較（順序無視）
      var recSet = rec.weapons.slice().sort();
      if (recSet.length !== inputSet.length) continue;
      var match = true;
      for (var k = 0; k < recSet.length; k++) {
        if (recSet[k] !== inputSet[k]) { match = false; break; }
      }
      if (match) {
        if (bestNo === null || rec.no > bestNo) {
          bestNo = rec.no;
          bestRec = rec;
        }
      }
    }

    if (bestRec) {
      matchedScheduleNo = bestNo;
      matchResult.textContent = "No." + bestNo + " " + bestRec.stage + " にマッチしました";
      matchResult.className = "match-result match-result-ok";
      // ステージ自動設定
      stageSelect.value = bestRec.stage;
      stageSelect.disabled = true;
    } else {
      matchedScheduleNo = null;
      matchResult.textContent = "この編成の開催回が見つかりません";
      matchResult.className = "match-result match-result-ng";
      stageSelect.disabled = false;
      alert("この支給ブキの組み合わせに一致する開催回が見つかりません。\nブキの選択を確認してください。");
    }
  }

  // === WAVE組み合わせバリデーション ===
  var waveCards = document.querySelectorAll(".wave-card");
  for (var w = 0; w < waveCards.length; w++) {
    var tideSelect = waveCards[w].querySelector(".wave-tide");
    var eventSelect = waveCards[w].querySelector(".wave-event");
    if (tideSelect && eventSelect) {
      (function (tide, event) {
        function check() {
          var t = tide.value;
          var e = event.value;
          if (!t || !e) return;
          for (var c = 0; c < INVALID_WAVE_COMBOS.length; c++) {
            if (INVALID_WAVE_COMBOS[c][0] === t && INVALID_WAVE_COMBOS[c][1] === e) {
              alert(t + " × " + e + " は存在しない組み合わせです。");
              event.value = "";
              return;
            }
          }
        }
        tide.addEventListener("change", check);
        event.addEventListener("change", check);
      })(tideSelect, eventSelect);
    }
  }

  // === コメント文字数 ===
  commentInput.addEventListener("input", function () {
    var len = this.value.length;
    charCount.textContent = len + " / 140";
    charCount.className = len > 140 ? "char-count char-count-over" : "char-count";
  });

  // === 投稿バリデーション ===
  submitBtn.addEventListener("click", function () {
    var errors = [];

    // シナリオコード
    var code = scenarioCode.value.replace(/-/g, "");
    if (code.length !== 16 || code.charAt(0) !== "S") {
      errors.push("シナリオコードはSから始まる16文字で入力してください。");
    }

    // キケン度
    var danger = parseInt(dangerInput.value, 10);
    if (dangerInput.value === "" || isNaN(danger)) {
      errors.push("キケン度を入力してください。");
    } else {
      var min = 0, max = 333;
      if (currentMode === "private") { min = 5; max = 200; }
      if (danger < min || danger > max) {
        errors.push("キケン度は" + min + "〜" + max + "%の範囲で入力してください。");
      }
    }

    // ブキ（いつものバイトのみ）
    if (currentMode === "regular") {
      if (selectedWeapons.length !== 4) {
        errors.push("支給ブキを4つ選択してください。");
      } else if (!matchedScheduleNo) {
        errors.push("入力されたブキの組み合わせに一致する開催回が見つかりません。");
      }
    }

    // WAVE1必須
    var wave1Card = document.querySelector('.wave-card[data-wave="1"]');
    var w1Tide = wave1Card.querySelector(".wave-tide").value;
    var w1Event = wave1Card.querySelector(".wave-event").value;
    if (!w1Tide || !w1Event) {
      errors.push("WAVE 1の潮位と内容は必須です。");
    }

    // コメント長
    if (commentInput.value.length > 140) {
      errors.push("コメントは140文字以内です。");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    var data = collectFormData();

    if (useFirebase) {
      submitBtn.disabled = true;
      // 重複チェック→投稿
      FB.checkDuplicate(data.code, function (err, exists) {
        if (err) { alert("エラーが発生しました: " + err.message); submitBtn.disabled = false; return; }
        if (exists) { alert("このシナリオコードは既に登録されています。"); resetForm(); submitBtn.disabled = false; return; }
        FB.postScenario(data, function (err2) {
          submitBtn.disabled = false;
          if (err2) { alert("投稿に失敗しました: " + err2.message); return; }
          alert("シナリオを投稿しました！");
          resetForm();
          viewHistory = [];
          showView("top");
          renderRecent();
        });
      });
    } else {
      console.log("投稿データ:", data);
      alert("投稿データを確認しました（HTTPS環境でFirebase連携後に実際に送信されます）");
    }
  });

  function collectFormData() {
    var waves = [];
    var waveNums = ["1", "2", "3"];
    for (var i = 0; i < waveNums.length; i++) {
      var card = document.querySelector('.wave-card[data-wave="' + waveNums[i] + '"]');
      var tide = card.querySelector(".wave-tide").value;
      var event = card.querySelector(".wave-event").value;
      var clear = card.querySelector(".wave-clear").value;
      if (tide || event) {
        waves.push({ wave: parseInt(waveNums[i], 10), tide: tide, event: event, clear: clear || null });
      }
    }

    var extraCard = document.querySelector('.wave-card[data-wave="extra"]');
    var extraTide = extraCard.querySelector(".wave-tide").value;
    var extraBoss = extraCard.querySelector(".wave-boss").value;
    var extra = null;
    if (extraTide || extraBoss) {
      extra = { tide: extraTide, boss: extraBoss };
    }

    var weaponNames = [];
    for (var j = 0; j < selectedWeapons.length; j++) {
      weaponNames.push(selectedWeapons[j].name);
    }

    return {
      code: scenarioCode.value,
      mode: currentMode,
      stage: stageSelect.value,
      danger: parseInt(dangerInput.value, 10),
      weapons: currentMode === "regular" ? weaponNames : [],
      scheduleNo: currentMode === "regular" ? matchedScheduleNo : null,
      waves: waves,
      extra: extra,
      isPrivate: privateCheck.checked,
      comment: commentInput.value || null
    };
  }

  // === フォーム初期化 ===
  function resetForm() {
    scenarioCode.value = "";
    currentMode = "regular";
    for (var i = 0; i < modeBtns.length; i++) {
      modeBtns[i].classList.toggle("active", modeBtns[i].getAttribute("data-mode") === "regular");
    }
    stageSelect.value = "アラマキ砦";
    stageSelect.disabled = false;
    dangerInput.value = "";
    selectedWeapons = [];
    matchedScheduleNo = null;
    matchResult.textContent = "";
    matchResult.className = "match-result";
    renderWeaponSlots();
    applyMode();

    // WAVEリセット
    var allTides = document.querySelectorAll(".wave-tide");
    var allEvents = document.querySelectorAll(".wave-event");
    var allClears = document.querySelectorAll(".wave-clear");
    var allBosses = document.querySelectorAll(".wave-boss");
    for (var j = 0; j < allTides.length; j++) allTides[j].value = "";
    for (var k = 0; k < allEvents.length; k++) allEvents[k].value = "";
    for (var l = 0; l < allClears.length; l++) allClears[l].value = "";
    for (var m = 0; m < allBosses.length; m++) allBosses[m].value = "";

    privateCheck.checked = false;
    commentInput.value = "";
    charCount.textContent = "0 / 140";
    charCount.className = "char-count";
  }

  // === セクション表示管理 ===
  var recentSection = document.getElementById("recent-section");
  var searchSection = document.getElementById("search-section");
  var detailSection = document.getElementById("detail-section");
  var detailContent = document.getElementById("detail-content");
  var searchExecBtn = document.getElementById("search-exec-btn");
  var searchStage = document.getElementById("search-stage");
  var searchDangerMin = document.getElementById("search-danger-min");
  var searchDangerMax = document.getElementById("search-danger-max");
  var searchResults = document.getElementById("search-results");
  var searchFormCard = document.getElementById("search-form-card");
  var searchCollapseToggle = document.getElementById("search-collapse-toggle");
  var searchWeaponSlots = document.getElementById("search-weapon-slots");
  var searchWeaponAddBtn = document.getElementById("search-weapon-add-btn");
  var searchModeBtns = document.querySelectorAll(".search-mode-btn");

  // --- 検索用状態 ---
  var searchSelectedWeapons = []; // [{name, icon}]
  var searchCurrentMode = "regular"; // "regular" | "private"
  var searchFormCollapsed = false;

  // --- 検索モード切替 ---
  for (var si = 0; si < searchModeBtns.length; si++) {
    searchModeBtns[si].addEventListener("click", function () {
      for (var sj = 0; sj < searchModeBtns.length; sj++) searchModeBtns[sj].classList.remove("active");
      this.classList.add("active");
      searchCurrentMode = this.getAttribute("data-mode");
      var searchWeaponSec = document.getElementById("search-weapon-section");
      var searchExtraCard = document.querySelector('#search-wave-cards .search-wave-card[data-wave="extra"]');
      var searchExtraSelects = searchExtraCard ? searchExtraCard.querySelectorAll("select") : [];
      if (searchCurrentMode === "private") {
        // ブキクリア＆無効化
        searchSelectedWeapons = [];
        renderSearchWeaponSlots();
        searchWeaponSec.classList.add("weapon-section-disabled");
        // EX-WAVE無効化
        if (searchExtraCard) {
          searchExtraCard.style.opacity = "0.35";
          searchExtraCard.style.pointerEvents = "none";
          for (var sei = 0; sei < searchExtraSelects.length; sei++) {
            searchExtraSelects[sei].disabled = true;
            searchExtraSelects[sei].value = "";
          }
        }
      } else {
        searchWeaponSec.classList.remove("weapon-section-disabled");
        // EX-WAVE有効化
        if (searchExtraCard) {
          searchExtraCard.style.opacity = "";
          searchExtraCard.style.pointerEvents = "";
          for (var sei2 = 0; sei2 < searchExtraSelects.length; sei2++) {
            searchExtraSelects[sei2].disabled = false;
          }
        }
      }
    });
  }

  // --- 検索用ブキ選択（ポップアップ再利用） ---
  var searchPopupMode = false; // ポップアップが検索用かどうか

  searchWeaponAddBtn.addEventListener("click", function () {
    if (searchSelectedWeapons.length >= 4) return;
    searchPopupMode = true;
    popupSelectedWeapons = [];
    var items = popupGrid.querySelectorAll(".weapon-popup-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("selected");
      items[i].classList.remove("popup-disabled");
      var badge = items[i].querySelector(".weapon-popup-badge");
      if (badge) { badge.textContent = ""; badge.style.display = "none"; }
    }
    renderPopupPreview();
    popupOverlay.classList.add("active");
  });

  function renderSearchWeaponSlots() {
    searchWeaponSlots.innerHTML = "";
    for (var i = 0; i < searchSelectedWeapons.length; i++) {
      var slot = document.createElement("div");
      slot.className = "weapon-slot";
      var img = document.createElement("img");
      img.src = ICON_DIR + searchSelectedWeapons[i].icon;
      img.alt = searchSelectedWeapons[i].name;
      img.title = searchSelectedWeapons[i].name;
      slot.appendChild(img);
      var removeBtn = document.createElement("button");
      removeBtn.className = "weapon-slot-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("data-index", i);
      removeBtn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        searchSelectedWeapons.splice(idx, 1);
        renderSearchWeaponSlots();
      });
      slot.appendChild(removeBtn);
      searchWeaponSlots.appendChild(slot);
    }
    searchWeaponAddBtn.disabled = searchSelectedWeapons.length >= 4;
  }
  renderSearchWeaponSlots();

  // --- 検索フォーム折りたたみ ---
  searchCollapseToggle.addEventListener("click", function () {
    searchFormCollapsed = !searchFormCollapsed;
    if (searchFormCollapsed) {
      searchFormCard.classList.add("collapsed");
      searchCollapseToggle.innerHTML = '<span class="toggle-icon"></span>検索条件を変更';
    } else {
      searchFormCard.classList.remove("collapsed");
      searchCollapseToggle.innerHTML = '<span class="toggle-icon minus"></span>検索条件を閉じる';
    }
  });

  function collapseSearchForm() {
    searchFormCollapsed = true;
    searchFormCard.classList.add("collapsed");
    searchCollapseToggle.innerHTML = '<span class="toggle-icon"></span>検索条件を変更';
    searchCollapseToggle.style.display = "block";
  }

  // --- 検索キケン度: 半角数字のみ + blurバリデーション ---
  searchDangerMin.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
  searchDangerMax.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
  function validateSearchDanger(input) {
    var v = parseInt(input.value, 10);
    if (input.value === "" || isNaN(v)) return;
    var min = 0, max = 333;
    if (searchCurrentMode === "private") { min = 5; max = 200; }
    if (v < min || v > max) {
      alert("キケン度は" + min + "〜" + max + "%の範囲で入力してください。");
      input.value = "";
    }
  }
  searchDangerMin.addEventListener("blur", function () { validateSearchDanger(this); });
  searchDangerMax.addEventListener("blur", function () { validateSearchDanger(this); });

  // --- 検索WAVEあり得ない組み合わせバリデーション ---
  var searchWaveCardsForValidation = document.querySelectorAll(".search-wave-card");
  for (var swv = 0; swv < searchWaveCardsForValidation.length; swv++) {
    var swTide = searchWaveCardsForValidation[swv].querySelector(".search-wave-tide");
    var swEvent = searchWaveCardsForValidation[swv].querySelector(".search-wave-event");
    if (swTide && swEvent) {
      (function (tide, event) {
        function checkCombo() {
          var t = tide.value;
          var e = event.value;
          if (!t || !e) return;
          for (var c = 0; c < INVALID_WAVE_COMBOS.length; c++) {
            if (INVALID_WAVE_COMBOS[c][0] === t && INVALID_WAVE_COMBOS[c][1] === e) {
              alert(t + " × " + e + " は存在しない組み合わせです。");
              event.value = "";
              return;
            }
          }
        }
        tide.addEventListener("change", checkCombo);
        event.addEventListener("change", checkCombo);
      })(swTide, swEvent);
    }
  }

  // 現在のビュー管理
  var currentView = "top"; // "top" | "post" | "search" | "detail"
  var viewHistory = [];

  function showView(view) {
    viewHistory.push(currentView);
    currentView = view;
    actionsSection.style.display = view === "top" ? "" : "none";
    recentSection.style.display = view === "top" ? "" : "none";
    postSection.style.display = view === "post" ? "block" : "none";
    searchSection.style.display = view === "search" ? "" : "none";
    detailSection.style.display = view === "detail" ? "" : "none";
    window.scrollTo(0, 0);
  }

  function goBack() {
    if (viewHistory.length > 0) {
      var prev = viewHistory.pop();
      currentView = prev;
      actionsSection.style.display = prev === "top" ? "" : "none";
      recentSection.style.display = prev === "top" ? "" : "none";
      postSection.style.display = prev === "post" ? "block" : "none";
      searchSection.style.display = prev === "search" ? "" : "none";
      detailSection.style.display = prev === "detail" ? "" : "none";
      window.scrollTo(0, 0);
      requestAnimationFrame(refreshDividers);
    } else {
      window.location.href = "index.html";
    }
  }

  // 戻るボタン上書き
  backLink.removeEventListener("click", backLink._handler);
  backLink._handler = function (e) {
    e.preventDefault();
    goBack();
  };
  backLink.addEventListener("click", backLink._handler);

  // 投稿・検索ボタン
  btnPost.removeEventListener("click", btnPost._handler);
  btnPost._handler = function () {
    if (useFirebase && !FB.currentUser) {
      alert("投稿するにはログインが必要です。");
      return;
    }
    showView("post");
  };
  btnPost.addEventListener("click", btnPost._handler);

  btnSearch.addEventListener("click", function () { showView("search"); });

  // === 編成総合点の計算 ===
  function calcTeamScore(weapons) {
    if (!weapons || weapons.length === 0) return null;
    var total = 0;
    var count = 0;
    for (var i = 0; i < weapons.length; i++) {
      var r = WEAPON_RATINGS[weapons[i]];
      if (!r) continue; // ランダム等
      var avg = ((r.mobility || 0) + (r.paint || 0) + (r.range || 0) + (r.clearing || 0) + (r.handling || 0)) / 5;
      total += avg;
      count++;
    }
    return count > 0 ? Math.round(total / count) : null;
  }

  // === 点線区切りヘルパー（schedule.jsと同様） ===
  var allDividers = [];
  function buildDottedDivider() {
    var divider = document.createElement("div");
    divider.className = "sc-divider";
    allDividers.push(divider);
    return divider;
  }
  function refreshDividers() {
    for (var i = 0; i < allDividers.length; i++) {
      var d = allDividers[i];
      d.innerHTML = "";
      var w = d.offsetWidth;
      if (w <= 0) continue;
      var dotW = 4, gapW = 6, unit = dotW + gapW;
      var count = Math.floor(w / unit);
      for (var j = 0; j < count; j++) {
        var dot = document.createElement("span");
        dot.className = "sc-dot";
        dot.style.width = dotW + "px";
        dot.style.flexShrink = "0";
        d.appendChild(dot);
        if (j < count - 1) {
          var gap = document.createElement("span");
          gap.className = "sc-gap";
          gap.style.width = gapW + "px";
          gap.style.flexShrink = "0";
          d.appendChild(gap);
        }
      }
    }
  }

  // scheduleNo → SCHEDULE_DATAのレコードを引く
  function findScheduleByNo(no) {
    if (!no || typeof SCHEDULE_DATA === "undefined") return null;
    for (var i = 0; i < SCHEDULE_DATA.length; i++) {
      if (SCHEDULE_DATA[i].no === no) return SCHEDULE_DATA[i];
    }
    return null;
  }

  // schedule.jsと同じ日時フォーマット
  function formatDate(dateStr, year) {
    var parts = dateStr.split(" ");
    var md = parts[0];
    var time = parts[1] || "";
    return md + " " + time;
  }

  // === ブキアイコン生成ヘルパー ===
  function buildWeaponsDiv(sc) {
    var weaponsDiv = document.createElement("div");
    weaponsDiv.className = "sc-weapons";
    if (sc.mode === "private" || !sc.weapons || sc.weapons.length === 0) {
      for (var i = 0; i < 4; i++) {
        var img = document.createElement("img");
        img.src = ICON_DIR + "weapon_free_private.png";
        img.alt = "フリー";
        img.title = "フリー";
        weaponsDiv.appendChild(img);
      }
    } else {
      for (var j = 0; j < sc.weapons.length; j++) {
        var wName = sc.weapons[j];
        var wImg = document.createElement("img");
        if (wName === "？(金)") {
          wImg.src = ICON_DIR + "weapon_random_rare.png";
          wImg.title = "？（黄金）";
        } else if (wName === "？") {
          wImg.src = ICON_DIR + "weapon_random.png";
          wImg.title = "？（ランダム）";
        } else {
          wImg.src = ICON_DIR + (WEAPON_ICONS[wName] || "weapon_random.png");
          wImg.title = wName;
        }
        wImg.alt = wName;
        weaponsDiv.appendChild(wImg);
      }
    }
    return weaponsDiv;
  }

  // === WAVE正方形ストリップ生成 ===
  function getOverallResult(sc) {
    if (!sc.waves || sc.waves.length === 0) return null;
    for (var i = 0; i < sc.waves.length; i++) {
      if (sc.waves[i].clear === "NG") return "NG";
    }
    // 全WAVEにclearがあるかチェック
    var lastWave = sc.waves[sc.waves.length - 1];
    if (lastWave.clear === "GJ") return "GJ";
    return null;
  }

  // キケン度 → WAVE1/2/3 ノルマ個数テーブル
  // [上限キケン度, W1, W2, W3]
  var QUOTA_TABLE = [
    [3.8, 3, 4, 5],
    [7.8, 4, 5, 6],
    [11.8, 5, 6, 7],
    [15.8, 6, 7, 8],
    [19.8, 7, 8, 9],
    [29.8, 8, 9, 10],
    [39.8, 8, 9, 11],
    [49.8, 9, 10, 12],
    [59.8, 10, 11, 13],
    [69.8, 11, 12, 14],
    [79.8, 12, 13, 15],
    [86.6, 13, 14, 16],
    [93.2, 14, 15, 17],
    [99.8, 15, 16, 18],
    [109, 16, 17, 19],
    [118, 17, 18, 20],
    [119.8, 17, 19, 21],
    [127.2, 18, 19, 21],
    [129.8, 18, 20, 22],
    [136.2, 19, 20, 22],
    [139.8, 19, 21, 23],
    [145.4, 20, 21, 23],
    [149.8, 20, 22, 24],
    [154.4, 21, 22, 24],
    [159.8, 21, 23, 25],
    [163.6, 22, 23, 25],
    [169.8, 22, 24, 26],
    [172.6, 23, 24, 26],
    [179.8, 23, 25, 27],
    [181.8, 24, 25, 27],
    [189.8, 24, 26, 28],
    [190.8, 25, 26, 28],
    [199.8, 25, 27, 29],
    [226.4, 26, 28, 30],
    [233.2, 26, 28, 31],
    [253, 27, 29, 31],
    [266.4, 27, 29, 32],
    [279.6, 28, 30, 32],
    [299.6, 28, 30, 33],
    [306.2, 29, 31, 33],
    [332.8, 29, 31, 34],
    [333, 30, 32, 35]
  ];

  function calcQuota(danger, waveNum) {
    for (var i = 0; i < QUOTA_TABLE.length; i++) {
      if (danger <= QUOTA_TABLE[i][0]) {
        return QUOTA_TABLE[i][waveNum]; // waveNum: 1,2,3
      }
    }
    return QUOTA_TABLE[QUOTA_TABLE.length - 1][waveNum];
  }


  function buildWaveSquare(wv, isEx, danger) {
    var sq = document.createElement("div");
    sq.className = "sn-wave-square";

    // WAVEラベル
    var label = document.createElement("div");
    label.className = "sn-wave-label";
    label.textContent = isEx ? "EX-WAVE" : "WAVE" + wv.wave;
    sq.appendChild(label);

    // ノルマ帯 / EXはボス名帯
    var band = document.createElement("div");
    band.className = "sn-wave-quota-band";
    var bandText = document.createElement("span");
    bandText.className = "sn-wave-quota-text";
    if (isEx) {
      bandText.textContent = wv.boss || "";
    } else {
      var quota = calcQuota(danger, wv.wave);
      bandText.textContent = "ノルマ " + quota;
    }
    band.appendChild(bandText);
    sq.appendChild(band);

    // 潮位
    var tide = document.createElement("div");
    tide.className = "sn-wave-tide";
    tide.textContent = wv.tide || "";
    sq.appendChild(tide);

    // イベント内容
    var eventEl = document.createElement("div");
    eventEl.className = "sn-wave-event";
    var fullName = isEx ? "" : (wv.event || "");
    var displayName = fullName === "昼" ? "-" : fullName;
    eventEl.textContent = displayName;
    sq.appendChild(eventEl);

    // GJ/NG（中央下部）— EXウェーブは表示しない
    if (wv.clear && !isEx) {
      var clearSpan = document.createElement("span");
      clearSpan.className = "sn-wave-clear";
      if (wv.clear === "GJ") clearSpan.classList.add("sn-wave-clear-gj");
      if (wv.clear === "NG") clearSpan.classList.add("sn-wave-clear-ng");
      clearSpan.textContent = wv.clear === "GJ" ? "GJ!" : wv.clear;
      sq.appendChild(clearSpan);
    }

    // NGのウェーブはノルマテキストを薄く
    if (wv.clear === "NG" && !isEx) {
      bandText.style.opacity = "0.6";
    }

    // 潮位の波背景
    if (wv.tide) {
      var tideLevel = wv.tide === "干潮" ? 0.20 : wv.tide === "満潮" ? 0.85 : 0.50;
      var RANGE_TOP = 44; // 帯の下端（おおよそ）
      var rangeH = 100 - RANGE_TOP;
      var waveCenterPct = RANGE_TOP + rangeH * (1 - tideLevel);

      var waveBg = document.createElement("div");
      waveBg.className = "sn-wave-bg";
      waveBg.style.top = RANGE_TOP + "%";

      var svgNS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 600 100");
      svg.setAttribute("preserveAspectRatio", "none");

      var waveY = ((waveCenterPct - RANGE_TOP) / rangeH) * 100;
      var amp = 5;
      var NUM_WAVES = 6;
      var pts = NUM_WAVES * 20;
      var d = "";
      for (var p = 0; p <= pts; p++) {
        var x = (p / pts) * 600;
        var y = waveY + amp * Math.cos((p / pts) * NUM_WAVES * 2 * Math.PI);
        d += (p === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      }
      d += "L600,100L0,100Z";

      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "#ccd35c");
      svg.appendChild(path);
      waveBg.appendChild(svg);
      sq.appendChild(waveBg);
    }

    return sq;
  }

  // 角丸を連結状態に応じて設定（同じ行内で隣接する正方形の接する角は丸めない）
  function applySquareRadii(container) {
    var squares = container.children;
    if (squares.length === 0) return;
    // 各正方形のtop位置でグループ化（折り返し検出）
    var rows = [];
    var currentRow = [squares[0]];
    var currentTop = squares[0].offsetTop;
    for (var i = 1; i < squares.length; i++) {
      if (squares[i].offsetTop !== currentTop) {
        rows.push(currentRow);
        currentRow = [squares[i]];
        currentTop = squares[i].offsetTop;
      } else {
        currentRow.push(squares[i]);
      }
    }
    rows.push(currentRow);
    var R = "6px";
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      for (var c = 0; c < row.length; c++) {
        var tl = "0", tr = "0", br = "0", bl = "0";
        if (c === 0) { tl = R; bl = R; }
        if (c === row.length - 1) { tr = R; br = R; }
        row[c].style.borderRadius = tl + " " + tr + " " + br + " " + bl;
      }
    }
  }

  function buildWaveStrip(sc) {
    var strip = document.createElement("div");
    strip.className = "sn-wave-strip";

    if (!sc.waves || sc.waves.length === 0) return strip;

    var squares = document.createElement("div");
    squares.className = "sn-wave-squares";

    var hasEx = sc.extra && (sc.extra.tide || sc.extra.boss);

    for (var i = 0; i < sc.waves.length; i++) {
      var wv = sc.waves[i];
      if (!wv.tide && !wv.event && !wv.clear) continue;
      squares.appendChild(buildWaveSquare(wv, false, sc.danger));
    }

    // EX-WAVE
    if (hasEx) {
      var exWv = { tide: sc.extra.tide, boss: sc.extra.boss, clear: null };
      squares.appendChild(buildWaveSquare(exWv, true, sc.danger));
    }

    strip.appendChild(squares);

    // DOM追加後に角丸+イベント名を更新
    requestAnimationFrame(function() { applySquareRadii(squares); });
    var resizeObserver = new ResizeObserver(function() { applySquareRadii(squares); });
    resizeObserver.observe(squares);

    return strip;
  }

  // バッジテキストをウィンドウ幅に応じて切替
  function updateBadgeTexts() {
    var narrow = window.innerWidth <= 450;
    var badges = document.querySelectorAll(".sn-mode-badge");
    for (var i = 0; i < badges.length; i++) {
      var b = badges[i];
      if (b.dataset.full) {
        b.textContent = narrow ? b.dataset.short : b.dataset.full;
      }
    }
  }
  window.addEventListener("resize", updateBadgeTexts);

  // === カード生成（schedule.htmlと同じ構造） ===
  function buildCard(sc) {
    var card = document.createElement("div");
    card.className = "sn-card";

    // モードバッジ + キケン度
    var modeRow = document.createElement("div");
    modeRow.className = "sn-mode-row";
    var modeBadge = document.createElement("span");
    modeBadge.className = "sn-mode-badge";
    if (sc.mode === "private") modeBadge.classList.add("sn-mode-private");
    modeBadge.dataset.full = sc.mode === "private" ? "プライベートバイト" : "いつものバイト";
    modeBadge.dataset.short = sc.mode === "private" ? "プライベート" : "いつもの";
    modeBadge.textContent = modeBadge.dataset.full;
    modeRow.appendChild(modeBadge);
    var dangerWrap = document.createElement("span");
    dangerWrap.className = "sn-danger-wrap";
    var dangerLabel = document.createElement("span");
    dangerLabel.className = "sn-danger-label";
    dangerLabel.textContent = "キケン度";
    dangerWrap.appendChild(dangerLabel);
    var dangerValue = document.createElement("span");
    dangerValue.className = "sn-danger-value";
    dangerValue.textContent = sc.danger + "%";
    dangerWrap.appendChild(dangerValue);
    modeRow.appendChild(dangerWrap);
    var bmBtn = document.createElement("button");
    bmBtn.className = "sn-bookmark-btn";
    bmBtn.textContent = "☆ " + (sc.bookmarks || 0);
    bmBtn.addEventListener("click", function () {
      if (bmBtn.classList.toggle("sn-bookmarked")) {
        sc.bookmarks = (sc.bookmarks || 0) + 1;
        bmBtn.textContent = "★ " + sc.bookmarks;
      } else {
        sc.bookmarks = Math.max(0, (sc.bookmarks || 0) - 1);
        bmBtn.textContent = "☆ " + sc.bookmarks;
      }
    });
    modeRow.appendChild(bmBtn);
    card.appendChild(modeRow);

    // 1行目: No + 年号 + 開催日時 / プライベート説明文
    var schedRec = findScheduleByNo(sc.scheduleNo);
    if (schedRec) {
      var dateRow = document.createElement("div");
      dateRow.className = "sc-date-row";
      var noBadge = document.createElement("span");
      noBadge.className = "sc-no";
      noBadge.textContent = "No." + schedRec.no;
      dateRow.appendChild(noBadge);
      var yearBadge = document.createElement("span");
      yearBadge.className = "sc-year";
      yearBadge.textContent = schedRec.year + "年";
      dateRow.appendChild(yearBadge);
      var startMonth = parseInt(schedRec.startDate.split("/")[0]);
      var endMonth = parseInt(schedRec.endDate.split("/")[0]);
      var endYear = schedRec.year;
      if (endMonth < startMonth) endYear++;
      var dateSpan = document.createElement("span");
      dateSpan.className = "sc-date";
      dateSpan.textContent = formatDate(schedRec.startDate, schedRec.year) + " - " + formatDate(schedRec.endDate, endYear);
      dateRow.appendChild(dateSpan);
      card.appendChild(dateRow);
    } else if (sc.mode === "private") {
      var privateNote = document.createElement("div");
      privateNote.className = "sn-private-note";
      privateNote.textContent = "プライベートなのでブキ変更自由";
      card.appendChild(privateNote);
    }

    // 2行目: ステージ画像 + ステージ名 + ブキ（schedule.htmlと同じ）
    var infoDiv = document.createElement("div");
    infoDiv.className = "sc-info";

    var stageImg = document.createElement("img");
    stageImg.className = "sc-stage-img";
    stageImg.src = ICON_DIR + (STAGE_ICONS_HIGH[sc.stage] || "stage_random_high.png");
    stageImg.alt = sc.stage;
    infoDiv.appendChild(stageImg);

    var stageCol = document.createElement("div");
    stageCol.className = "sc-stage-col";
    var stageName = document.createElement("span");
    stageName.className = "sc-stage-name";
    stageName.textContent = sc.stage;
    stageCol.appendChild(stageName);
    infoDiv.appendChild(stageCol);

    infoDiv.appendChild(buildWeaponsDiv(sc));
    card.appendChild(infoDiv);

    // 点線区切り
    card.appendChild(buildDottedDivider());

    // シナリオコードボックス
    var codeBox = document.createElement("div");
    codeBox.className = "sn-code-box";
    var codeSpan = document.createElement("span");
    codeSpan.className = "sn-code";
    codeSpan.textContent = sc.code;
    codeBox.appendChild(codeSpan);
    card.appendChild(codeBox);

    // WAVE正方形
    card.appendChild(buildWaveStrip(sc));

    // コメント
    if (sc.comment) {
      var comment = document.createElement("div");
      comment.className = "sn-comment";
      comment.textContent = sc.comment;
      card.appendChild(comment);
    }

    // フッター（メタ情報 + 詳細ボタン）
    var footer = document.createElement("div");
    footer.className = "sn-footer";
    var metaLeft = document.createElement("div");
    metaLeft.className = "sn-footer-meta";
    var user = document.createElement("span");
    user.className = "sn-user";
    user.textContent = sc.userName;
    metaLeft.appendChild(user);
    var postedDate = document.createElement("span");
    postedDate.className = "sn-posted-date";
    postedDate.textContent = sc.postedAt;
    metaLeft.appendChild(postedDate);
    footer.appendChild(metaLeft);
    var detailBtn = document.createElement("button");
    detailBtn.className = "sn-detail-btn";
    detailBtn.textContent = "詳細を見る";
    detailBtn.addEventListener("click", function () {
      showDetail(sc);
    });
    footer.appendChild(detailBtn);
    card.appendChild(footer);

    requestAnimationFrame(updateBadgeTexts);
    return card;
  }

  // === 詳細ページ ===
  function showDetail(sc) {
    showView("detail");
    detailContent.innerHTML = "";

    // Firebase環境ではクリア報告をサブコレクションから取得
    if (useFirebase && sc.id && !sc._clearsLoaded) {
      FB.getClears(sc.id, function (err, clears) {
        if (!err && clears) {
          sc.clears = clears;
          sc._clearsLoaded = true;
        }
        renderDetail(sc);
      });
      return;
    }
    renderDetail(sc);
  }

  function renderDetail(sc) {
    detailContent.innerHTML = "";

    // メインカード（schedule風）
    var card = document.createElement("div");
    card.className = "sn-card";
    card.style.marginBottom = "1rem";

    // モードバッジ + キケン度
    var modeRow = document.createElement("div");
    modeRow.className = "sn-mode-row";
    var modeBadgeD = document.createElement("span");
    modeBadgeD.className = "sn-mode-badge";
    if (sc.mode === "private") modeBadgeD.classList.add("sn-mode-private");
    modeBadgeD.dataset.full = sc.mode === "private" ? "プライベートバイト" : "いつものバイト";
    modeBadgeD.dataset.short = sc.mode === "private" ? "プライベート" : "いつもの";
    modeBadgeD.textContent = modeBadgeD.dataset.full;
    modeRow.appendChild(modeBadgeD);
    var dangerWrapD = document.createElement("span");
    dangerWrapD.className = "sn-danger-wrap";
    var dangerLabelD = document.createElement("span");
    dangerLabelD.className = "sn-danger-label";
    dangerLabelD.textContent = "キケン度";
    dangerWrapD.appendChild(dangerLabelD);
    var dangerValueD = document.createElement("span");
    dangerValueD.className = "sn-danger-value";
    dangerValueD.textContent = sc.danger + "%";
    dangerWrapD.appendChild(dangerValueD);
    modeRow.appendChild(dangerWrapD);
    var bmBtnD = document.createElement("button");
    bmBtnD.className = "sn-bookmark-btn";
    bmBtnD.textContent = "☆ " + (sc.bookmarks || 0);
    bmBtnD.addEventListener("click", function () {
      if (bmBtnD.classList.toggle("sn-bookmarked")) {
        sc.bookmarks = (sc.bookmarks || 0) + 1;
        bmBtnD.textContent = "★ " + sc.bookmarks;
      } else {
        sc.bookmarks = Math.max(0, (sc.bookmarks || 0) - 1);
        bmBtnD.textContent = "☆ " + sc.bookmarks;
      }
    });
    modeRow.appendChild(bmBtnD);
    card.appendChild(modeRow);

    // No + 年号 + 開催日時 / プライベート説明文
    var schedRecD = findScheduleByNo(sc.scheduleNo);
    if (schedRecD) {
      var dateRow = document.createElement("div");
      dateRow.className = "sc-date-row";
      var noBadge = document.createElement("span");
      noBadge.className = "sc-no";
      noBadge.textContent = "No." + schedRecD.no;
      dateRow.appendChild(noBadge);
      var yearBadge = document.createElement("span");
      yearBadge.className = "sc-year";
      yearBadge.textContent = schedRecD.year + "年";
      dateRow.appendChild(yearBadge);
      var startMonth = parseInt(schedRecD.startDate.split("/")[0]);
      var endMonth = parseInt(schedRecD.endDate.split("/")[0]);
      var endYear = schedRecD.year;
      if (endMonth < startMonth) endYear++;
      var dateSpan = document.createElement("span");
      dateSpan.className = "sc-date";
      dateSpan.textContent = formatDate(schedRecD.startDate, schedRecD.year) + " - " + formatDate(schedRecD.endDate, endYear);
      dateRow.appendChild(dateSpan);
      card.appendChild(dateRow);
    } else if (sc.mode === "private") {
      var privateNote = document.createElement("div");
      privateNote.className = "sn-private-note";
      privateNote.textContent = "プライベートなのでブキ変更自由";
      card.appendChild(privateNote);
    }

    // ステージ画像 + ステージ名 + ブキ
    var infoDiv = document.createElement("div");
    infoDiv.className = "sc-info";
    var stageImg = document.createElement("img");
    stageImg.className = "sc-stage-img";
    stageImg.src = ICON_DIR + (STAGE_ICONS_HIGH[sc.stage] || "stage_random_high.png");
    stageImg.alt = sc.stage;
    infoDiv.appendChild(stageImg);
    var stageCol = document.createElement("div");
    stageCol.className = "sc-stage-col";
    var stageNameD = document.createElement("span");
    stageNameD.className = "sc-stage-name";
    stageNameD.textContent = sc.stage;
    stageCol.appendChild(stageNameD);
    infoDiv.appendChild(stageCol);
    infoDiv.appendChild(buildWeaponsDiv(sc));
    card.appendChild(infoDiv);

    // 点線区切り
    card.appendChild(buildDottedDivider());

    // シナリオコードボックス
    var codeBox = document.createElement("div");
    codeBox.className = "sn-code-box";
    var codeSpan = document.createElement("span");
    codeSpan.className = "sn-code";
    codeSpan.textContent = sc.code;
    codeBox.appendChild(codeSpan);
    card.appendChild(codeBox);

    // WAVE正方形
    card.appendChild(buildWaveStrip(sc));

    // コメント
    if (sc.comment) {
      var comment = document.createElement("div");
      comment.className = "sn-comment";
      comment.textContent = sc.comment;
      card.appendChild(comment);
    }

    // フッター（メタ情報）
    var footer = document.createElement("div");
    footer.className = "sn-footer";
    var metaLeft = document.createElement("div");
    metaLeft.className = "sn-footer-meta";
    var metaUser = document.createElement("span");
    metaUser.className = "sn-user";
    metaUser.textContent = sc.userName;
    metaLeft.appendChild(metaUser);
    var metaDate = document.createElement("span");
    metaDate.className = "sn-posted-date";
    metaDate.textContent = sc.postedAt;
    metaLeft.appendChild(metaDate);
    footer.appendChild(metaLeft);
    card.appendChild(footer);

    detailContent.appendChild(card);

    // クリア報告セクション
    var clearSection = document.createElement("div");
    clearSection.className = "sn-clear-section";

    var clearToggle = document.createElement("button");
    clearToggle.className = "sn-clear-toggle";
    clearToggle.innerHTML = '<span class="toggle-icon"></span>クリアを報告する';
    clearSection.appendChild(clearToggle);

    // 報告フォーム（デフォルト非表示）
    var clearForm = document.createElement("div");
    clearForm.className = "sn-clear-form";
    clearForm.style.display = "none";

    clearToggle.addEventListener("click", function () {
      var isOpen = clearForm.style.display !== "none";
      clearForm.style.display = isOpen ? "none" : "block";
      clearToggle.innerHTML = isOpen ? '<span class="toggle-icon"></span>クリアを報告する' : '<span class="toggle-icon minus"></span>クリアを報告する';
    });

    // 仲間（人数ボタン + 入力欄）
    var tmLabel = document.createElement("div");
    tmLabel.className = "sn-cf-label";
    tmLabel.innerHTML = 'メンバー<span class="form-required-tag">必須</span>';
    clearForm.appendChild(tmLabel);
    var tmBtnRow = document.createElement("div");
    tmBtnRow.className = "sn-cf-tm-btn-row";
    var tmList = document.createElement("div");
    tmList.className = "sn-cf-tm-list";
    var tmSlots = [];
    for (var ti = 0; ti < 3; ti++) {  // 最大3枠（投稿者を除く仲間）
      var slot = document.createElement("div");
      slot.className = "sn-cf-tm-slot";
      addTeammateInput(slot);
      tmList.appendChild(slot);
      tmSlots.push(slot);
    }
    function setTeammateCount(n) {
      // n = チーム全体人数(4/3/2/1)、仲間入力欄は n-1 個
      var needed = n - 1;
      for (var i = 0; i < tmSlots.length; i++) {
        var inp = tmSlots[i].querySelector("input");
        if (i < needed) {
          tmSlots[i].classList.remove("collapsed");
          inp.disabled = false;
        } else {
          tmSlots[i].classList.add("collapsed");
          inp.disabled = true;
          inp.value = "";
        }
      }
      for (var bi = 0; bi < tmBtnRow.children.length; bi++) {
        var b = tmBtnRow.children[bi];
        if (parseInt(b.dataset.count) === n) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      }
    }
    var counts = [4, 3, 2, 1];
    for (var ci = 0; ci < counts.length; ci++) {
      var cBtn = document.createElement("button");
      cBtn.className = "sn-cf-tm-count-btn";
      cBtn.dataset.count = counts[ci];
      cBtn.textContent = counts[ci] + "人";
      cBtn.addEventListener("click", (function (n) {
        return function () { setTeammateCount(n); };
      })(counts[ci]));
      tmBtnRow.appendChild(cBtn);
    }
    clearForm.appendChild(tmBtnRow);
    clearForm.appendChild(tmList);
    setTeammateCount(4);

    // WAVE納品数
    var eggsLabel = document.createElement("div");
    eggsLabel.className = "sn-cf-label";
    eggsLabel.innerHTML = 'WAVEごとの金イクラ納品数<span class="form-required-tag">必須</span>';
    clearForm.appendChild(eggsLabel);
    var eggsRow = document.createElement("div");
    eggsRow.className = "sn-cf-eggs-row";
    var waveCount = 3;
    var eggTotalEl = document.createElement("div");
    eggTotalEl.className = "sn-cf-egg-total";
    var eggTotalImg = document.createElement("img");
    eggTotalImg.src = "png/icon_goldenegg.png";
    eggTotalImg.alt = "金イクラ";
    eggTotalEl.appendChild(eggTotalImg);
    var eggTotalNum = document.createElement("span");
    eggTotalNum.textContent = "x0";
    eggTotalEl.appendChild(eggTotalNum);
    function updateEggTotal() {
      var inputs = eggsRow.querySelectorAll(".sn-cf-egg-input");
      var sum = 0;
      for (var ei = 0; ei < inputs.length; ei++) {
        var v = parseInt(inputs[ei].value);
        if (!isNaN(v)) sum += v;
      }
      eggTotalNum.textContent = "x" + sum;
    }
    for (var we2 = 0; we2 < Math.max(waveCount, 1); we2++) {
      var eggField = document.createElement("div");
      eggField.className = "sn-cf-egg-field";
      var eggLbl = document.createElement("span");
      eggLbl.className = "sn-cf-egg-label";
      eggLbl.textContent = "WAVE " + (we2 + 1);
      eggField.appendChild(eggLbl);
      var eggInput = document.createElement("input");
      eggInput.type = "text";
      eggInput.className = "sn-cf-input sn-cf-egg-input";
      eggInput.inputMode = "numeric";
      eggInput.placeholder = "0";
      eggInput.addEventListener("input", function () {
        var v = parseInt(this.value);
        if (!isNaN(v) && v >= 200) this.value = "199";
        if (!isNaN(v) && v < 0) this.value = "0";
        updateEggTotal();
      });
      eggField.appendChild(eggInput);
      eggsRow.appendChild(eggField);
    }
    clearForm.appendChild(eggsRow);
    clearForm.appendChild(eggTotalEl);

    // オカシラ結果
    if (sc.extra && sc.extra.boss) {
      var bossLabel = document.createElement("div");
      bossLabel.className = "sn-cf-label";
      bossLabel.innerHTML = 'オカシラ（' + sc.extra.boss + '）<span class="form-required-tag">必須</span>';
      clearForm.appendChild(bossLabel);
      var bossSelect = document.createElement("select");
      bossSelect.className = "sn-cf-select";
      bossSelect.id = "clear-boss-result";
      bossSelect.innerHTML = '<option value="">-</option><option value="GJ">討伐成功</option><option value="NG">討伐失敗</option>';
      clearForm.appendChild(bossSelect);
    }

    // 合計赤イクラ獲得数
    var redLabel = document.createElement("div");
    redLabel.className = "sn-cf-label";
    redLabel.innerHTML = '合計赤イクラ獲得数<span class="form-required-tag">必須</span>';
    clearForm.appendChild(redLabel);
    var redInput = document.createElement("input");
    redInput.type = "text";
    redInput.className = "sn-cf-input";
    redInput.inputMode = "numeric";
    redInput.placeholder = "0";
    redInput.id = "clear-red-eggs";
    redInput.addEventListener("input", function () {
      var v = parseInt(this.value);
      if (!isNaN(v) && v > 19999) this.value = "19999";
      if (!isNaN(v) && v < 0) this.value = "0";
    });
    clearForm.appendChild(redInput);

    // 報告ボタン
    var clearBtn = document.createElement("button");
    clearBtn.className = "sn-clear-btn";
    clearBtn.textContent = "クリアを報告する";
    clearBtn.addEventListener("click", function () {
      if (!useFirebase) {
        alert("クリア報告はHTTPS環境でのみ利用可能です");
        return;
      }
      if (!FB.currentUser) {
        alert("クリア報告するにはログインが必要です");
        return;
      }
      // バリデーション
      var clearErrors = [];
      var eggsInputs = document.querySelectorAll(".sn-cf-egg-input");
      var waveEggs = [];
      for (var ei = 0; ei < eggsInputs.length; ei++) {
        if (eggsInputs[ei].disabled) continue;
        var val = parseInt(eggsInputs[ei].value, 10);
        if (isNaN(val) || val < 0) { clearErrors.push("WAVEごとの金イクラ納品数を正しく入力してください。"); break; }
        waveEggs.push(val);
      }
      var redVal = parseInt(document.getElementById("clear-red-eggs").value, 10);
      if (isNaN(redVal) || redVal < 0) clearErrors.push("赤イクラ獲得数を入力してください。");

      // 仲間
      var tmInputs = document.querySelectorAll(".sn-cf-tm-slot:not(.collapsed) input");
      var teammates = [];
      for (var ti = 0; ti < tmInputs.length; ti++) {
        var tmVal = tmInputs[ti].value.trim();
        if (tmVal) teammates.push(tmVal);
      }

      var bossResultEl = document.getElementById("clear-boss-result");
      var bossResult = bossResultEl ? bossResultEl.value || null : null;

      if (clearErrors.length > 0) { alert(clearErrors.join("\n")); return; }

      clearBtn.disabled = true;
      FB.postClear(sc.id, {
        teammates: teammates,
        waveEggs: waveEggs,
        redEggs: redVal,
        bossResult: bossResult
      }, function (err) {
        clearBtn.disabled = false;
        if (err) { alert("報告に失敗しました: " + err.message); return; }
        alert("クリアを報告しました！");
        // クリア一覧を再取得して更新
        FB.getClears(sc.id, function (err2, clears) {
          if (!err2 && clears) {
            sc.clears = clears;
            // 詳細を再表示
            showDetail(sc);
          }
        });
      });
    });
    clearForm.appendChild(clearBtn);

    clearSection.appendChild(clearForm);

    // クリア報告ランキング — セクション枠
    var rankSection = document.createElement("div");
    rankSection.className = "sn-rank-section";
    rankSection.style.marginTop = "1.5rem";

    var clearListHeading = document.createElement("div");
    clearListHeading.className = "sn-clear-heading";
    clearListHeading.textContent = "クリア報告一覧（" + (sc.clears ? sc.clears.length : 0) + "件）";
    rankSection.appendChild(clearListHeading);

    if (sc.clears && sc.clears.length > 0) {
      // ソート切替ボタン
      var sortRow = document.createElement("div");
      sortRow.className = "sn-rank-sort-row";
      var sortGold = document.createElement("button");
      sortGold.className = "sn-rank-sort-btn active";
      sortGold.textContent = "金イクラ順";
      sortGold.setAttribute("data-sort", "gold");
      var sortRed = document.createElement("button");
      sortRed.className = "sn-rank-sort-btn";
      sortRed.textContent = "赤イクラ順";
      sortRed.setAttribute("data-sort", "red");
      sortRow.appendChild(sortGold);
      sortRow.appendChild(sortRed);
      rankSection.appendChild(sortRow);

      var clearList = document.createElement("div");
      clearList.className = "sn-clear-list";
      rankSection.appendChild(clearList);

      var currentSort = "gold";

      function renderRanking() {
        clearList.innerHTML = "";
        var sorted = sc.clears.slice();
        if (currentSort === "gold") {
          sorted.sort(function (a, b) {
            var aSum = 0, bSum = 0;
            if (a.waveEggs) for (var i = 0; i < a.waveEggs.length; i++) aSum += a.waveEggs[i];
            if (b.waveEggs) for (var i = 0; i < b.waveEggs.length; i++) bSum += b.waveEggs[i];
            return bSum !== aSum ? bSum - aSum : (b.redEggs || 0) - (a.redEggs || 0);
          });
        } else {
          sorted.sort(function (a, b) {
            var diff = (b.redEggs || 0) - (a.redEggs || 0);
            if (diff !== 0) return diff;
            var aSum = 0, bSum = 0;
            if (a.waveEggs) for (var i = 0; i < a.waveEggs.length; i++) aSum += a.waveEggs[i];
            if (b.waveEggs) for (var i = 0; i < b.waveEggs.length; i++) bSum += b.waveEggs[i];
            return bSum - aSum;
          });
        }
        for (var c = 0; c < sorted.length; c++) {
          clearList.appendChild(buildClearCard(sorted[c], c + 1));
        }
      }

      sortGold.addEventListener("click", function () {
        if (currentSort === "gold") return;
        currentSort = "gold";
        sortGold.classList.add("active");
        sortRed.classList.remove("active");
        renderRanking();
      });
      sortRed.addEventListener("click", function () {
        if (currentSort === "red") return;
        currentSort = "red";
        sortRed.classList.add("active");
        sortGold.classList.remove("active");
        renderRanking();
      });

      renderRanking();
    } else {
      var empty = document.createElement("div");
      empty.className = "sn-clear-empty";
      empty.textContent = "まだクリア報告がありません";
      rankSection.appendChild(empty);
    }

    clearSection.appendChild(rankSection);
    detailContent.appendChild(clearSection);
    requestAnimationFrame(refreshDividers);
  }

  // === 仲間入力フィールド追加 ===
  function addTeammateInput(container) {
    var input = document.createElement("input");
    input.type = "text";
    input.className = "sn-cf-input sn-cf-tm-input";
    input.placeholder = "名前を入力";
    container.appendChild(input);
  }

  // === クリア報告カード生成（ランキング形式） ===
  var CROWN_COLORS = ["#ffd700", "#c0c0c0", "#cd7f32"]; // 金銀銅

  function buildClearCard(cl, rank) {
    var card = document.createElement("div");
    card.className = "sn-clear-card";

    // 左: 順位
    var rankCol = document.createElement("div");
    rankCol.className = "sn-cc-rank";
    if (rank <= 3) {
      // 王冠SVG
      var crown = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      crown.setAttribute("viewBox", "0 0 24 20");
      crown.setAttribute("width", "20");
      crown.setAttribute("height", "17");
      crown.style.display = "block";
      crown.style.margin = "0 auto 2px";
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M2 16L4 6L8 10L12 2L16 10L20 6L22 16Z");
      path.setAttribute("fill", CROWN_COLORS[rank - 1]);
      path.setAttribute("stroke", "rgba(0,0,0,0.3)");
      path.setAttribute("stroke-width", "1");
      crown.appendChild(path);
      rankCol.appendChild(crown);
    }
    var rankNum = document.createElement("span");
    rankNum.className = "sn-cc-rank-num";
    rankNum.textContent = rank;
    if (rank <= 3) rankNum.style.color = CROWN_COLORS[rank - 1];
    rankCol.appendChild(rankNum);
    card.appendChild(rankCol);

    // 右: 情報
    var infoCol = document.createElement("div");
    infoCol.className = "sn-cc-info";

    // 名前 + 人数バッジ
    var header = document.createElement("div");
    header.className = "sn-cc-header";
    var name = document.createElement("span");
    name.className = "sn-cc-name";
    name.textContent = cl.userName.length > 14 ? cl.userName.substring(0, 14) + "..." : cl.userName;
    if (cl.userName.length > 14) name.title = cl.userName;
    header.appendChild(name);
    var memberCount = 1 + (cl.teammates ? cl.teammates.length : 0);
    var countBadge = document.createElement("span");
    countBadge.className = "sn-cc-count-badge";
    countBadge.textContent = memberCount + "人";
    header.appendChild(countBadge);
    infoCol.appendChild(header);

    if (cl.teammates && cl.teammates.length > 0) {
      var tmRow = document.createElement("div");
      tmRow.className = "sn-cc-tm-row";
      for (var ti = 0; ti < cl.teammates.length; ti++) {
        var badge = document.createElement("span");
        badge.className = "sn-cc-tm-badge";
        var tmName = cl.teammates[ti];
        badge.textContent = tmName.length > 14 ? tmName.substring(0, 14) + "..." : tmName;
        if (tmName.length > 14) badge.title = tmName;
        tmRow.appendChild(badge);
      }
      infoCol.appendChild(tmRow);
    }

    // イクラ表示
    var eggRow = document.createElement("div");
    eggRow.className = "sn-cc-egg-row";

    // 金イクラ（WAVE合計）
    var goldSum = 0;
    if (cl.waveEggs) {
      for (var e = 0; e < cl.waveEggs.length; e++) goldSum += cl.waveEggs[e];
    }
    var goldWrap = document.createElement("span");
    goldWrap.className = "sn-cc-egg";
    var goldImg = document.createElement("img");
    goldImg.src = ICON_DIR + "icon_goldenegg.png";
    goldImg.alt = "金イクラ";
    goldWrap.appendChild(goldImg);
    var goldText = document.createElement("span");
    goldText.className = "sn-cc-egg-num";
    goldText.textContent = "x" + goldSum;
    goldWrap.appendChild(goldText);
    eggRow.appendChild(goldWrap);

    // 赤イクラ
    if (cl.redEggs != null) {
      var redWrap = document.createElement("span");
      redWrap.className = "sn-cc-egg";
      var redImg = document.createElement("img");
      redImg.src = ICON_DIR + "icon_poweregg.png";
      redImg.alt = "赤イクラ";
      redWrap.appendChild(redImg);
      var redText = document.createElement("span");
      redText.className = "sn-cc-egg-num sn-cc-egg-red";
      redText.textContent = "x" + cl.redEggs;
      redWrap.appendChild(redText);
      eggRow.appendChild(redWrap);
    }

    infoCol.appendChild(eggRow);

    // WAVE内訳
    if (cl.waveEggs && cl.waveEggs.length > 0) {
      var waveDetail = document.createElement("div");
      waveDetail.className = "sn-cc-wave-detail";
      for (var w = 0; w < cl.waveEggs.length; w++) {
        var wSpan = document.createElement("span");
        wSpan.className = "sn-cc-wave-item";
        var wLabel = document.createTextNode("W" + (w + 1) + " ");
        wSpan.appendChild(wLabel);
        var wImg = document.createElement("img");
        wImg.src = ICON_DIR + "icon_goldenegg.png";
        wImg.alt = "金イクラ";
        wImg.className = "sn-cc-wave-egg-icon";
        wSpan.appendChild(wImg);
        var wNum = document.createTextNode("x" + cl.waveEggs[w]);
        wSpan.appendChild(wNum);
        waveDetail.appendChild(wSpan);
      }
      infoCol.appendChild(waveDetail);
    }

    // 日時
    if (cl.reportedAt) {
      var dateSpan = document.createElement("div");
      dateSpan.className = "sn-cc-date";
      dateSpan.textContent = cl.reportedAt;
      infoCol.appendChild(dateSpan);
    }

    card.appendChild(infoCol);
    return card;
  }

  // === 検索 ===
  searchExecBtn.addEventListener("click", function () {
    var filterStage = searchStage.value;
    var filterMode = searchCurrentMode;
    var filterMinRaw = searchDangerMin.value;
    var filterMaxRaw = searchDangerMax.value;
    var filterMin = filterMinRaw ? parseInt(filterMinRaw, 10) : 0;
    var filterMax = filterMaxRaw ? parseInt(filterMaxRaw, 10) : 999;

    // ブキフィルタ: プライベート時は無視
    var filterWeaponNames = [];
    if (filterMode !== "private") {
      for (var w = 0; w < searchSelectedWeapons.length; w++) {
        var wn = searchSelectedWeapons[w].name === "？(金)" ? "？" : searchSelectedWeapons[w].name;
        filterWeaponNames.push(wn);
      }
    }

    // WAVEフィルタ: 検索フォームのWAVEカードから条件取得
    var searchWaveCards = document.querySelectorAll(".search-wave-card");
    var waveFilters = [];
    for (var wc = 0; wc < searchWaveCards.length; wc++) {
      var waveNum = searchWaveCards[wc].getAttribute("data-wave");
      var sTide = searchWaveCards[wc].querySelector(".search-wave-tide");
      var sEvent = searchWaveCards[wc].querySelector(".search-wave-event");
      var sClear = searchWaveCards[wc].querySelector(".search-wave-clear");
      var sBoss = searchWaveCards[wc].querySelector(".search-wave-boss");
      var f = { wave: waveNum };
      if (sTide) f.tide = sTide.value;
      if (sEvent) f.event = sEvent.value;
      if (sClear) f.clear = sClear.value;
      if (sBoss) f.boss = sBoss.value;
      // いずれか条件があるときだけフィルタに追加
      if (f.tide || f.event || f.clear || f.boss) {
        waveFilters.push(f);
      }
    }

    // クライアント側フィルタリング関数
    function clientFilter(scenarios) {
      var results = [];
      for (var i = 0; i < scenarios.length; i++) {
        var sc = scenarios[i];
        if (sc.isPrivate) continue;
        if (filterStage && sc.stage !== filterStage) continue;
        if (filterMode && sc.mode !== filterMode) continue;
        if (sc.danger < filterMin || sc.danger > filterMax) continue;

        if (filterWeaponNames.length > 0) {
          var scWeapons = (sc.weapons || []).slice();
          var weaponMatch = true;
          var usedIndices = [];
          for (var fw = 0; fw < filterWeaponNames.length; fw++) {
            var found = false;
            for (var sw = 0; sw < scWeapons.length; sw++) {
              if (usedIndices.indexOf(sw) >= 0) continue;
              if (scWeapons[sw] === filterWeaponNames[fw]) {
                usedIndices.push(sw);
                found = true;
                break;
              }
            }
            if (!found) { weaponMatch = false; break; }
          }
          if (!weaponMatch) continue;
        }

        if (waveFilters.length > 0) {
          var waveMatch = true;
          for (var wf = 0; wf < waveFilters.length; wf++) {
            var flt = waveFilters[wf];
            if (flt.wave === "extra") {
              if (!sc.extra) { waveMatch = false; break; }
              if (flt.tide && sc.extra.tide !== flt.tide) { waveMatch = false; break; }
              if (flt.boss && sc.extra.boss !== flt.boss) { waveMatch = false; break; }
            } else {
              var wIdx = parseInt(flt.wave, 10) - 1;
              if (!sc.waves || !sc.waves[wIdx]) { waveMatch = false; break; }
              var scWave = sc.waves[wIdx];
              if (flt.tide && scWave.tide !== flt.tide) { waveMatch = false; break; }
              if (flt.event && scWave.event !== flt.event) { waveMatch = false; break; }
              if (flt.clear && scWave.clear !== flt.clear) { waveMatch = false; break; }
            }
          }
          if (!waveMatch) continue;
        }

        results.push(sc);
      }
      return results;
    }

    function showSearchResults(results) {
      collapseSearchForm();
      searchResults.innerHTML = "";
      allDividers = [];
      var countEl = document.getElementById("search-result-count");
      if (results.length === 0) {
        countEl.textContent = "条件に一致するシナリオが見つかりません";
      } else {
        countEl.textContent = results.length + "件のシナリオが見つかりました。";
      }
      if (results.length > 0) {
        results.sort(function (a, b) { return (b.postedAt || "").localeCompare(a.postedAt || ""); });
        for (var j = 0; j < results.length; j++) {
          searchResults.appendChild(buildCard(results[j]));
        }
        requestAnimationFrame(refreshDividers);
      }
      window.scrollTo(0, 0);
    }

    if (useFirebase) {
      var fbFilters = {};
      if (filterMode) fbFilters.mode = filterMode;
      if (filterStage) fbFilters.stage = filterStage;
      FB.searchScenarios(fbFilters, function (err, scenarios) {
        if (err) { alert("検索エラー: " + err.message); return; }
        showSearchResults(clientFilter(scenarios));
      });
    } else {
      showSearchResults(clientFilter(MOCK_SCENARIOS));
    }
  });

  // === 最近の投稿を描画 ===
  function renderRecent() {
    var recentList = document.getElementById("recent-list");
    recentList.innerHTML = "";
    allDividers = [];

    function renderList(list) {
      var sorted = list.filter(function (s) { return !s.isPrivate; });
      sorted.sort(function (a, b) { return (b.postedAt || "").localeCompare(a.postedAt || ""); });
      for (var i = 0; i < sorted.length; i++) {
        recentList.appendChild(buildCard(sorted[i]));
      }
      requestAnimationFrame(refreshDividers);
    }

    if (useFirebase) {
      FB.getRecent(function (err, results) {
        if (err) { console.error("最近の投稿取得エラー:", err); renderList(MOCK_SCENARIOS); return; }
        if (results.length > 0) { renderList(results); } else { renderList(MOCK_SCENARIOS); }
      });
    } else {
      renderList(MOCK_SCENARIOS);
    }
  }

  // 初期化
  applyMode();
  renderWeaponSlots();
  renderRecent();

  // リサイズ時に点線を再描画
  window.addEventListener("resize", function () { requestAnimationFrame(refreshDividers); });
})();

