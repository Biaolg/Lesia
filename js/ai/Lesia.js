let utils = require("../utils");
class Lesia {
  constructor(master) {
    this.myMaster = master;
    this.mood = 0;
    this.rate = 1000;
    this.tool = new utils();
    this.myList = new Map(); //直连列表
    this.serviceList = new Map(); //服务链接列表
  }
  open(sheen = true) {
    console.log("hello " + this.myMaster + "!");
    this.tool.countTimer(sheen);
    this.wsLink();
    setInterval(this.selfDiscipline, this.rate);
  }
  wsLink() {
    this.tool.wsLink(this.passageway, config.serverOptions.lesaiPort);
  }
  //通道
  passageway(opposite, oppoList, msg) {
    this.myList = oppoList;
    let code = msg.code;
    let toMsg = {
      code: msg.code,
      state: true,
      source: "Lesia",
      msg: "",
    };
    let send = () => {
      //返回
      opposite.sendText(this.tool.wsMsgTemplate(toMsg));
    };
    let to = (user) => {
      //单独通信
      oppoList.forEach((item, key) => {
        if (key == user) {
          item.sendText(this.tool.wsMsgTemplate(toMsg));
          subject.sendText(
            this.tool.wsMsgTemplate({
              code: 100, //回调
              state: true,
              source: "Lesia",
            })
          );
        }
      });
    };
    let broadcast = () => {
      //广播
      oppoList.forEach((item) => {
        item.sendText(this.tool.wsMsgTemplate(toMsg));
      });
    };
    switch (code) {
      case 1:
        toMsg.msg = "Lesia为您服务！";
        send();
        break;
      case "root":
        try {
          eval(msg.msg);
          toMsg.msg = "程序执行成功";
          send();
        } catch (error) {
          toMsg.msg = error;
          send();
        }
        break;
      default:
        toMsg.code = 1000;
        toMsg.state = false;
        toMsg.msg = "Lesia异常错误！";
        send();
    }
  }
  //http监听
  httpMonitor(req, res) {
    let adopt = true;
    return adopt;
  }
  //ws服务监听
  wsMointor(wsObj) {
    // subject, userList, msg
    let adopt = true;
    let { subject, userList, msg } = wsObj;
    this.serviceList = userList;
    let toMsg = {
      code: msg.code,
      state: true,
      source: "Lesia",
      msg: "",
    };
    let send = () => {
      subject.sendText(this.tool.wsMsgTemplate(toMsg));
    };
    let to = (user) => {
      userList.forEach((item, key) => {
        if (key == user) {
          item.sendText(this.tool.wsMsgTemplate(toMsg));
          subject.sendText(
            this.tool.wsMsgTemplate({
              code: 100, //回调
              state: true,
              source: "Lesia",
            })
          );
        }
      });
    };
    let broadcast = () => {
      userList.forEach((item) => {
        item.sendText(this.tool.wsMsgTemplate(toMsg));
      });
    };

    return adopt;
  }
  //自律器
  selfDiscipline() {
    this.mood -= 0.01;
  }
}

module.exports = Lesia;
