const fs = require("fs");
const request = require("request");
let ws = require("nodejs-websocket");

class utils {
  constructor() {
    this.timer = parseInt(
      fs.readFileSync(global.BasicsPath + "/journal/runTimer.txt")
    );
  }
  //时间转化
  secondsFormat(s) {
    var day = Math.floor(s / (24 * 3600));
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    return day + "天" + hour + "时" + minute + "分" + second + "秒";
  }
  //运行计时器
  countTimer(sheen = false) {
    if (this.timer != this.timer) {
      this.timer = 0;
    }
    let runDate = this.secondsFormat(this.timer++);

    if (sheen) {
      setTimeout(() => {
        this.countTimer(true);
      }, 1000);
    }

    fs.writeFile(
      global.BasicsPath + "/journal/runTimer.txt",
      this.timer + "\n" + runDate,
      function (err) {
        err && console.error(err);
      }
    );

    return this.timer;
  }
  randomColor(length = 3, dataMax = 256) {
    let array = [];
    for (let i = 0; i < length; i++) {
      array.push(parseInt(Math.random() * dataMax));
    }
    array[parseInt(Math.random() * 3)] = 255;
    let color = {
      color: array,
    };
    color.fanColor = array.map((item) => {
      return 255 - item;
    });
    return color;
  }
  //url 处理函数
  params(options) {
    let result = "";
    let item;
    let obj = options.data;
    for (item in obj) {
      if (obj[item] && String(obj[item])) {
        result += `&${item}=${obj[item]}`;
      }
    }
    if (result) {
      result = "?" + result.slice(1);
    }
    return options.url + result;
  }
  //发送get请求
  httpGet(options, fn) {
    if (options.url === undefined) {
      options.url = "https://www.baidu.com/";
    }

    if (options.data === undefined) {
      options.data = {};
      for (const key in options) {
        if (key != "url" && key != "data") {
          options.data[key] = options[key];
        }
      }
    }
    request.get(this.params(options), fn);
  }
  //webSocket
  wsLink(fnMsg, wsPort = config.serverOptions.wsPort) {
    let chatUsers = new Map();
    let service = ws
      .createServer(function (conn) {
        //普通消息
        conn.on("text", function (str) {
          let msg = {
            code: 1000,
          };
          let illegalVisit = (code, msg) => {
            let toMsg = {
              code: code,
              state: false,
              msg: msg,
            };
            toMsg = JSON.stringify(toMsg);
            conn.sendText(toMsg);
          };

          try {
            msg = JSON.parse(str);
          } catch {
            illegalVisit(1000, "非法访问");
          }

          if (msg.code == 1000) {
            return;
          }

          if (msg.code == 0) {
            if (chatUsers.has(msg.userName)) {
              illegalVisit(0, "用户名已存在");
            } else {
              chatUsers.forEach((item) => {
                item.sendText(
                  JSON.stringify({
                    code: 11, //进入广播
                    state: true,
                    userName: msg.userName,
                    msg: msg.userName,
                  })
                );
              });
              chatUsers.set(msg.userName, conn);
              if (chatUsers.has(msg.userName)) {
                fnMsg(conn, chatUsers, msg);
              } else {
                illegalVisit(1000, "非法访问,您未被Lesia记录！");
              }
            }
          }else{
            if (chatUsers.has(msg.userName)) {
              fnMsg(conn, chatUsers, msg);
            } else {
              illegalVisit(1000, "非法访问,您未被Lesia记录！");
            }
          }
        });

        conn.on("connect", function (code) {
          console.log("开启连接", code);
        });
        conn.on("close", function (code, reason) {
          console.log("关闭连接", code);

          chatUsers.forEach((value, key) => {
            if (Object.is(value, conn)) {
              chatUsers.delete(key);
            }
          });
        });
        conn.on("error", function (code, reason) {
          // 某些情况如果客户端多次触发连接关闭，会导致conn.close()出现异常，这里try/catch一下
          try {
            conn.close();
          } catch (error) {
            console.log("close异常", error);
          }
          console.log("异常关闭", code);

          chatUsers.forEach((value, key) => {
            if (Object.is(value, conn)) {
              chatUsers.delete(key);
            }
          });
        });
        // 所有连接释放时，清空用户
        service.on("close", () => {
          chatUsers.clear();
        });
      })
      .listen(wsPort);
    console.log(wsPort);
  }
  //wsMsgTemplate 消息模板
  wsMsgTemplate(
    obj = {
      code: 1,
      state: true,
      msg: "",
    }
  ) {
    return JSON.stringify(obj);
  }
}

module.exports = utils;
