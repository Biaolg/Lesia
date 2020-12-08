window.template = {
  userName: "",
  code: 1000,
  msg: "",
  toUser: "",
  yourColor: null,
};
window.userList = [];

function wsLink() {
  let ws = new WebSocket("ws" + config.httpPath + config.wsPort);
  ws.onopen = function (evt) {
    console.log(evt);
    window.ws = ws;
  };
  ws.onclose = function (evt) {
    console.log(evt);
  };
  ws.onmessage = function (evt) {
    msghandle(evt);
  };
  ws.onerror = function (evt) {
    console.log(evt);
  };
}

function Template(msg = template) {
  return JSON.stringify(msg);
}

function msghandle(evt) {
  let msg = JSON.parse(evt.data);
  console.log(msg);

  switch (msg.code) {
    case 0:
      if (msg.state) {
        userList = msg.msg;
        template.yourColor = msg.yourColor;
        getDom("#land").style.opacity = "0";
        getDom("#land").style.zIndex = "-1";
      } else {
        getDom("#landTitle").innerText = msg.msg;
      }
      break;
    case 1:
      if (msg.state) {
        msgUi(msg);
      }
      break;
    case 11:
      userList.push(msg.msg);
      break;
  }
}

function msgUi(msg) {
  let color = "rgba(";
  msg.yourColor.color.forEach((item, index) => {
    color += item+",";
  });
  color += "0.7)";
  console.log(color);

  let fcolor = "rgba(";
  msg.yourColor.fanColor.forEach((item, index) => {
    fcolor += item+",";
  });
  fcolor += "0.5)";

  let tem = `<div class="item"><div class="head" style="color:${color};background-color:${fcolor}">${msg.userName}</div><div class="msg" style="color:${fcolor};background-color:${color}">${msg.msg}</div></div>`;
  let temR = `<div class="r"><div class="item"><div class="msg" style="color:${color};background-color:${fcolor}">${msg.msg}</div><div class="head" style="color:${fcolor};background-color:${color}">${msg.userName}</div></div></div>`;
  if (msg.userName == template.userName) {
    getDom("#list").innerHTML += temR;
  } else {
    getDom("#list").innerHTML += tem;
  }
}
