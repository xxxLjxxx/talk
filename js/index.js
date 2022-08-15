(async function () {
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    // 目前是登陆失败的状态
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }
  // 获取元素
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    text : $("#txtMsg"),
    send : $(".msg-container")
  };
  // 设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }
  setUserInfo();
  // 设置关闭按钮的事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };
  // 加载历史记录
  async function localHistory() {
    const historyArr = await API.getHistory();
    historyArr.data.map((value) => {
      addChat(value);
    });
    scrollBottom();
  }
  localHistory();
  // 添加聊天记录
  function addChat(chatInfo) {
    const div = $$$("div");
    div.className = "chat-item";
    if (chatInfo.from) {
      div.className = "chat-item me";
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    if (chatInfo.from) {
      img.src = "./asset/avatar.png";
    } else {
      img.src = "./asset/robot-avatar.jpg";
    }
    const message = $$$("div");
    message.classList.add("chat-content");
    message.innerText = chatInfo.content;
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(chatInfo.createdAt);
    doms.chatContainer.appendChild(div);
    div.appendChild(img);
    div.appendChild(message);
    div.appendChild(date);
  }
  // 时间戳设置时间
  function formatDate(timeStamp) {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 滚轮滑到底部
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  // 发送信息
 async function sendChat() {
    const content = doms.text.value.trim();
    if(!content) {
        return;
    }
    addChat({
        from : user.loginId,
        to : null,
        createdAt : Date.now(),
        content : content
    })
    doms.text.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
        from : null,
        to : user.loginId,
        ...resp.data,
    })
    scrollBottom();
   window.sendChat = sendChat;
  }
  // 表单绑定提交事件
  doms.send.onsubmit = function(e) {
    e.preventDefault();
    sendChat();
  }
})();
