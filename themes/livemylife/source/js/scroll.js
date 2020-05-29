// 顶部滚动进度条
$(window).scroll(function() {
  var pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 页面总高度
  var windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 浏览器视口高度
  var scrollAvail = pageHeight - windowHeight // 可滚动的高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动条的高度
  var ratio = (scrollTop / scrollAvail) * 100 + '%'
  $('#progress > .line').css('width', ratio)
})