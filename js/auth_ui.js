// 全ページ共通: 認証UI（ヘッダー右上のログインボタン/アバター）+ 表示名設定モーダル
(function () {
  var header = document.querySelector(".header-inline");
  if (!header) return;

  // auth-areaが既にあれば（record.html）スキップ
  if (document.getElementById("auth-area")) return;

  var useFirebase = window.FB && window.FB.available;
  if (!useFirebase) return;

  // DOM生成
  var area = document.createElement("div");
  area.id = "auth-area";

  var loginBtn = document.createElement("button");
  loginBtn.className = "auth-btn";
  loginBtn.textContent = "ログイン";
  loginBtn.style.display = "none";
  area.appendChild(loginBtn);

  var userInfo = document.createElement("div");
  userInfo.id = "auth-user-info";
  userInfo.style.display = "none";
  var avatar = document.createElement("div");
  avatar.className = "auth-avatar";
  var userName = document.createElement("span");
  userName.className = "auth-user-name";
  userInfo.appendChild(avatar);
  userInfo.appendChild(userName);
  area.appendChild(userInfo);

  header.appendChild(area);

  // 表示名設定モーダル
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

  // アバター表示更新
  function updateAvatar(user) {
    avatar.style.backgroundColor = FB.avatarColor(user.uid);
    var ch = (user.displayName || "").charAt(0);
    var isJpChar = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFFa-zA-Z0-9]/.test(ch);
    if (isJpChar) {
      avatar.textContent = ch;
    } else {
      avatar.textContent = "";
      avatar.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
    }
    avatar.title = user.displayName;
    userName.textContent = user.displayName;
  }

  // イベント
  FB.onAuthChange(function (user) {
    if (user) {
      if (user.needsName) {
        showNameModal(user.displayName);
        return;
      }
      loginBtn.style.display = "none";
      userInfo.style.display = "";
      updateAvatar(user);
    } else {
      loginBtn.style.display = "";
      userInfo.style.display = "none";
    }
  });

  loginBtn.addEventListener("click", function () { FB.signIn(); });
  avatar.addEventListener("click", function () {
    window.location.href = "profile.html";
  });
})();
