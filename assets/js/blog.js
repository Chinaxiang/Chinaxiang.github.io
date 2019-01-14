$(function(){
  w = function() {
      var e, t, n, r, i, o, a;
      e = $(".article"),
      t = e.find("h2, h3, h4"),
      $(".side").find(".post-nav").addClass("side-outline").data("width", $(".side-outline").width()).data("top", $(".side-outline").offset().top),
      r = $(".side-outline"),
      n = r.find(".highlight-title"),
      o = r.offset().top,
      $(".nav-body").css("top", 0),
      $(window).scroll(function() {
          var e, i, o, a;
          i = $(this).scrollTop(),
          a = void 0,
          e = void 0,
          o = void 0,
          i > r.data("top") + 20 ? i + r.height() + parseFloat($(".nav-body").css("top").replace(/px/, "")) < $("footer").offset().top ? r.removeClass("absolute").addClass("fixed").width(r.data("width")).css("top", 0) : r.removeClass("fixed").addClass("absolute").css("top", r.parents(".row").height() - r.height()) : r.removeClass("fixed").css("width", "100%"),
          t.eq(0).offset().top < i ? (n.show(), t.each(function(s, l) {
              return e = r.find("[href=#" + $(this).attr("id") + "]"),
              o = t.last().offset().top - i,
              t.eq(Math.min(Math.max(0, s + 1), t.length - 1)).offset().top > i + 20 || 20 > o ? (20 > o && (e = r.find("a").last()), e.offset() && (a = e.offset().top - e.parents(".nav-body").offset().top), e.parents(".articleIndex").find("li").removeClass("active"), e.parent().addClass("active"), n.css("top", a).height(e.outerHeight()), a > $(window).height() / 2 ? $(".nav-body").css("top", -(e.parent().offset().top - e.parents(".nav-body").offset().top - $(window).height() / 2)) : $(".nav-body").css("top", 0), !1) : void 0
          })) : ($(".articleIndex").find("li").removeClass("active"), n.hide());
      }),
      a = 1,
      i = $(".articleIndex"),
      t.each(function(e) {
          var t, n, r;
          r = $(this).text().trim(),
          "" !== r && ($(this).attr("id", "articleHeader" + e), n = parseInt($(this)[0].tagName.slice(1)), t = null, 0 === e || n === a ? (t = $('<li><a href="#articleHeader' + e + '"></a></li>'), t.find("a").text(r), i.append(t)) : n > a ? (t = $("<li style='list-style:none;'><ul><li><a href=\"#articleHeader" + e + '"></a></li></ul></li>'), t.find("a").text(r), i.append(t), i = t.find("ul")) : a > n && (1 === n ? (t = $('<li><a href="#articleHeader' + e + '"></a></li>'), t.find("a").text(r), $(".articleIndex").append(t), i = $(".articleIndex")) : (t = $("<li style='list-style:none;'><ul><li><a href=\"#articleHeader" + e + '"></a></li></ul></li>'), t.find("a").text(r), i.parents("ul").parents("ul").length ? (i.parents("ul").parents("ul").append(t), i = t.find("ul")) : (t = $('<li><a href="#articleHeader' + e + '"></a></li>'), t.find("a").text(r), $(".articleIndex").append(t), i = $(".articleIndex")))), a = n)
      });
    };

  $(".article").find("h2, h3, h4").length && ($(".post-nav").show(), w(), 0 === $(".articleIndex li").length && $(".widget-outline").remove());
  // 对文章进行赞操作
  var lock = false;
  $("body").on("click", "#sideLike", function(){
    var ele = $(this);
    var id = ele.data('id');
    if (!lock) {
      lock = true;
      var numEle = ele.parent().find("#sideLiked");
      var num = Number(numEle.text()) + 1;
      numEle.text(num);
    }
  });
});

$(function() {
  "use strict";
  //$("pre").find("code").parent().addClass('highlight');
  $(".article img").addClass('img-responsive');
  var b = $(window),c = $(document.body);
  /*ZeroClipboard.config({
    moviePath: "//cdn.bootcss.com/zeroclipboard/2.1.6/ZeroClipboard.swf",
    hoverClass: "btn-clipboard-hover"
  });*/
  $("pre.highlight").each(function() {
    //var b = '<div class="zero-clipboard hidden-sm hidden-xs"><span class="btn-clipboard">复制</span></div>';
    var b = '<div class="clipboard hidden-sm hidden-xs" title="复制剪贴板"><span class="btn-clipboard">复制</span></div>';
    $(b).tooltip("fixTitle");
    $(this).before(b);
  });

  var clipboard = new ClipboardJS('.clipboard', {
      text: function(trigger) {
        return $(trigger).parent().find('.highlight').text();
      }
    });

  clipboard.on('success', function(e) {
    /*console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);*/
    $(e.trigger).attr("title", "复制成功！").tooltip("fixTitle").tooltip("show").attr("title", "复制剪贴板").tooltip("fixTitle");
    e.clearSelection();
  });

  clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
 
  /*var d = new ZeroClipboard($(".btn-clipboard"));
  var e = $("#global-zeroclipboard-html-bridge");
  d.on("ready",function() {
    e.data("placement", "top").attr("title", "复制到剪贴板").tooltip(),
    d.on('copy',function(event) {
      var c=$(event.target).parent().nextAll(".highlight").first();
        event.clipboardData.setData('text/plain', c.text());
    });
    d.on("aftercopy",function() {
        e.attr("title", "复制成功！").tooltip("fixTitle").tooltip("show").attr("title", "复制到剪贴板").tooltip("fixTitle")
    });
  });
  d.on("noflash wrongflash",function() {
    $(".zero-clipboard").remove();
    ZeroClipboard.destroy();
  });*/
  $(window).load(function(){
    // $(".highlight").mCustomScrollbar({
    //   theme: "dark"
    // });
  });

  hljs.initHighlightingOnLoad();
});
