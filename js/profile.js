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

  // === ヘルパー（scenario.jsと同じ） ===
  var allDividers = [];

  function findScheduleByNo(no) {
    if (!no || typeof SCHEDULE_DATA === "undefined") return null;
    for (var i = 0; i < SCHEDULE_DATA.length; i++) {
      if (SCHEDULE_DATA[i].no === no) return SCHEDULE_DATA[i];
    }
    return null;
  }

  function formatDate(dateStr) {
    var parts = dateStr.split(" ");
    var md = parts[0];
    var time = parts[1] || "";
    return md + " " + time;
  }

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

  // === ノルマテーブル ===
  var QUOTA_TABLE = [
    [3.8,3,4,5],[7.8,4,5,6],[11.8,5,6,7],[15.8,6,7,8],[19.8,7,8,9],
    [29.8,8,9,10],[39.8,8,9,11],[49.8,9,10,12],[59.8,10,11,13],[69.8,11,12,14],
    [79.8,12,13,15],[86.6,13,14,16],[93.2,14,15,17],[99.8,15,16,18],[109,16,17,19],
    [118,17,18,20],[119.8,17,19,21],[127.2,18,19,21],[129.8,18,20,22],[136.2,19,20,22],
    [139.8,19,21,23],[145.4,20,21,23],[149.8,20,22,24],[154.4,21,22,24],[159.8,21,23,25],
    [163.6,22,23,25],[169.8,22,24,26],[172.6,23,24,26],[179.8,23,25,27],[181.8,24,25,27],
    [189.8,24,26,28],[190.8,25,26,28],[199.8,25,27,29],[226.4,26,28,30],[233.2,26,28,31],
    [253,27,29,31],[266.4,27,29,32],[279.6,28,30,32],[299.6,28,30,33],[306.2,29,31,33],
    [332.8,29,31,34],[333,30,32,35]
  ];

  function calcQuota(danger, waveNum) {
    for (var i = 0; i < QUOTA_TABLE.length; i++) {
      if (danger <= QUOTA_TABLE[i][0]) return QUOTA_TABLE[i][waveNum];
    }
    return QUOTA_TABLE[QUOTA_TABLE.length - 1][waveNum];
  }

  // === WAVE正方形 ===
  function buildWaveSquare(wv, isEx, danger) {
    var sq = document.createElement("div");
    sq.className = "sn-wave-square";
    var label = document.createElement("div");
    label.className = "sn-wave-label";
    label.textContent = isEx ? "EX-WAVE" : "WAVE" + wv.wave;
    sq.appendChild(label);
    var band = document.createElement("div");
    band.className = "sn-wave-quota-band";
    var bandText = document.createElement("span");
    bandText.className = "sn-wave-quota-text";
    if (isEx) {
      bandText.textContent = wv.boss || "";
    } else {
      bandText.textContent = "ノルマ " + calcQuota(danger, wv.wave);
    }
    band.appendChild(bandText);
    sq.appendChild(band);
    var tide = document.createElement("div");
    tide.className = "sn-wave-tide";
    tide.textContent = wv.tide || "";
    sq.appendChild(tide);
    var eventEl = document.createElement("div");
    eventEl.className = "sn-wave-event";
    var fullName = isEx ? "" : (wv.event || "");
    eventEl.textContent = fullName === "昼" ? "-" : fullName;
    sq.appendChild(eventEl);
    if (wv.clear && !isEx) {
      var clearSpan = document.createElement("span");
      clearSpan.className = "sn-wave-clear";
      if (wv.clear === "GJ") clearSpan.classList.add("sn-wave-clear-gj");
      if (wv.clear === "NG") clearSpan.classList.add("sn-wave-clear-ng");
      clearSpan.textContent = wv.clear === "GJ" ? "GJ!" : wv.clear;
      sq.appendChild(clearSpan);
    }
    if (wv.clear === "NG" && !isEx) bandText.style.opacity = "0.6";
    if (wv.tide) {
      var tideLevel = wv.tide === "干潮" ? 0.20 : wv.tide === "満潮" ? 0.85 : 0.50;
      var RANGE_TOP = 44;
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
      var pathD = "";
      for (var p = 0; p <= pts; p++) {
        var x = (p / pts) * 600;
        var y = waveY + amp * Math.cos((p / pts) * NUM_WAVES * 2 * Math.PI);
        pathD += (p === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      }
      pathD += "L600,100L0,100Z";
      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathD);
      path.setAttribute("fill", "#ccd35c");
      svg.appendChild(path);
      waveBg.appendChild(svg);
      sq.appendChild(waveBg);
    }
    return sq;
  }

  function applySquareRadii(container) {
    var squares = container.children;
    if (squares.length === 0) return;
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
    if (hasEx) {
      squares.appendChild(buildWaveSquare({ tide: sc.extra.tide, boss: sc.extra.boss, clear: null }, true, sc.danger));
    }
    strip.appendChild(squares);
    requestAnimationFrame(function() { applySquareRadii(squares); });
    var resizeObserver = new ResizeObserver(function() { applySquareRadii(squares); });
    resizeObserver.observe(squares);
    return strip;
  }

  // バッジテキスト切替
  function updateBadgeTexts() {
    var narrow = window.innerWidth <= 450;
    var badges = document.querySelectorAll(".sn-mode-badge");
    for (var i = 0; i < badges.length; i++) {
      var b = badges[i];
      if (b.dataset.full) b.textContent = narrow ? b.dataset.short : b.dataset.full;
    }
  }
  window.addEventListener("resize", updateBadgeTexts);

  // === シナリオカード（完全版） ===
  function buildScenarioCard(sc) {
    var card = document.createElement("div");
    card.className = "sn-card";

    // モードバッジ + キケン度 + ブックマーク
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
    bmBtn.textContent = "☆ " + (sc.bookmarkCount || 0);
    bmBtn.addEventListener("click", function () {
      if (bmBtn.classList.toggle("sn-bookmarked")) {
        sc.bookmarkCount = (sc.bookmarkCount || 0) + 1;
        bmBtn.textContent = "★ " + sc.bookmarkCount;
      } else {
        sc.bookmarkCount = Math.max(0, (sc.bookmarkCount || 0) - 1);
        bmBtn.textContent = "☆ " + sc.bookmarkCount;
      }
    });
    modeRow.appendChild(bmBtn);
    card.appendChild(modeRow);

    // No + 年号 + 開催日時 / プライベート説明文
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
      dateSpan.textContent = formatDate(schedRec.startDate) + " - " + formatDate(schedRec.endDate);
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
    var stageName = document.createElement("span");
    stageName.className = "sc-stage-name";
    stageName.textContent = sc.stage;
    stageCol.appendChild(stageName);
    infoDiv.appendChild(stageCol);
    infoDiv.appendChild(buildWeaponsDiv(sc));
    card.appendChild(infoDiv);

    // 点線区切り
    card.appendChild(buildDottedDivider());

    // シナリオコード
    var codeBox = document.createElement("div");
    codeBox.className = "sn-code-box";
    var codeSpan = document.createElement("span");
    codeSpan.className = "sn-code";
    codeSpan.textContent = sc.code;
    codeBox.appendChild(codeSpan);
    card.appendChild(codeBox);

    // WAVEストリップ
    card.appendChild(buildWaveStrip(sc));

    // コメント
    if (sc.comment) {
      var comment = document.createElement("div");
      comment.className = "sn-comment";
      comment.textContent = sc.comment;
      card.appendChild(comment);
    }

    // フッター
    var footer = document.createElement("div");
    footer.className = "sn-footer";
    var metaLeft = document.createElement("div");
    metaLeft.className = "sn-footer-meta";
    var postedDate = document.createElement("span");
    postedDate.className = "sn-posted-date";
    postedDate.textContent = sc.postedAt;
    metaLeft.appendChild(postedDate);
    footer.appendChild(metaLeft);
    card.appendChild(footer);

    requestAnimationFrame(updateBadgeTexts);
    return card;
  }

  // === バイトシナリオ（自分の投稿） ===
  function loadMyScenarios() {
    FB.getMyScenarios(function (err, results) {
      profContent.innerHTML = "";
      if (err) { profContent.innerHTML = '<div class="prof-empty">読み込みに失敗しました</div>'; return; }
      if (!results || results.length === 0) {
        profContent.innerHTML = '<div class="prof-empty">投稿したシナリオはまだありません</div>';
        return;
      }
      var grid = document.createElement("div");
      grid.className = "sn-list";
      for (var i = 0; i < results.length; i++) {
        grid.appendChild(buildScenarioCard(results[i]));
      }
      profContent.appendChild(grid);
      requestAnimationFrame(refreshDividers);
    });
  }

  // === クリア記録（自分の報告） ===
  function loadMyClears() {
    FB.getMyClears(function (err, results) {
      profContent.innerHTML = "";
      if (err) { profContent.innerHTML = '<div class="prof-empty">読み込みに失敗しました</div>'; return; }
      if (!results || results.length === 0) {
        profContent.innerHTML = '<div class="prof-empty">クリア報告はまだありません</div>';
        return;
      }
      var grid = document.createElement("div");
      grid.className = "sn-list";
      profContent.appendChild(grid);

      // 各クリアの親シナリオを取得してカード生成
      var remaining = results.length;
      for (var i = 0; i < results.length; i++) {
        (function (clear, index) {
          FB.getScenario(clear.scenarioId, function (err2, sc) {
            if (!err2 && sc) {
              // シナリオカードにクリア情報を付加
              var card = buildScenarioCard(sc);
              // クリア結果セクションを点線の前に挿入
              var clearInfo = buildClearInfo(clear);
              card.appendChild(clearInfo);
              card._sortIndex = index;
              grid.appendChild(card);
            }
            remaining--;
            if (remaining === 0) {
              // 元の順序にソート
              var cards = Array.prototype.slice.call(grid.children);
              cards.sort(function (a, b) { return (a._sortIndex || 0) - (b._sortIndex || 0); });
              for (var k = 0; k < cards.length; k++) grid.appendChild(cards[k]);
              requestAnimationFrame(refreshDividers);
            }
          });
        })(results[i], i);
      }
    });
  }

  function buildClearInfo(clear) {
    var wrap = document.createElement("div");
    wrap.className = "prof-clear-info";

    // 金イクラ + 赤イクラ
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
    wrap.appendChild(eggs);

    // チームメイト
    if (clear.teammates && clear.teammates.length > 0) {
      var tm = document.createElement("div");
      tm.className = "prof-clear-teammates";
      tm.textContent = "メンバー: " + clear.userName + ", " + clear.teammates.join(", ");
      wrap.appendChild(tm);
    }

    // 報告日時
    if (clear.reportedAt) {
      var date = document.createElement("div");
      date.className = "prof-clear-date";
      date.textContent = "報告: " + clear.reportedAt;
      wrap.appendChild(date);
    }

    return wrap;
  }

  // === ブックマーク（未実装） ===
  function loadBookmarks() {
    profContent.innerHTML = '<div class="prof-empty">ブックマーク機能は準備中です</div>';
  }
})();
