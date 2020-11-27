//导入express
const express = require("express");

//导入body-parser模块
const bodyParser = require("body-parser");

//导入ejs, 渲染模板（html）
const ejs = require("ejs");

//导入path, 用于处理路径
const path = require("path");

//工具包
let utils = require("../utils");
const { autoInject } = require("async");
utils = new utils();

class Service {
  constructor() {}
  open() {
    this.httpRequest();
    this.wsCommunication();
  }
  //http
  httpRequest() {
    //创建express实例
    let app = express();

    //设置解析post请求体
    //将请求题解析为json格式
    app.use(bodyParser.json());

    //设置静态文件目录
    app.use(express.static(BasicsPath + "/public"));

    //extended: false可以接受任何数据类型，true: 可以接受字符串或者数组
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );

    //CORS 跨域资源共享
    //app.all(*)表示所有请求路径必须经过
    app.all("*", (req, res, next) => {
      let adopt = ai.httpMonitor(req, res); //ai监听

      //允许跨域地址
      res.header("Access-Control-Allow-Origin", req.headers.origin);

      //*表示允许所有域请求，在实际开发中，一般指定允许某个域请求，如上面设置
      // res.header("Access-Control-Allow-Origin", "*");

      //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
      res.header("Access-Control-Allow-Headers", "X-Requested-With");

      //该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

      //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
      res.header("Access-Control-Allow-Credentials", true);

      //允许通过
      adopt && next();
    });

    //设置模板渲染
    app.set("views", path.resolve(BasicsPath, "views"));

    //设置模板引擎类型
    app.set("view engine", "html");

    app.engine(".html", ejs.__express);

    app.get("/", (req, res) => {
      res.render("index");
    });

    this.route(app);
    //监听端口
    app.listen(config.serverOptions.httpPort, () => {
      console.log(
        config.serverOptions.host + ":" + config.serverOptions.httpPort
      );
    });
  }
  //路由
  route(app) {
    app.get("/runTimer", (req, res) => {
      //获取运行时间
      res.send({ msg: ai.tool.timer, code: 0 });
    });
  }
  //ws
  wsCommunication() {
    utils.wsLink(this.wsRoute);
  }
  //ws路由
  wsRoute(subject, userList, msg) {
    let adopt = ai.wsMointor({
      subject: subject,
      userList: userList,
      msg: msg,
    }); //开启ai监听

    if (!adopt) {
      return;
    }

    let code = msg.code;
    let toMsg = {
      code: msg.code,
      state: true,
      msg: "",
    };
    let send = () => {
      //返回
      subject.sendText(utils.wsMsgTemplate(toMsg));
    };
    let to = (user) => {
      //发送给某个用户
      userList.forEach((item, key) => {
        if (key == user) {
          item.sendText(utils.wsMsgTemplate(toMsg));
          subject.sendText(
            utils.wsMsgTemplate({
              code: 100, //回调
              state: true,
            })
          );
        }
      });
    };
    let broadcast = () => {
      //广播
      userList.forEach((item) => {
        item.sendText(utils.wsMsgTemplate(toMsg));
      });
    };
    switch (code) {
      case 1: //广播
        toMsg.msg = msg.msg;
        broadcast();
        break;
      case 2: //对话
        toMsg.msg = msg.msg;
        to();
        break;
      default:
        toMsg.code = 1000;
        toMsg.state = false;
        toMsg.msg = "异常错误！";
        send();
    }
  }
}

module.exports = Service;
