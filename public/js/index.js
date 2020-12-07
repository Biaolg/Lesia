window.getDom = (id) => document.querySelector(id);
window.getAll = (id) => document.querySelectorAll(id);
window.config = {
  httpPath: "://127.0.0.1:",
  httpPort: "64201",
  wsPort: "64202",
};



window.onload = function () {
  benhavior();
  bgCanvs();
  wsLink();
};


