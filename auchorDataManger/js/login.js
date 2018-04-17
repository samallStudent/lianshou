var dl = {
  init: function() {
    // body...
    console.log('init');
    $("#login-acc").focus();
  },
  loginFn: function(acc, pwd) {
    if(acc==undefined|| acc=='' || acc==null || pwd==undefined|| pwd=='' || pwd==null) {
      alert("请输入账号或者密码");
    } else {
      $.ajax({
        type: "post",
        dataType: "json",
        url: "https://app.yueyevr.com/a1/admin/login",
        data: {
          username: acc,
          password: pwd
        },
        success: function (msg) {
          if(msg.error) {
            console.log(msg.error);
            alert(msg.error.message + ', 请重新输入');
            $("#login-acc").val('');
            $("#login-pwd").val('');
            $("#login-acc").focus();
          } else {
            console.log(msg);
            console.log(msg.data);
            window.localStorage.clear();
            window.localStorage.setItem("sign", msg.data);
            //将账号令牌绑定到localStorage上
            sessionStorage.setItem('sign', msg.data);
            console.log(window.localStorage.getItem("sign"));
            window.location.href = "./index.html";
          }
        },
        error: function () {
          alert("查询失败")
        }
      });
    }
  }
}


$(function() {
  console.log('login page')
  dl.init();
  $("#log-btn").on('click', function() {
    var acc = $("#login-acc").val(),
      pwd = $("#login-pwd").val();
    console.log(acc+ '空格' + pwd);
    dl.loginFn(acc, pwd)
  });

  $("#login-acc").keyup(function(event){
    if(event.keyCode ==13) {
      $("#login-pwd").focus();
    }
  });
  $("#login-pwd").keyup(function(event){
    if(event.keyCode ==13) {
      var acc = $("#login-acc").val(),
        pwd = $("#login-pwd").val();
      dl.loginFn(acc, pwd)
    }
  });
});
