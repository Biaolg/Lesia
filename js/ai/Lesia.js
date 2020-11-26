let utils = require("../utils");
utils = new utils();

class Lesia {
  constructor(master) {
    this.myMaster = master;
    this.userList = new Map();
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
    this.userList = oppoList;
    let code = msg.code;
    let toMsg = {
      code: msg.code,
      state: true,
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
  httpMonitor(reqObj) {}
  //ws监听
  wsMointor(wsObj) {
    // subject, userList, msg
    let {subject, userList, msg} = wsObj;
    if(msg.code == 0)
  }
}

module.exports = Lesia;
