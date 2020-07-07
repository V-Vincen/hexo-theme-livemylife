let imgs = document.getElementsByTagName("img");
let img = Array.from(imgs);
let options = {
  navbar: 2,
  title: 2,
  toolbar: {
    zoomIn: 2,
    zoomOut: 2,
    oneToOne: 2,
    reset: 2,
    prev: 0,
    play: {
      show: 2,
      size: 'large',
    },
    next: 0,
    rotateLeft: 2,
    rotateRight: 2,
    flipHorizontal: 2,
    flipVertical: 2,
  },
  fullscreen: false
};
img.filter(item => item.getAttribute("alt"))
  .forEach(item => {
    let id = item.getAttribute("alt");
    item.setAttribute("id", id);
    const viewer = new Viewer(document.getElementById(id), options);
  });