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
  var scrollTop = $('<a href="javascript:;" class="scroll-top" style="display: none;position: fixed;bottom: 10px;right: 10px;z-index: 999;"><img src="http://qcdn.xinlijinrong.com/top.png"></a>');
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
  // 查看个人简历时的口令输入
  var lock = true;
  $("body").on("click", ".unlock", function(){
    if (lock) {
      var pwd = prompt("请输入口令","");
      if (pwd) {
        alert("您输入的口令错误。");
      }
    }
  });
});
(function(){ 
var SOHUCS = $('#SOHUCS').get(0);
if (!SOHUCS) {
  return;
}
var appid = 'cytea86wO';
var conf = 'prod_44a893a22d93436e9c1bb8138f5ee308';
var width = window.innerWidth || document.documentElement.clientWidth;
if (width < 960) {
  window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="http://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf + '"><\/script>');
} else {
  var loadJs = function(d, a) {
    var c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
    var b = document.createElement("script");
    b.setAttribute("type", "text/javascript");
    b.setAttribute("charset", "UTF-8");
    b.setAttribute("src", d);
    if (typeof a === "function") {
      if (window.attachEvent) {
        b.onreadystatechange = function() {
          var e = b.readyState;
          if (e === "loaded" || e === "complete") {
            b.onreadystatechange = null;
            a()
          }
        }
      } else {
        b.onload = a
      }
    }
    c.appendChild(b)
  };
  loadJs("http://changyan.sohu.com/upload/changyan.js",
  function() {
    window.changyan.api.config({
      appid: appid,
      conf: conf
    })
  });
}
})();
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