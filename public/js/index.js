window.getDom = (id) => document.querySelector(id);
window.getAll = (id) => document.querySelectorAll(id);

window.onload = function () {
  bgCanvs();
};

function bgCanvs() {
  let wide = 1920,
    high = 1080;
  let canvas = getDom("#bg");
  let ctx = canvas.getContext("2d");
  console.log(ctx);
}
