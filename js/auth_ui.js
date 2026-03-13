// 全ページ共通: 認証UI（ヘッダー右上のログインボタン/アバター）
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
  userInfo.appendChild(avatar);
  area.appendChild(userInfo);

  header.appendChild(area);

  // イベント
  FB.onAuthChange(function (user) {
    if (user) {
      loginBtn.style.display = "none";
      userInfo.style.display = "";
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
    } else {
      loginBtn.style.display = "";
      userInfo.style.display = "none";
    }
  });

  loginBtn.addEventListener("click", function () { FB.signIn(); });
  avatar.addEventListener("click", function () {
    if (confirm("ログアウトしますか？")) FB.signOut();
  });
})();
