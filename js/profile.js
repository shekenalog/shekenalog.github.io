// プロフィールページ
(function () {
  var ICON_DIR = "png/";
  var useFirebase = window.FB && window.FB.available;

  var loginPrompt = document.getElementById("login-prompt");
  var profMain = document.getElementById("prof-main");
  var profAvatar = document.getElementById("prof-avatar");
  var profName = document.getElementById("prof-name");
  var profEditBtn = document.getElementById("prof-edit-btn");
  var profLogoutBtn = document.getElementById("prof-logout-btn");
  var profLoginBtn = document.getElementById("prof-login-btn");
  var profContent = document.getElementById("prof-content");
  var tabs = document.querySelectorAll(".prof-tab");

  var currentTab = "scenarios";

  var STAGE_ICONS_HIGH = {
    "シェケナダム": "stage_spawning_grounds_high.jpg",
    "難破船ドン・ブラコ": "stage_marooners_bay_high.jpg",
    "アラマキ砦": "stage_sockeye_station_high.jpg",
    "ムニ・エール海洋発電所": "stage_gone_fission_hydroplant_high.jpg",
    "すじこジャンクション跡": "stage_jammin_salmon_junction_high.jpg",
    "トキシラズいぶし工房": "stage_salmonid_smokeyard_high.jpg",
    "どんぴこ闘技場": "stage_bonerattle_arena_high.jpg"
  };

  if (!useFirebase) {
    loginPrompt.style.display = "";
    return;
  }

  profLoginBtn.addEventListener("click", function () { FB.signIn(); });

  FB.onAuthChange(function (user) {
    if (user) {
      if (user.needsName) {
        showNameModal(user.displayName);
        return;
      }
      loginPrompt.style.display = "none";
      profMain.style.display = "";
      updateProfileCard(user);
      loadTab(currentTab);
    } else {
      loginPrompt.style.display = "";
      profMain.style.display = "none";
    }
  });

  // === プロフィールカード ===
  function updateProfileCard(user) {
    profAvatar.style.backgroundColor = FB.avatarColor(user.uid);
    var ch = (user.displayName || "").charAt(0);
    var isJp = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFFa-zA-Z0-9]/.test(ch);
    if (isJp) {
      profAvatar.textContent = ch;
    } else {
      profAvatar.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
    }
    profName.textContent = user.displayName;
  }

  // 名前編集
  profEditBtn.addEventListener("click", function () {
    showNameModal(FB.currentUser ? FB.currentUser.displayName : "");
  });

  // ログアウト
  profLogoutBtn.addEventListener("click", function () {
    if (confirm("ログアウトしますか？")) {
      FB.signOut();
      window.location.href = "index.html";
    }
  });

  // 表示名設定モーダル（auth_ui.jsと同じ）
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
    desc.textContent = "この名前が投稿時に表示されます。";
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

  // === タブ切替 ===
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove("active");
      this.classList.add("active");
      currentTab = this.dataset.tab;
      loadTab(currentTab);
    });
  }

  function loadTab(tab) {
    profContent.innerHTML = '<div class="prof-loading">読み込み中...</div>';
    if (tab === "scenarios") loadMyScenarios();
    else if (tab === "clears") loadMyClears();
    else if (tab === "bookmarks") loadBookmarks();
  }

  // === ヘルパー ===
  function findScheduleByNo(no) {
    if (!no || typeof SCHEDULE_DATA === "undefined") return null;
    for (var i = 0; i < SCHEDULE_DATA.length; i++) {
      if (SCHEDULE_DATA[i].no === no) return SCHEDULE_DATA[i];
    }
    return null;
  }

  function buildWeaponsDiv(sc) {
    var div = document.createElement("div");
    div.className = "sc-weapons";
    if (sc.mode === "private" || !sc.weapons || sc.weapons.length === 0) {
      for (var i = 0; i < 4; i++) {
        var img = document.createElement("img");
        img.src = ICON_DIR + "weapon_free_private.png";
        img.alt = "フリー";
        div.appendChild(img);
      }
    } else {
      for (var j = 0; j < sc.weapons.length; j++) {
        var wName = sc.weapons[j];
        var wImg = document.createElement("img");
        if (wName === "？(金)") {
          wImg.src = ICON_DIR + "weapon_random_rare.png";
        } else if (wName === "？") {
          wImg.src = ICON_DIR + "weapon_random.png";
        } else {
          wImg.src = ICON_DIR + (WEAPON_ICONS[wName] || "weapon_random.png");
        }
        wImg.alt = wName;
        wImg.title = wName;
        div.appendChild(wImg);
      }
    }
    return div;
  }

  // === シナリオカード（簡易版） ===
  function buildScenarioCard(sc) {
    var card = document.createElement("div");
    card.className = "sn-card";

    // モードバッジ + キケン度
    var modeRow = document.createElement("div");
    modeRow.className = "sn-mode-row";
    var badge = document.createElement("span");
    badge.className = "sn-mode-badge";
    if (sc.mode === "private") badge.classList.add("sn-mode-private");
    badge.textContent = sc.mode === "private" ? "プライベートバイト" : "いつものバイト";
    modeRow.appendChild(badge);
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
    card.appendChild(modeRow);

    // 開催情報
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
      card.appendChild(dateRow);
    }

    // ステージ + ブキ
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

    // コード
    var codeBox = document.createElement("div");
    codeBox.className = "sn-code-box";
    var codeSpan = document.createElement("span");
    codeSpan.className = "sn-code";
    codeSpan.textContent = sc.code;
    codeBox.appendChild(codeSpan);
    card.appendChild(codeBox);

    // フッター
    var footer = document.createElement("div");
    footer.className = "sn-footer";
    var meta = document.createElement("div");
    meta.className = "sn-footer-meta";
    var posted = document.createElement("span");
    posted.className = "sn-posted-date";
    posted.textContent = sc.postedAt;
    meta.appendChild(posted);
    footer.appendChild(meta);
    card.appendChild(footer);

    return card;
  }

  // === バイトシナリオ（自分の投稿） ===
  function loadMyScenarios() {
    FB.getMyScenarios(function (err, results) {
      profContent.innerHTML = "";
      if (err) { profContent.innerHTML = '<div class="prof-empty">読み込みに失敗しました: ' + err.message + '</div>'; console.error(err); return; }
      if (!results || results.length === 0) {
        profContent.innerHTML = '<div class="prof-empty">投稿したシナリオはまだありません</div>';
        return;
      }
      for (var i = 0; i < results.length; i++) {
        profContent.appendChild(buildScenarioCard(results[i]));
      }
    });
  }

  // === クリア記録（自分の報告） ===
  function loadMyClears() {
    FB.getMyClears(function (err, results) {
      profContent.innerHTML = "";
      if (err) { profContent.innerHTML = '<div class="prof-empty">読み込みに失敗しました: ' + err.message + '</div>'; console.error(err); return; }
      if (!results || results.length === 0) {
        profContent.innerHTML = '<div class="prof-empty">クリア報告はまだありません</div>';
        return;
      }
      for (var i = 0; i < results.length; i++) {
        profContent.appendChild(buildClearCard(results[i]));
      }
    });
  }

  function buildClearCard(clear) {
    var card = document.createElement("div");
    card.className = "prof-clear-card";

    var scenarioLink = document.createElement("div");
    scenarioLink.className = "prof-clear-scenario";
    scenarioLink.textContent = "シナリオ: " + clear.scenarioId;
    card.appendChild(scenarioLink);

    // 金イクラ
    var eggs = document.createElement("div");
    eggs.className = "prof-clear-eggs";
    if (clear.waveEggs) {
      var goldImg = '<img src="' + ICON_DIR + 'icon_goldenegg.png" alt="金">';
      var total = 0;
      for (var i = 0; i < clear.waveEggs.length; i++) total += (clear.waveEggs[i] || 0);
      eggs.innerHTML = goldImg + " " + total;
      if (clear.redEggs) {
        eggs.innerHTML += "　<img src='" + ICON_DIR + "icon_poweregg.png' alt='赤'> " + clear.redEggs;
      }
    }
    card.appendChild(eggs);

    // チームメイト
    if (clear.teammates && clear.teammates.length > 0) {
      var tm = document.createElement("div");
      tm.style.cssText = "font-size:0.8rem;color:#aaa;margin-bottom:0.3rem;";
      tm.textContent = "メンバー: " + clear.userName + ", " + clear.teammates.join(", ");
      card.appendChild(tm);
    }

    // 日時
    var date = document.createElement("div");
    date.className = "prof-clear-date";
    date.textContent = clear.reportedAt || "";
    card.appendChild(date);

    return card;
  }

  // === ブックマーク（未実装） ===
  function loadBookmarks() {
    profContent.innerHTML = '<div class="prof-empty">ブックマーク機能は準備中です</div>';
  }
})();
