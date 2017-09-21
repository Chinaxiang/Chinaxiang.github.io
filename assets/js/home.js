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