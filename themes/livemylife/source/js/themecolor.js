//getCookieValue
function getCookieValue(a) {
  var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}
if (getCookieValue('sb-color-mode') === 'dark') {
  document.body.classList.add('body--dark');
}

//setCookieValue
var toggleBtn = document.querySelector(".toggle");
toggleBtn.addEventListener("click", function() {
  var e = document.body.classList.contains("body--dark");
  var cookieString = e ? "dark" : "light";
  var exp = new Date();
  exp.setTime(exp.getTime() + 3 * 24 * 60 * 60 * 1000); //3天过期
  document.cookie = "sb-color-mode" + "=" + cookieString + ";expires=" + exp.toGMTString() + ";path=/";
});