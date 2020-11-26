//数据库配置

//邮箱授权码XJRSISFKUOZQJIEK

exports.databaseOptions = {
  //数据库名称
  database: "Lesia",

  //数据库用户名
  user: "root",

  //数据库密码
  password: "135360Biaolgmysql",

  //数据地址
  host: "112.74.50.101",

  //连接数据库类型
  dialect: "mysql",

  //时区
  timezone: "+08:00",

  //设置连接池
  pool: {
    //最大连接数
    max: 10,

    //最小连接数
    min: 0,

    //连接超时30s,自动释放
    acquire: 30000,

    //闲置时间10s,自动释放
    idle: 10000,
  },
};

//服务器配置
exports.serverOptions = {
  host: "http://112.74.50.101",
  lesaiPort: 64200,
  httpPort: 64201,
  wsPort: 64202,
};

exports.master ={
    name:"Biaolg"
}

//加盐配置
exports.saltOptions = {
  //密码加盐
  psswordSalt: "_pw",
};

//发邮件配置
exports.emailOptions = {
  //主机
  host: "smtp.126.com",

  //端口, 25端口在阿里云服务器禁用，建议统一使用465端口
  port: 465,

  //当端口为465，需要设置为true
  secure: true,

  //身份验证
  auth: {
    user: "biaolg126@126.com",
    pass: "XJRSISFKUOZQJIEK",
  },
};

//token的过期时间
exports.tokenOptions = {
  expires: "5d",
  //token加盐
  tokenSalt: "_tk",
};
