/*$(function() {
  function o() {
    return $(window).width() - ($('[data-toggle="popover"]').offset().left + $('[data-toggle="popover"]').outerWidth())
  }
  $(window).on("resize", function() {
    var t = $('[data-toggle="popover"]').data("bs.popover");
    t && (t.options.viewport.padding = o())
  }),
  $('[data-toggle="popover"]').popover({
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content p-x-0"></div></div>',
    title: "",
    html: !0,
    trigger: "manual",
    placement: "bottom",
    viewport: {
      selector: "body",
      padding: o()
    },
    content: function() {
      var o = $(".app-navbar .navbar-nav:last-child").clone();
      return '<div class="nav nav-stacked" style="width: 200px">' + o.html() + "</div>"
    }
  }),
  $('[data-toggle="popover"]').on("click",
  function(o) {
    o.stopPropagation(),
    $('[data-toggle="popover"]').data("bs.popover").tip().hasClass("in") ? ($('[data-toggle="popover"]').popover("hide"), $(document).off("click.app.popover")) : ($('[data-toggle="popover"]').popover("show"), setTimeout(function() {
      $(document).one("click.app.popover",
      function() {
        $('[data-toggle="popover"]').popover("hide")
      })
    },
    1))
  })
}),
$(document).on("click", "[data-action=growl]", function(o) {
  o.preventDefault(),
  $("#app-growl").append('<div class="alert alert-dark alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><p>Click the x on the upper right to dismiss this little thing. Or click growl again to show more growls.</p></div>')
}),*/
$(document).on("focus", '[data-action="grow"]', function() {
  $(window).width() > 1e3 && $(this).animate({
    width: 300
  })
}),
$(document).on("blur", '[data-action="grow"]', function() {
  if ($(window).width() > 1e3) {
    $(this).animate({
      width: 180
    })
  }
}),
// 滚动到页面顶部
$(function() {
  var scrollTop = $('<a href="javascript:;" class="scroll-top" style="display: none;position: fixed;bottom: 10px;right: 10px;z-index: 999;"><img src="https://o0y5cx8y8.qnssl.com/top.png"></a>');
  $('body').append(scrollTop);
  function o() {
    $(window).scrollTop() > $(window).height() ? $(".scroll-top").fadeIn() : $(".scroll-top").fadeOut()
  }
  $(".scroll-top").length && (o(), $(window).on("scroll", o));
  $("body").on("click", ".scroll-top", function(e){
    e.preventDefault();
    $('body,html').animate({scrollTop: 0}, 500);
  });
});
/*placeholder 图片错误处理*/
function imgerror(e) {
  var w = $(e).data("width");
  var h = $(e).data("height");
  var name = $(e).data("name");
  var opts = {
    size: w + 'x' + h,
    bgcolor: '#ccc', 
    color: '#ffffff',
    text: name + ' 404 Not Found',
    fsize:'14',
    ffamily: 'consolas'
  }
  e.src = placeholder.getData(opts);
}