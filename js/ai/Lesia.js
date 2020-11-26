let utils = require("../utils");
utils = new utils();

class Lesia {
  constructor(master) {
    this.myMaster = master;
    this.myList = new Map();//直连列表
    this.serviceList = new Map();//服务链接列表
  }
  open(sheen = false) {
    console.log("hello " + this.myMaster + "!");
    utils.countTimer(sheen);
    this.wsLink();
  }
  wsLink() {
    utils.wsLink(this.passageway, config.serverOptions.lesaiPort);
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
      opposite.sendText(utils.wsMsgTemplate(toMsg));
    };
    switch (code) {
      case 1:
        toMsg.msg = "Lesia为您服务！";
        send();
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
    let adopt = ture;
    return adopt;
  }
  //ws监听
  wsMointor(wsObj) {
    // subject, userList, msg
    let adopt = ture;
    let { subject, userList, msg } = wsObj;
    this.serviceList = userList;
    let toMsg = {
      code: msg.code,
      state: true,
      source: "Lesia",
      msg: "",
    }
    let send = () => {
      subject.sendText(utils.wsMsgTemplate(toMsg));
    };
    let to = (user) => {
      userList.forEach((item, key) => {
        if (key == user) {
          item.sendText(utils.wsMsgTemplate(toMsg));
          subject.sendText(utils.wsMsgTemplate({
            code: 100,//回调
            state: true,
            source: "Lesia"
          }))
        }
      });
    };
    let broadcast = () => {
      userList.forEach(item => {
        item.sendText(utils.wsMsgTemplate(toMsg));
      });
    }

    return adopt;
  }
}

module.exports = Lesia;
