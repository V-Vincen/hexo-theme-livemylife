$(window).scroll(function() {
  $(window).scrollTop() > $(window).height() * 0.5 ? $("#rocket").addClass("show") : $("#rocket").removeClass("show");
});

$("#rocket").click(function() {
  $("#rocket").addClass("launch");
  $("html, body").animate({
    scrollTop: 0
  }, 1000, function() {
    $("#rocket").removeClass("show launch");
  });
  return false;
});

let containerW = $('.post-container').css("width");
$("#menu-switch").click(function() {
  if ($("#sidebar").hasClass("sidebar-hide")) {
    setTimeout(function() {
      $("#sidebar").removeClass("sidebar-hide");
    }, 200);
    // $('.post-container').css("width", containerW);
    $('.post-container').attr('class', 'col-lg-8 col-lg-offset-1 col-md-10 col-md-offset-1 post-container')
  } else {
    $("#sidebar").addClass("sidebar-hide");
    setTimeout(function() {
      // $('.post-container').css("width", "100%");
      $('.post-container').attr('class', 'col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 post-container')
    }, 200);
  }
});