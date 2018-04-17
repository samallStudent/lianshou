var mainFn = {
  init: function() {
    // body...
    console.log('init index');
    console.log(document.cookie);
    console.log(window.sessionStorage.getItem("sign"));
    // var wlsign = window.localStorage.getItem("sign");
    var wlsign = window.sessionStorage.getItem("sign")
    //判断是否登录，如果未登录那么跳转到登录界面
    if(wlsign==null || wlsign==undefined || wlsign=="") {
      window.location.href = "./login.html";
      return;
    } else {
      this.getData(window.localStorage.getItem("sign"), 1, '', '', '1', '1', '10', '');
      this.initAuchor(window.localStorage.getItem("sign"));
    }
  },
  initCalPosi: function(addpl) {
    var pobj = document.getElementById("tab-content").getBoundingClientRect();
    //console.log(pobj);
    var pt = (pobj.top + 30) + "px";
    var pl = (pobj.left + addpl) + "px";
    console.log(pt+pl);
    //设置日历的位置的top和left
    $("#laydate_box").css({"position": "absolute","top": pt, "left": pl,"z-index": "99","width":"240px"});
  },
  beginDate: function() {
    var self = this;
    var maxDate = $("#txtEndDate").val();
    if(!(maxDate == null || maxDate == undefined || maxDate == '')) {
      console.log(maxDate);
    } else {
      maxDate = self.getCurTime();
    }
    laydate({   //日期插件
      elem: '#txtBeginDate',
      // min: "'" + self.getPreTime() + "'",
      max: "'" + maxDate + "'",
      choose: function(value){
        console.log(value); //得到日期生成的值，如：2017-08-18
        console.log($("#txtEndDate").val()); //得到日期生成的值，如：2017-08-18
        self.getData(window.localStorage.getItem("sign"), 1, value, $("#txtEndDate").val(), '', 1, '10', $("#auchor-txt").attr("data-aid"));
      }
    })
    self.initCalPosi(302);
  },
  endDate: function() {
    var self = this;
    var minDate = $("#txtBeginDate").val();
    if(!(minDate == null || minDate == undefined || minDate == '')) {
      console.log(minDate);
    } else {
      minDate = self.getPreTime();
    }
    laydate({
      elem: '#txtEndDate',
      min: "'" + minDate + "'",
      max: "'" + self.getCurTime() + "'",
      choose: function(value){
        console.log(value); //得到日期生成的值，如：2017-08-18
        console.log($("#txtBeginDate").val()); //得到日期生成的值，如：2017-08-18
        self.getData(window.localStorage.getItem("sign"), 1, $("#txtBeginDate").val(), value, '', 1, '10', $("#auchor-txt").attr("data-aid"));
      }
    })
    self.initCalPosi(484);
  },
  getCurTime: function() {
    var self = this;
    var currentYear=new Date().getFullYear();
    var currentMonth=new Date().getMonth()+1;
    var currentDate=new Date().getDate();
    var current =currentYear+"-"+self.p(currentMonth)+"-"+self.p(currentDate);
    // console.log(current)
    return current;
  },
  p: function(s) {    //补零函数
    return s < 10 ? '0' + s: s;
  },
  getPreTime: function() {
    var self = this;
    var currentYear=new Date().getFullYear();
    var currentMonth=new Date().getMonth()+1;
    var lastMonth=new Date().getMonth();
    var currentDate=new Date().getDate();
    var prevCurrentYear=0;
    var prevCurrentMonth=0;
    if(currentMonth==0){
        prevCurrentYear=currentYear-1;
        prevCurrentMonth=12;
    }else{
        prevCurrentYear=currentYear;
        prevCurrentMonth=currentMonth-1;
    }
    var lastmonth=prevCurrentYear+"-"+self.p(prevCurrentMonth)+"-"+self.p(currentDate)
    // console.log(lastmonth);
    return lastmonth;
  },
  initAuchor: function(sign) {
    var self = this;
    //所有主播数据请求
    $.ajax({
      type: "post",
      dataType: "json",
      url: "https://app.yueyevr.com/a1/admin/get_anchor",
      data: {
        sign: sign
      },
      success: function (msg) {
        var str = "";
        var data = msg.data;
        console.log(msg);
        if (msg.data) {
          $("#select-auchor").empty();
          $("#select-auchor").append("<li data-uid=>所有主播</li>");
          for (i in data) {
            // 主播的内置ID和主播名存在标签中
            $("#select-auchor").append("<li data-uid='" + data[i].id + "'>" + data[i].nick_name + "</li>");
          }
        }
      },
      error: function () {
        alert("查询失败")
      }
    });
  },
  getData: function(sign, type, bt, et, month, page, size, uid) {
    var self = this;
    console.group("Task Group");
    console.log('sign='+sign);
    console.log('type='+type);
    console.log('bt='+bt);
    console.log('et='+et);
    console.log('month='+month);
    console.log('page='+page);
    console.log('size='+size);
    console.log('uid='+uid);
    console.groupEnd();
    var pages = null;
    //主播月票数据请求
    $.ajax({
      type: "post",
      dataType: "json",
      url: "https://app.yueyevr.com/a1/admin/get_data",
      data: {
        sign: sign,     //登录账户
        type: type,     // 类型
        begin_time: bt, // 开始时间
        end_time: et,   //  结束时间
        month: month,   // 月份
        page: page,     // 页数
        size: size,     //  一页多少数据
        user_id: uid    // 主播ID
      },
      success: function (msg) {
        if(msg.data.total) {
          pages = Math.ceil(msg.data.total/10);   //页数设置
        } else {
          pages = 1;
        }

        var str = "";
        var data = msg.data.rows;
        if (msg.data) {

          if(type == 1) {
            for (i in data) {
              str += "<tr><td>" + data[i].nick_name + "</td><td>" + data[i].uid + "</td><td>" + data[i].length + "</td><td>" + data[i].start_time + "</td><td>" + data[i].end_time + "</td><td>" + data[i].sum_price + "</td></tr>";
            }
            $("#tbody-result-one").empty();
            $("#tbody-result-one").append(str);
            ExcellentExport.excel($("#excelRxportBtn"), 'tbody-result-second', 'ct');   //导出表格插件
          } else {
            console.log('打印结算');
            console.log(data);
            for (i in data) {
              var isOver = false;
              console.log('结算状态为：'+data[i].status);
              if(data[i].status != "未结算") {
                isOver = true;
              }
              console.log(isOver);
              var overClass = isOver ? "overpay":"";
              str += "<tr><td>" + data[i].nick_name + "</td><td>" + data[i].uid + "</td><td>" + data[i].length + "</td><td>" + data[i].sum_price + "</td><td class='" + overClass + "'>" + data[i].status + "</td></tr>";
            }
            $("#tbody-result-second").empty();
            $("#tbody-result-second").append(str);
          }
        }
        // console.log(msg.data.total)
        var t = $(".tab-selected").eq(0).data('type');
        console.log(t);
        console.log(pages);
        self.initPage(t, pages, page);    //初始化日历
      },
      error: function () {
        alert("查询失败")
      }
    });
  },
  initPage: function(p, tp, curpage) {
    var self = this;
    var pageObj = $('#pagin-box');
    pageObj.pagination({      //日历插件
      pageCount: tp,
      jump: false,
      coping: true,
      current: curpage,
      homePage: '首页',
      endPage: '末页',
      prevContent: '上一页',
      nextContent: '下一页',
      callback: function (api) {
        console.log("跳转页面"+api.getCurrent());
        var mnum = $('.a-month-selected').eq(0).data('num');
        console.log(mnum||'');
        self.getData(window.localStorage.getItem("sign"), p, $("#txtBeginDate").val()||'', $("#txtEndDate").val()||'', mnum, api.getCurrent(), '10', $("#auchor-txt").attr("data-aid"));
      }

    });
    if($("#pagin-box a").length <= 0) {
      console.log("456789");
      $("#pagin-box").hide();
    }
  },
  getMonthRange: function() {
    var d = new Date();
    var result = [];
    $("#select-month").empty();
    for(var i = 0; i < 12; i++) {
      d.setMonth(d.getMonth() - 1);
      var m = d.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      //在这里可以自定义输出的日期格式
      result.push(d.getFullYear() + "-" + m);
      $("#select-month").append("<li>"+d.getFullYear() + "-" + m + "</li>");
      // result.push(d.getFullYear() + "年" + m + '月');
    }
    console.log(result);
    return result;
  }
}
$(function() {
  mainFn.init();
  $("#tab-content").find(".tab-item").eq(0).show();
  // tab change fn
  $("#dataTab a").on("click",function() {
    var index = $(this).index();
    var dtype = $(this).data("type");
    $(this).parent().next().find(".tab-item").hide().eq(index).show();      //选项卡切换的type
    $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
    if($(this).data('tab') == 'one') {
      mainFn.getData(window.localStorage.getItem("sign"), dtype, $("#txtBeginDate").val(), $("#txtEndDate").val(), $(".a-month-selected").eq(0).data('num')||'', '1', '10', $("#auchor-txt").attr("data-aid"));
    } else {
      mainFn.getData(window.localStorage.getItem("sign"), dtype, '', '', $("#monthDate").val()||'2', '1', '10', $("#auchor-txt").attr("data-aid"));
    }

  });
  $(".i-select-btn").on('mouseover', function(event) {
    event.preventDefault();
    var show_id = $(this).data('target');
    if(show_id == "select-month") {
      mainFn.getMonthRange();
      $("#select-month>li").on('click', function(event) {
        // mainFn.monthDate();
        console.log($(this).text());
        $("#monthDate").val($(this).text());
      });
    }
    var show_obj = $("#" + show_id);
    // console.log(show_obj);
    show_obj.show();
    show_obj.on('mouseover', function() {
      show_obj.show();
    })
    show_obj.on('mouseout', function() {
      show_obj.hide();
    })
  });
  $(".i-select-btn").on('mouseout', function(event) {
    event.preventDefault();
    var show_id = $(this).data('target');
    var show_obj = $("#" + show_id);
    show_obj.hide();
    show_obj.on('mouseover', function() {
      show_obj.show();
    })
    show_obj.on('mouseout', function() {
      show_obj.hide();
    })
  });
  $("#txtBeginDate").on('click', function(event) {
    mainFn.beginDate();
  });
  $("#txtEndDate").on('click', function(event) {
    mainFn.endDate();
  });
  $("#select-auchor").delegate('li','click', function(event) {
    // event.preventDefault();
    console.log("456");

    var uid = $(this).data("uid");
    // console.log(aid);
    $("#auchor-txt").text($(this).text()).attr("data-aid",uid);
    mainFn.getData(window.localStorage.getItem("sign"), 1, $("#txtBeginDate").val(), $("#txtEndDate").val(), '1', '1', '10', $(this).data("uid"));

  });
  $("#select-month").delegate('li','click', function(event) {
    // event.preventDefault();
    console.log("789");
    $("#monthDate").val($(this).text());
    console.log($("#monthDate").val());
    mainFn.getData(window.localStorage.getItem("sign"), 2, '', '', $("#monthDate").val(), '1', '10', '');
  });
  $("#a-month-selected").on('click', function(event) {
    // event.preventDefault();
    /* Act on the event */
    var dtype = $(".tab-selected").eq(0).data("type");
    console.log(dtype);
    var auid = '';
    auid = $("#auchor-txt").attr("data-aid");
    console.log(auid);
    $(".a-month a").removeClass('a-month-selected');
    $(this).addClass('a-month-selected');
    mainFn.getData(window.localStorage.getItem("sign"), dtype, $("#txtBeginDate").val(), $("#txtEndDate").val(), '1', '1', '10', auid);
  });

  var cYear=new Date().getFullYear();
  var cMonth=new Date().getMonth()+1;
  var lMonth=new Date().getMonth();
  $("#preMonth").on('click', function(event) {      // 记录查询上月点击事件
    event.preventDefault();
    var year2 = cYear;
    var month2 = parseInt(cMonth) - 1;
    if (month2 == 0) {//如果是1月份，则取上一年的12月份
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;//月份填补成2位。
    }
    cYear = year2;
    cMonth = month2;
    var t2 = cYear + '-' + cMonth;
    // return t2;
    console.log(t2);
    //
    var dtype = $(".tab-selected").eq(0).data("type");
    console.log(dtype);
    var aid = $("#auchor-txt").data("aid");
    console.log(aid)
    $(".a-month a").removeClass('a-month-selected');
    $(this).addClass('a-month-selected');
    mainFn.getData(window.localStorage.getItem("sign"), dtype, $("#txtBeginDate").val(), $("#txtEndDate").val(), t2, '1', '10', aid);
  });
  var dYear=new Date().getFullYear();
  var dMonth=new Date().getMonth()+1;
  $("#monthPre").on('click', function(event) {      //数据统计上月点击事件
    event.preventDefault();
    /* Act on the event */
    var year2 = dYear;
    var month2 = parseInt(dMonth) - 1;
    if (month2 == 0) {//如果是1月份，则取上一年的12月份
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;//月份填补成2位。
    }
    dYear = year2;
    dMonth = month2;
    var t2 = dYear + '-' + dMonth;
    // return t2;
    console.log(t2);
    var dtype = $(".tab-selected").eq(0).data("type");
    console.log(dtype);
    mainFn.getData(window.localStorage.getItem("sign"), dtype, '', '', t2, '1', '10', '');
  });
});
