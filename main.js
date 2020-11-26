//基础路径
global.BasicsPath = __dirname; 
//导入配置
global.config = require(BasicsPath + "/config/config.js");

const Lesia = require("./js/ai/Lesia");
const service = require("./js/service/service");

global.ai = new Lesia(config.master.name);

let myService = new service();
ai.open();
myService.open();
