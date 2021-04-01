(function() {
  let a_idx = 0;
  let scripts = document.getElementsByTagName("script");
  let script = Array.from(scripts).filter(script =>
    script.getAttribute("src") &&
    script.getAttribute("src").indexOf("mouseclick.js") > -1 &&
    script.getAttribute("content"))[0];
  let a = script.getAttribute("content").split(",");
  let f_colors = script.getAttribute("color").split(",");

  jQuery(document).ready(function($) {
    $("body").click(function(e) {
      let $i = $("<span/>").text(a[a_idx]);

      a_idx = (a_idx + 1) % a.length;
      let x = e.pageX,
        y = e.pageY;
      $i.css({
        "z-index": 100000000,
        "top": y - 20,
        "left": x,
        "position": "absolute",
        "font-weight": "bold",
        "color": f_colors[a_idx]
      });

      $("body").append($i);

      $i.animate({
        "top": y - 180,
        "opacity": 0
      }, 2000, function() {
        $i.remove();
      });
    });
  });
})()