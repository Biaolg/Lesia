function benhavior() {
  getDom("#landBtn").onclick = function (e) {
    let value = getDom("#landInput").value;
    if (value != "") {
      template.code = 0;
      template.userName = value;
      ws.send(Template());
      template.code = 1000;
    }
  };
  getDom("#chatBtn").onclick =function(e){
    let value = getDom("#chatInput").value;
    if(value!=""){
      template.code = 1;
      template.msg = value;
      ws.send(Template());
      template.code = 1000;
    }
  }
}
