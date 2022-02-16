jQuery(function ($) {

  $(".sidebar-dropdown > a").click(function () {
    if ($(this).parent().hasClass("active")) {
      $(".sidebar-dropdown").removeClass("active");
      $(this).parent().removeClass("active");
      $(this).next(".sidebar-submenu").slideUp()
    } else {
      $(".sidebar-dropdown").removeClass("active");
      $(this).next(".sidebar-submenu").slideDown();
      $(this).parent().addClass("active");
    }
  });

  let pageWrapper = $(".page-wrapper")

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    if (!pageWrapper.hasClass("toggled")) {
      pageWrapper.toggleClass("toggled");
    } else if (!pageWrapper.hasClass("active")) {
      pageWrapper.toggleClass("active");
    } else {
      pageWrapper.removeClass("active");
      pageWrapper.removeClass("toggled");
    }
  });
  $("#menu-toggle").hover(function () {
    pageWrapper.addClass("toggled");
  })
  $("#sidebar").mouseleave(function () {
    if (!pageWrapper.hasClass("active")) {
      pageWrapper.toggleClass("toggled");
    }
  })
  $("body").on("mouseover", ".page-content", function (b) {
    if (!pageWrapper.hasClass("active")) {
      pageWrapper.removeClass("toggled");
    }
  });
});