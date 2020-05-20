let imgs = document.getElementsByTagName("img");
let img = Array.from(imgs);
let options = {
  navbar: 2,
  title: 2,
  toolbar: 2,
  fullscreen: false
};
img.filter(item => item.getAttribute("alt"))
  .forEach(item => {
    let id = item.getAttribute("alt");
    item.setAttribute("id", id);
    const viewer = new Viewer(document.getElementById(id), options);
  });