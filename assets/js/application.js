// 顶部搜索框自动加长
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
  var scrollTop = $('<a href="javascript:;" class="scroll-top" style="display: none;position: fixed;bottom: 10px;right: 10px;z-index: 999;"><img src="/assets/img/top.png"></a>');
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

$(function(){
  // 公众号弹框
  $("body").on("click", ".unlock", function(){
    $('#myModal').modal('show')
  });
  // AI 破局弹框
  $("body").on("click", ".ai-club", function(){
    $('#aiModal').modal('show')
  });
  // 玩赚新媒弹框
  $("body").on("click", ".new-media", function(){
    $('#mediaModal').modal('show')
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