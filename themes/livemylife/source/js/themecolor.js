//highlight_normal
function loadHighlightNormalLink() {
  let link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = '/css/highlight_normal.css';
  let head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}

function deleteHighlightNormalLink() {
  let link = document.querySelector('link[href="/css/highlight_normal.css"]').remove();
}

//header.intro-header 属性 background-image 变暗
function darkBackgroundImage() {
  let elt = document.querySelector(".intro-header");
  let url = window.getComputedStyle(elt).getPropertyValue("background-image");
  elt.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)),' + url;
}

function deleteDarkBackgroundImage() {
  document.querySelector(".intro-header").style.backgroundImage = "";
}

//dark rocket
function darkRocket() {
  let elt = document.getElementById("rocket");
  let url = window.getComputedStyle(elt).getPropertyValue("background");
  elt.style.background = url.replace("beside_up.png", "beside_up_white.png");
}

function lightRocket() {
  let elt = document.getElementById("rocket");
  let url = window.getComputedStyle(elt).getPropertyValue("background");
  elt.style.background = url.replace("beside_up_white.png", "beside_up.png");
}

//dork wave
function darkWave() {
  let eltBefore = document.querySelector(".wave_before");
  if (eltBefore) {
    let urlBefore = eltBefore.style.backgroundImage;
    eltBefore.style.backgroundImage = urlBefore.replace("wave-light.png", "wave-dark.png");

    let eltAfter = document.querySelector(".wave_after");
    let urlAfter = eltAfter.style.backgroundImage;
    eltAfter.style.backgroundImage = urlAfter.replace("wave-light.png", "wave-dark.png");
  }
}

function lightWave() {
  let eltBefore = document.querySelector(".wave_before");
  if (eltBefore) {
    let urlBefore = eltBefore.style.backgroundImage;
    eltBefore.style.backgroundImage = urlBefore.replace("wave-dark.png", "wave-light.png");

    let eltAfter = document.querySelector(".wave_after");
    let urlAfter = eltAfter.style.backgroundImage;
    eltAfter.style.backgroundImage = urlAfter.replace("wave-dark.png", "wave-light.png");
  }
}


//getCookieValue
function getCookieValue(a) {
  var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}
if (getCookieValue('sb-color-mode') === 'dark') {
  document.body.classList.add('body--dark');
  loadHighlightNormalLink();
  darkBackgroundImage();
  darkRocket();
  darkWave();
}

//setCookieValue
var toggleBtn = document.querySelector(".toggle");
toggleBtn.addEventListener("click", function() {
  var e = document.body.classList.contains("body--dark");
  var cookieString = e ? "dark" : "light";
  var exp = new Date();
  exp.setTime(exp.getTime() + 3 * 24 * 60 * 60 * 1000); //3天过期
  document.cookie = "sb-color-mode" + "=" + cookieString + ";expires=" + exp.toGMTString() + ";path=/";

  if (e) {
    loadHighlightNormalLink();
    darkBackgroundImage();
    darkRocket();
    darkWave();
  } else {
    deleteHighlightNormalLink();
    deleteDarkBackgroundImage();
    lightRocket();
    lightWave();
  }
});