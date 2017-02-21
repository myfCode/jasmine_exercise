//define(['jquery','imagesLoaded','iscroll.last.min'],function($,imagesLoaded,IScroll){
'use strict';
//global variable=======================================================================================================
$.GlobalEffect = 0; //动画效果开关，此值只能用1或0
$.fnNoticeShowTimeOut; //消息提示用
$.fnNoticeHideTimeOut; //消息提示用
$.fnNoticeDestoryTimeOut; //消息提示用
$.varVerifyTimeOut; //验证码倒计时用
$.eventStart; //事件类型
$.eventMove; //事件类型
$.eventEnd; //事件类型
$.htmlBody; //定义body
$.ambody; //定义am-body
$.touchMoved;
$.browser = {
    versions: function() {
        var u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') === -1,
            wechat: u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}; //检测浏览器
$.winW = window.screen.width; //定义窗口宽
$.winH = window.screen.height; //定义窗口高
$.isSupportTouch = "ontouchend" in document ? true : false;
$.preventDefault = function(e) {
    e.preventDefault();
};
//fnInput===============================================================================================================
$.fn.fnInput = function(options) {
    var opt = $.extend({}, $.fn.fnInput.defaultOpt, options);
    return this.each(function() {
        var $thisInput = $(this);
        var $btnClear = $(this).prev(".am-input-clear");
        var $btnPwd = $(this).prev(".am-input-pwd").length ? $(this).prev(".am-input-pwd") : $btnClear.prev(".am-input-pwd");
        init();

        function init() {
            fnSetBtn();

            //check has btnclear
            if ($btnClear.length) {
                $btnClear
                    .off("touchend.clear")
                    .on("touchend.clear", function() {
                        //touchmoved checking
                        if ($.touchMoved) {
                            return false;
                        }
                        $btnClear.hide();
                        $thisInput.val("");
                        opt.onClear();
                    });
                $thisInput
                    .off("input.clear")
                    .on("input.clear", function() {
                        fnSetBtn();
                        if ($thisInput.val() === "") {
                            opt.onClear();
                        }
                    })
                    .off("focus.clear blur.clear")
                    .on("focus.clear", fnSetBtn)
                    .on("blur.clear", fnSetBtn);
            }

            //check has btnpwd
            if ($btnPwd.length) {
                $btnPwd
                    .off("touchend.pwd")
                    .on("touchend.pwd", function() {
                        //touchmoved checking
                        if ($.touchMoved) {
                            return false;
                        }
                        if (!$(this).parent().hasClass("am-on")) {
                            $(this).parent().addClass("am-on");
                            $thisInput.attr({
                                "type": "text"
                            });
                        } else {
                            $(this).parent().removeClass("am-on");
                            $thisInput.attr({
                                "type": "password"
                            });
                        }
                    });
            }

        }

        function fnSetBtn() {
            setTimeout(function() {
                if ($thisInput.val()) {
                    $btnClear.show();
                } else {
                    $btnClear.hide();
                }
            });
        }
    });
};
$.fn.fnInput.defaultOpt = {
    onClear: function() {} //callback clear 
};
//fnsetfootertips=======================================================================================================
$.fn.fnSetFooterTips = function() {
    var $this = $(".my-footer-tips, .my-service-tips");
    //has checking
    if (!$this.length) {
        return false;
    }
    //bind resize
    $.fn.fnSetFooterTips.reisze();
    $(window).on("resize", $.fn.fnSetFooterTips.reisze);
};
$.fn.fnSetFooterTips.reisze = function(index) {
    //说明：am-body下id以page*开头的div，如果多个page同页切换时，需执行此方法，同时传参当前page的index值
    var $this = $(".my-footer-tips, .my-service-tips");
    //has checking
    if (!$this.length) {
        return false;
    }
    //resize function
    var bodyH = $(document).height();
    var winH = $(window).height();
    var $last;
    if (index >= 0) {
        $last = $(".am-body>div").eq(index).find(">div").last();
    } else {
        $last = $(".am-body>div").last();
    }
    var lastPos = $last.offset().top + $last.outerHeight();
    if (bodyH > winH || (lastPos + 128) > winH) {
        $this.removeClass("am-pos-fixb").appendTo(".am-body:eq(0)");
    } else {
        $this.addClass("am-pos-fixb").insertBefore(".am-body:eq(0)");
    }
};
//fnChecked=============================================================================================================
$.fn.fnChecked = function(options) {
    var opt = $.extend({}, $.fn.fnChecked.defaultOpt, options);
    return this.each(function() {
        var $this = $(this);
        var state = [];
        var type;
        var name;
        var length;
        $this.off("touchend.check").on("touchend.check", function() {
            //touchmoved checking
            if ($.touchMoved || $(this).hasClass("am-disable")) {
                return false;
            }
            //function
            if ($this.attr("data-type") === "radio") {
                type = 1;
            } else {
                type = 2;
            }
            name = $this.attr("data-name");
            length = $("label[data-name='" + name + "']").length;
            //type radio
            if (type === 1 && !$this.find(".am-icon-radio").hasClass("am-on")) {
                $("label[data-name='" + name + "']").find(".am-icon-radio").removeClass("am-on");
                $this.find(".am-icon-radio").addClass("am-on");
                //state set
                state = [$this.index("label[data-name='" + name + "']")];
                //callback
                opt.onChecked(name, state);
            }
            //type checkbox
            else if (type === 2) {
                if ($this.find(".am-icon-checkbox").hasClass("am-on")) {
                    $this.find(".am-icon-checkbox").removeClass("am-on");
                } else {
                    $this.find(".am-icon-checkbox").addClass("am-on");
                }
                //state array set
                for (var i = 0; i < length; i++) {
                    var tempType = $("label[data-name='" + name + "']").eq(i).find(".am-on").length || 0;
                    state[i] = tempType;
                }
                //callback
                opt.onChecked(name, state);
            }
        });
    });
};
$.fn.fnChecked.defaultOpt = {
    //name当前表单控件的data-name,保持相同的radio组使用相同的data-name
    //state是当前按钮状态，1为打开，0为关闭
    onChecked: function( /*name,state*/ ) {} //callback checked
};
//fnBtnSwitch===========================================================================================================
$.fn.fnBtnSwitch = function(options) {
    var opt = $.extend({}, $.fn.fnBtnSwitch.defaultOpt, options);
    return this.each(function() {
        var $this = $(this);
        var id = $(this).attr("id");
        var x, _x, y, _y;
        var touchSensitive = 160;
        var _state, state;
        init();

        function init() {
            $this.off("touchstart.switch").on("touchstart.switch", function(e) {
                $(document).on("touchmove.btnSwitch", $.preventDefault, false);
                _x = e.originalEvent.changedTouches[0].pageX;
                _y = e.originalEvent.changedTouches[0].pageY;
                _state = $this.hasClass("am-on");
                $this.addClass("am-active");
                $this.off("touchend.switch").on("touchend.switch", btnTouchEnd);
                $this.off("touchmove.switch").on("touchmove.switch", btnTouchMove);
            });
        }

        function btnTouchEnd() {
            if ($this.hasClass("am-on")) {
                $this.removeClass("am-on");
            } else {
                $this.addClass("am-on");
            }
            $this.removeClass("am-active");
            //callback
            setTimeout(function() {
                opt.onSwitch(id, $this.hasClass("am-on"));
            }, 300);
        }

        function btnTouchMoveEnd() {
            $this.removeClass("am-active");
            if (_state !== state) {
                opt.onSwitch(id, $this.hasClass("am-on"));
            }
        }


        function btnTouchMove(e) {
            x = e.originalEvent.changedTouches[0].pageX - _x;
            y = e.originalEvent.changedTouches[0].pageY - _y;
            //move to cancel
            if (Math.abs(y) > touchSensitive || Math.abs(x) > touchSensitive) {
                $this.removeClass("am-active");
                state = $this.hasClass("am-on");
                $this.off("touchmove.switch touchend.switch");
                if (_state !== state) {
                    opt.onSwitch(id, $this.hasClass("am-on"));
                }
                $(document).off("touchmove.btnSwitch", $.preventDefault, false);
            }
            //move to active
            else {
                if ($this.hasClass("am-on") && x < touchSensitive / 4 * -1) {
                    $this.removeClass("am-on");
                    state = $this.hasClass("am-on");
                    $this.off("touchend.switch").on("touchend.switch", btnTouchMoveEnd);
                } else if (!$this.hasClass("am-on") && x > touchSensitive / 4) {
                    $this.addClass("am-on");
                    state = $this.hasClass("am-on");
                    $this.off("touchend.switch").on("touchend.switch", btnTouchMoveEnd);
                }
            }
        }
    });
};
$.fn.fnBtnSwitch.defaultOpt = {
    //id当前点击控件的id
    //state是当前按钮状态，true为打开，false为关闭
    onSwitch: function( /*id,state*/ ) {} //callback switch
};
//fnSelectGroup=========================================================================================================
$.fn.fnSelectGroup = function(options) {
    var opt = $.extend({}, $.fn.fnSelectGroup.defaultOpt, options);
    var current = getCurrent() || getArray(); //定义初始值
    var saveCur = current.slice(0); //保存默认起始值
    var saveJson = []; //保存回传的数组
    var itemH = 48; //定义单位高度
    var touch;
    var touchLock = true;
    var mouseLock = true;
    var y = 0;
    var _y = 0;
    var $btn; //头部按钮
    var $obj; //所有操控栏
    var $this; //当前操控栏
    var $list; //当前操作栏对应的滚动栏
    var index; //当前滚动栏index
    var scrollTop = getArray(); //滚动栏top
    var tempTop = 0; //临时top
    var vHeight;

    //touchmove checking
    if ($.touchMoved) {
        return false;
    }

    //repeat checking
    if (!$("#" + opt.id).length) {
        var innerHtml = "<div class='am-select-group";
        if (opt.mask) {
            innerHtml += " am-mask";
        }
        innerHtml += "' id='" + opt.id + "'><div class='outer'><div class='groupHeader'><a class='am-float-left am-cancel am-btn-active'>取消</a><a class='am-float-right am-submit am-btn-active'>完成</a></div><div class='groupBody'><div class='inner'>";
        for (var i1 = 0; i1 < opt.data.length; i1++) {
            innerHtml += "<ul class='am-g" + opt.data[i1].width + "'>";
            for (var i2 = 0; i2 < opt.data[i1].list.length; i2++) {
                innerHtml += "<li data-sid='" + opt.data[i1].list[i2].sid + "'";
                //if has pid
                if (opt.data[i1].list[i2].pid !== undefined) {
                    innerHtml += " data-pid='" + opt.data[i1].list[i2].pid + "'";
                }
                innerHtml += ">" + opt.data[i1].list[i2].name + "</li>";
            }
            innerHtml += "</ul>";
        }
        innerHtml += "</div></div><div class='current'>";
        for (var i3 = 0; i3 < opt.data.length; i3++) {
            innerHtml += "<div class='am-g" + opt.data[i3].width + "'></div>";
        }
        innerHtml += "</div></div></div>";
        $.htmlBody.append(innerHtml);

        //set scroll & btn
        $btn = $("#" + opt.id).find(".groupHeader>a");
        $obj = $("#" + opt.id).find(".current>div");
        $list = $("#" + opt.id).find(".groupBody ul");

        //bind event
        $btn.on("touchend", fnGroupHide);
        $obj.on("touchstart", selectTouchStart)
            .on("touchmove", selectTouchMove)
            .on("touchend", selectTouchEnd);

        //set linkage
        if (opt.linkage) {
            index = 0;
            setZoom(0, 0);
            setLinkage(0, 0);
        }

        //set current
        if (opt.current) {
            setCurrent(0, 0);
        }

        //set noLinkage & noCurrent
        if (!opt.linkage && !opt.current) {
            for (var i = 0; i < opt.data.length; i++) {
                setZoom(i, 0);
            }
        }
    }
    fnGroupShow();

    //group show
    function fnGroupShow() {
        $(".am-select-group").hide();
        $("#" + opt.id).addClass("am-on").stop(true, true).fadeIn(200);
        $.ambody.find(".am-input").blur();
        //set body pointer
        if (opt.mask) {
            $.fn.fnBodyPointer();
        }
        //set effect blur
        if (opt.mask) {
            $.fn.fnBodyEffect($("#" + opt.id));
        }
    }

    //group hide
    function fnGroupHide() {
        //touchmoved checking
        if ($.touchMoved) {
            return false;
        }

        //confrim callback
        if ($(this).hasClass("am-submit")) {
            //return new select array
            saveJson = [];
            for (var i = 0; i < current.length; i++) {
                if (opt.data[i].list[current[i]]) {
                    saveJson[i] = opt.data[i].list[current[i]];
                }
            }
            opt.onComfirm(saveJson);
        } else
        //cancel callback
        if ($(this).hasClass("am-cancel")) {
            opt.onCancel();
        }
        //close------------------
        $("#" + opt.id).removeClass("am-on").stop(true, true).fadeOut(200);
        //body pointer reset
        setTimeout(function() {
            $.fn.fnBodyPointer();
        }, 400);
        //effect blur reset
        $.fn.fnBodyEffect();
        //防止点击穿透弹层背部有link
        return false;
    }

    //touch event
    function selectTouchStart(e) {
        if ($.isSupportTouch) {
            touch = e.originalEvent.targetTouches[0];
            $("body").on("touchmove.preventDefault", $.preventDefault, false);
        } else {
            touch = e;
            mouseLock = false;
        }
        touchLock = true; //点击时加锁
        _y = Number(touch.pageY);
        $this = $(this);
        vHeight = $this.height();
        index = $this.index();
        $list.eq(index).css({
            "-webkit-transition-duration": 0 + "s"
        });
    }

    function selectTouchMove(e) {
        if ($.isSupportTouch) {
            touch = e.originalEvent.targetTouches[0];
        } else {
            document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
            touch = e;
            if (mouseLock) {
                return false;
            }
        }
        touchLock = false; //位移后开锁
        y = Number(touch.pageY) - _y;
        tempTop = scrollTop[index] + y;
        if (tempTop > 0) {
            tempTop = 0;
        } else if (tempTop < vHeight - $list.eq(index).outerHeight()) {
            tempTop = vHeight - $list.eq(index).outerHeight();
        }
        //set current
        current[index] = $list.eq(index).find("li:visible").eq(Math.ceil((tempTop - (itemH / 2)) / itemH) * -1).index();
        setZoom(index, current[index]);
        //list move
        $list.eq(index).css({
            "-webkit-transform": "translate3d(0," + tempTop + "px,0)"
        });
    }

    function selectTouchEnd() {
        mouseLock = true; //设置鼠标锁
        if (touchLock) {
            return false;
        } //禁止无位移点击
        $("body").off("touchmove.preventDefault");
        scrollTop[index] = Math.ceil((tempTop - (itemH / 2)) / itemH) * itemH * 1;
        $list.eq(index).css({
            "-webkit-transition-duration": 0.2 + "s"
        }).css({
            "-webkit-transform": "translate3d(0," + scrollTop[index] + "px,0)"
        });
        //设置联动
        if (opt.linkage) {
            setLinkage(index, current[index]);
        }
        if (!opt.mask) {
            //return new select array
            saveJson = [];
            for (var i = 0; i < current.length; i++) {
                if (opt.data[i].list[current[i]]) {
                    saveJson[i] = opt.data[i].list[current[i]];
                }
            }
            opt.onComfirm(saveJson);
        }
    }

    //set linkage
    function setLinkage(idx, cur) {
        if (idx < opt.data.length - 1) {
            index++;
            scrollTop[index] = 0;
            var tempCurrentSid = $list.eq(index - 1).find("li").eq(cur).attr("data-sid");
            $list.eq(index).css({
                "-webkit-transform": "translate3d(0,0,0)"
            });
            $list.eq(index).find("li").hide().filter("[data-pid='" + tempCurrentSid + "']").show();
            current[index] = $list.eq(index).find("li[data-pid='" + tempCurrentSid + "']").eq(0).index();
            setZoom(index, current[index]);
            setLinkage(index, current[index]);

        }
    }

    //set current
    function setCurrent() {
        for (i = 0; i < current.length; i++) {
            index = i;
            var tempCur = saveCur[index];
            if (index !== 0 && opt.linkage) {
                var tempCurrentPid = $list.eq(index).find("li").eq(saveCur[index]).attr("data-pid");
                $list.eq(index).find("li").hide().filter("[data-pid='" + tempCurrentPid + "']").show();
                tempCur = $list.eq(index).find("li[data-pid='" + tempCurrentPid + "']").index($list.eq(index).find("li").eq(saveCur[index]));
                current[index] = saveCur[index];
            }
            scrollTop[index] = tempCur * itemH * -1;
            $list.eq(index).css({
                "-webkit-transform": "translate3d(0," + scrollTop[index] + "px,0)"
            });
            setZoom(index, saveCur[index]);
        }
    }

    //set perspective animate
    function setZoom(idx, cur) {
        //haven't sub level
        if (cur < 0) {
            return false;
        }
        var $li = $list.eq(idx).find("li");
        //set zoom class
        $li.removeAttr("class");
        $li.eq(cur).addClass("c4");
        $li.eq(cur + 1).addClass("c5");
        $li.eq(cur + 2).addClass("c6");
        $li.eq(cur + 3).addClass("c7");
        $li.eq(cur - 1).addClass("c3");
        $li.eq(cur - 2).addClass("c2");
        $li.eq(cur - 3).addClass("c1");
    }

    //get current
    function getCurrent() {
        if (opt.current) {
            var tempCur = new Array(opt.data.length);
            for (var i1 = 0; i1 < opt.data.length; i1++) {
                for (var i2 = 0; i2 < opt.data[i1].list.length; i2++) {
                    if (opt.current[i1] === opt.data[i1].list[i2].sid) {
                        tempCur[i1] = i2;
                        break;
                    }
                }
            }
            return tempCur;
        } else {
            return false;
        }
    }

    //get array
    function getArray() {
        var tempCur = new Array(opt.data.length);
        for (i = 0; i < opt.data.length; i++) {
            tempCur[i] = 0;
        }
        return tempCur;
    }
};
$.fn.fnSelectGroup.defaultOpt = {
    id: "select-group-" + Math.floor(Math.random() * 10000000000 + 1),
    mask: true, //弹出后显示遮罩
    data: [{ //数据格式
        "width": "", //宽度百分比
        "loop": false, //是否循环滚动（暂不可用）
        "data": [] //数据,{"sid":0,"name":"0"},{"sid":0,"name":"0"}
    }],
    linkage: false, //是否联动
    current: false, //初始值
    onComfirm: function() {}, //callback comfirm
    onCancel: function() {} //callback cancel
};
//fnBtnVerifyCode=======================================================================================================
$.fn.fnBtnVerifyCode = function(options) {
    var opt = $.extend({}, $.fn.fnBtnVerifyCode.defaultOpt, options);
    var $this = opt.target;
    var time = 60;
    init();

    function init() {
        clearTimeout($.varVerifyTimeOut);
        if (!$this.hasClass("am-disable") && time === 60) {
            $this.addClass("am-disable");
            countdown();
        }
    }

    function countdown() {
        $this.text(time);
        if (time > 0) {
            time -= 1;
            $.varVerifyTimeOut = setTimeout(countdown, 1000);
        } else {
            time = 60;
            $this.text("");
            $this.removeClass("am-disable");
            clearTimeout($.varVerifyTimeOut);
        }
    }
};
$.fn.fnBtnVerifyCode.clear = function(options) {
    var opt = $.extend({}, $.fn.fnBtnVerifyCode.defaultOpt, options);
    var $this = opt.target;
    clearTimeout($.varVerifyTimeOut);
    $this.text("");
    $this.removeClass("am-disable");
};
$.fn.fnBtnVerifyCode.defaultOpt = {
    target: "" //目标
};
//fnNotice==============================================================================================================
$.fn.fnNotice = function(options) {
    var opt = $.extend({}, $.fn.fnNotice.defaultOpt, options);
    //touchmoved checking
    if ($.touchMoved) {
        return false;
    }
    //repeat checking
    if (!$("#am-notice").length && opt.msg.length !== 0) {
        noticeShow();
    } else {
        //if has then delete
        destroy();
        //if have msg ths replay
        if (opt.msg.length !== 0) {
            setTimeout(noticeShow, 200);
        }
    }

    function noticeShow() {
        var innerHtml;
        //has link checking
        if (opt.href) {
            //has
            innerHtml = "<div class='am-notice " + opt.color + "' id='am-notice'><a href='" + opt.href + "'>" + opt.msg + "</a></div>";
        } else {
            //haven't
            innerHtml = "<div class='am-notice " + opt.color + "' id='am-notice'>" + opt.msg + "</div>";
        }
        $.htmlBody.append(innerHtml);
        //notice show
        $.fnNoticeShowTimeOut = setTimeout(function() {
            $("#am-notice").addClass("am-on");
            if ($("#am-notice").height() > 50) {
                $("#am-notice").addClass("am-align-left");
            }
        }, 20);
        //setTimeout notice hide
        $.fnNoticeHideTimeOut = setTimeout(function() {
            $("#am-notice").removeClass("am-on");
        }, opt.time);
        //setTimeout notice destroy
        $.fnNoticeDestoryTimeOut = setTimeout(function() {
            $("#am-notice").remove();
        }, opt.time + 200);
    }

    function destroy() {
        clearTimeout($.fnNoticeShowTimeOut);
        clearTimeout($.fnNoticeHideTimeOut);
        clearTimeout($.fnNoticeDestoryTimeOut);
        $.fnNoticeHideTimeOut = setTimeout(function() {
            $("#am-notice").removeClass("am-on");
        }, 0);
        $.fnNoticeDestoryTimeOut = setTimeout(function() {
            $("#am-notice").remove();
        }, 200);
    }
};
$.fn.fnNotice.defaultOpt = {
    msg: "", //提示消息
    color: "am-color-black", //提示颜色（已废除，默认统一样式）
    href: "", //点击链接
    time: 4000, //显示停留时间
    destroy: false //销毁已弹出notice
};
//fnSlideDown===========================================================================================================
$.fn.fnSlideDown = function(options) {
    var opt = $.extend({}, $.fn.fnSlideDown.defaultOpt, options);
    return this.each(function() {
        var $this = $(this);
        //default show checking
        if ($this.parent(".am-on").length) {
            $this.next(".am-slidedown-con").css({
                display: "block"
            });
        }
        $this.off("touchend.slide").on("touchend.slide", function() {
            btnClick($this);
        });
    });

    function btnClick($this) {
        //touchmoved checking
        if ($.touchMoved) {
            return false;
        }
        //has slidedown checking
        if ($this.next(".am-slidedown-con").length) {
            var $thisparent = $this.parent(".am-row");
            var index = $thisparent.index();
            var id = $thisparent.parent(".am-slidedown").attr("id");
            var state;
            if (!$thisparent.hasClass("am-on")) {
                if (opt.only) {
                    $thisparent.siblings().removeClass("am-on").find(".am-slidedown-con").stop(true, true).slideUp(200);
                }
                $thisparent.addClass("am-on");
                $this.next(".am-slidedown-con").stop(true, true).slideDown(200);
                state = 1;
            } else {
                $thisparent.removeClass("am-on");
                $this.next(".am-slidedown-con").stop(true, true).slideUp(200);
                state = 0;
            }
            //callback
            setTimeout(function() {
                opt.onSlidedown(id, index, state);
            }, 200);
        }
    }
};
$.fn.fnSlideDown.defaultOpt = {
    only: true, //每组只允许展开一行
    //id当前点击位置所在组的id
    //index当前点击位置所在本列表的index
    //state当前点击位置的状态，1为打开，0为关闭
    onSlidedown: function( /*id,index,state*/ ) {}
};
//fnDropDown============================================================================================================
$.fn.fnDropDown = function(options) {
    var opt = $.extend({}, $.fn.fnDropDown.defaultOpt, options);
    return this.each(function() {
        var $this = $(this);
        var $close;
        //default show checking
        if ($this.parent(".am-on").length) {
            $this.next(".am-dropdown-con").css({
                display: "block"
            });
        }
        //btn click
        $this.off("touchend.drop").on("touchend.drop", function() {
            btnClick($this);
        });
        //set close btn
        if ($this.nextAll(".am-close").length) {
            $close = $this.nextAll(".am-close");
            //icon arrow click
            $close.off("touchend.drop").on("touchend.drop", function() {
                closeClick($close);
            });
        }
    });

    function btnClick($this) {
        //touchmoved checking
        if ($.touchMoved) {
            return false;
        }
        //has dropdown checking
        if ($this.next(".am-dropdown-con").length) {
            //function
            var $thisparent = $this.parent(".am-row");
            var index = $thisparent.index();
            var id = $thisparent.parent(".am-dropdown").attr("id");
            var state;
            if (!$thisparent.hasClass("am-on")) {
                //opt.only checking
                if (opt.only) {
                    $thisparent.siblings().removeClass("am-on").find(".am-dropdown-con").stop(true, true).slideUp(200);
                }
                $thisparent.addClass("am-on");
                $this.next(".am-dropdown-con").stop(true, true).slideDown(200);
                state = 1;
            } else {
                $thisparent.removeClass("am-on");
                $this.next(".am-dropdown-con").stop(true, true).slideUp(200);
                state = 0;
            }
            //callback
            setTimeout(function() {
                opt.onDropdown(id, index, state);
            }, 200);
        }
    }

    function closeClick($close) {
        //touchmoved checking
        if ($.touchMoved) {
            return false;
        }
        //function
        var $thisparent = $close.parent(".am-row");
        var index = $thisparent.index();
        var parent = $thisparent.parent(".am-dropdown").attr("id");
        var state;
        if (!$thisparent.hasClass("am-on")) {
            //opt.only checking
            if (opt.only) {
                $thisparent.siblings().removeClass("am-on").find(".am-dropdown-con").stop(true, true).slideUp(200);
            }
            $thisparent.addClass("am-on");
            $close.prev(".am-dropdown-con").stop(true, true).slideDown(200);
            state = 1;
        } else {
            $thisparent.removeClass("am-on");
            $close.prev(".am-dropdown-con").stop(true, true).slideUp(200);
            state = 0;
        }
        //callback
        setTimeout(function() {
            opt.onDropdown(parent, index, state);
        }, 200);
    }
};
$.fn.fnDropDown.defaultOpt = {
    only: true, //每组只允许展开一行
    //id当前点击位置所在组的id
    //index当前点击位置所在本列表的index
    //state当前点击位置的状态，1为打开，0为关闭
    onDropdown: function( /*id,index,state*/ ) {}
};
//fnPopup===============================================================================================================
$.fn.fnPopup = function(options) {
    var defaults = {
        msg: "", //显示消息
        type: "alert", //默认弹窗类型
        icon: "", //弹窗图标
        btnComfirmName: "确认", //确认按钮文字
        btnCancelName: "取消", //取消按钮文字
        btnSelectList: [{ //定义按钮组
            "id": "", //id
            "btnName": "", //按钮名
            "btnColor": "" //颜色样式
        }],
        promptInner: "",
        promptHeight: "",
        customHtml: "",
        onComfirm: function() {},
        onCancel: function() {},
        onClose: function() {},
        onCustomLoad: function() {},
        Select: function() {},
        onPasscode: function() {},
        onPromptLoad: function( /*popid*/ ) {},
        onForgetPwd: function() {}
    };
    var opt = $.extend({}, defaults, options);
    //set prompt inner height;
    var promptHeight = opt.promptHeight + 196 > $.winH ? $.winH - 196 : opt.promptHeight;
    var popId;
    var type;
    init();

    function init() {
        //touchmoved checking
        if ($.touchMoved) {
            return false;
        }
        //popup type set
        if (opt.type === 'alert') {
            type = 1;
        } else if (opt.type === 'confrim') {
            type = 2;
        } else if (opt.type === 'select') {
            type = 3;
        } else if (opt.type === 'passcode') {
            type = 4;
        } else if (opt.type === 'prompt') {
            type = 5;
        } else if (opt.type === 'slide') {
            type = 6;
        } else if (opt.type === 'custom') {
            type = 8;
        } else if (opt.type === 'middle') {
            type = 9;
        }
        showPopup();
    }
    //popup close
    function closePopup() {
        //disable popbtn double click 
        $("#" + popId).find(".am-popbtn").off("touchend.popBtn");
        //hide pop window
        $("#" + popId).removeClass("am-on").stop(true, true).fadeOut(200);
        //body pointer reset
        setTimeout(function() {
            $.fn.fnBodyPointer();
            $("#" + popId).remove();
        }, 400);
        //effect blur reset
        $.fn.fnBodyEffect();
    }
    //popup show
    function showPopup() {
        popId = "popup-" + Math.floor(Math.random() * 10000000000 + 1);
        var innerHtml;
        //type alert
        if (type === 1) {
            innerHtml = "<div class='am-pop am-alert' id='" + popId + "'><div class='popBg'></div><div class='inner'><h6><span>" + opt.msg + "</span></h6><a class='am-popbtn am-submit'>" + opt.btnComfirmName + "</a></div></div>";
            $.htmlBody.append(innerHtml);
            //add preventDefault
            $("#" + popId).find(".popBg,h6").on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type confrim
        if (type === 2) {
            innerHtml = "<div class='am-pop am-confrim' id='" + popId + "'><div class='popBg'></div><div class='inner'><h6><span>" + opt.msg + "</span></h6><a class='am-popbtn am-cancel'>" + opt.btnCancelName + "</a><a class='am-popbtn am-submit'>" + opt.btnComfirmName + "</a></div></div>";
            $.htmlBody.append(innerHtml);
            //add preventDefault
            $("#" + popId).find(".popBg,h6").on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type select
        if (type === 3) {
            var length = opt.btnSelectList.length;
            innerHtml = "<div class='am-pop am-select' id='" + popId + "'><div class='popBg'></div><div class='inner'>";
            if (opt.msg !== "") {
                innerHtml += "<h6><span>" + opt.msg + "</span></h6>";
            }
            innerHtml += "<div>";
            for (var i = 0; i < length; i++) {
                //opt.color checking
                if (opt.btnSelectList[i].btnColor) {
                    innerHtml += "<a id='" + opt.btnSelectList[i].id + "' class='am-popbtn am-submit " + opt.btnSelectList[i].btnColor + "'><span>" + opt.btnSelectList[i].btnName + "</span></a>";
                } else {
                    innerHtml += "<a id='" + opt.btnSelectList[i].id + "' class='am-popbtn am-submit'><span>" + opt.btnSelectList[i].btnName + "</span></a>";
                }
            }
            innerHtml += "</div><a class='am-popbtn am-cancel'><span>取消</span></a></div></div>";
            $.htmlBody.append(innerHtml);
            //add preventDefault
            $("#" + popId).find(".popBg").on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type passcode
        if (type === 4) {
            innerHtml = "<div class='am-pop am-passcode' id='" + popId + "'><div class='popBg'></div><div class='inner'><a class='am-popbtn am-close'>X</a><h6><span>" + opt.msg + "</span></h6><div class='code'><span></span><span></span><span></span><span></span><span></span><span></span></div><a class='am-forget-pwd'>忘记交易密码？</a></div><div class='am-keyboard'><span class='am-popbtn'>1</span><span class='am-popbtn'>2</span><span class='am-popbtn'>3</span><span class='am-popbtn'>4</span><span class='am-popbtn'>5</span><span class='am-popbtn'>6</span><span class='am-popbtn'>7</span><span class='am-popbtn'>8</span><span class='am-popbtn'>9</span><span></span><span class='am-popbtn'>0</span><span class='am-popbtn'>del</span></div></div>";
            $.htmlBody.append(innerHtml);
            $("#" + popId).data("pass", "");
            //add preventDefault
            $("#" + popId).on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type prompt
        if (type === 5) {
            innerHtml = "<div class='am-pop am-prompt' id='" + popId + "'><div class='popBg'></div><div class='inner'><span class='" + opt.icon + "'></span><h6><span>" + opt.msg + "</span></h6><div class='prompt-inner' style='height:" + promptHeight + "px'></div><a class='am-popbtn am-cancel'>" + opt.btnCancelName + "</a><a class='am-popbtn am-submit'>" + opt.btnComfirmName + "</a></div></div>";
            $.htmlBody.append(innerHtml);
            opt.onPromptLoad(popId);
            //add preventDefault
            $("#" + popId).find(".popBg,h6,span[class*='am-icon']").on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type slide
        if (type === 6) {
            innerHtml = "<div class='am-pop am-slide' id='" + popId + "'><div class='popBg'></div><div class='inner'><div class='prompt-inner' style='height:" + opt.promptHeight + "px'></div><a class='am-popbtn am-close'>X</a></div></div>";
            $.htmlBody.append(innerHtml);
            opt.onPromptLoad(popId);
            //add preventDefault
            $("#" + popId).on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type custom
        if (type === 8) {
            innerHtml = "<div class='am-pop am-popCustom' id='" + popId + "'><div class='popBg'></div><div class='inner " + opt.customClass + "'><h6>" + opt.msg + "</h6>" + opt.customHtml + "<a class='am-popbtn am-cancel am-btn-active'><span class='am-icon-close'></span></a></div></div>";
            $.htmlBody.append(innerHtml);
            opt.onCustomLoad(popId);
            //add preventDefault
            $("#" + popId).find(".popBg,h6").on("touchmove.preventDefault", $.preventDefault, false);
        } else
        //type middle
        if (type === 9) {
            innerHtml = "<div class='am-pop am-popMiddle' id='" + popId + "'><div class='popBg'></div><div class='inner " + opt.customClass + "'>" + opt.customHtml + "<a class='am-popbtn am-cancel'><span class='am-icon-close-w'></span></a></div></div>";
            $.htmlBody.append(innerHtml);
            opt.onCustomLoad(popId);
            //add preventDefault
            $("#" + popId).on("touchmove.preventDefault", $.preventDefault, false);
        }

        //set btn cancel
        if (opt.btnCancelName === "") {
            $("#" + popId).addClass("am-noCancel");
        }
        if ($("#" + popId).children(".popBg").length && (type === 3 || type === 6)) {
            $("#" + popId).children(".popBg").off("touchend.popBtn").on("touchend.popBtn", function() {
                opt.onCancel();
                closePopup();
            });
        }
        //bind popup inner btn click
        btnCallBack(popId);
        //popup show
        $(".am-pop").hide();
        $("#" + popId).addClass("am-on").stop(true, true).fadeIn(200);
        //for ios keyboard auto release
        $.ambody.find(".am-input").blur();
        //set body pointer
        $.fn.fnBodyPointer();
        //set effect blur
        $.fn.fnBodyEffect($("#" + popId));
    }
    //set popup inner btn click
    function btnCallBack() {
        var index;
        $("#" + popId).find(".am-popbtn,.am-forget-pwd").off("touchend.popBtn").on("touchend.popBtn", function() {
            //touchmoved checking
            if ($.touchMoved) {
                return false;
            }
            //callback type alert
            if (type === 1) {
                if ($(this).hasClass("am-submit")) {
                    opt.onComfirm();
                }
                closePopup();
            } else
            //callback type comfirm
            if (type === 2) {
                if ($(this).hasClass("am-submit")) {
                    opt.onComfirm();
                } else if ($(this).hasClass("am-cancel")) {
                    opt.onCancel();
                }
                closePopup();
            } else
            //callback type select
            if (type === 3) {
                index = $(this).index();
                if ($(this).hasClass("am-submit")) {
                    opt.onSelect(opt.btnSelectList[index]);
                } else if ($(this).hasClass("am-cancel")) {
                    opt.onCancel();
                }
                closePopup();
            } else
            //callback type passcode
            if (type === 4) {
                index = $("#" + popId).data("pass").length + 1;
                var current;
                //key forget password
                if ($(this).hasClass("am-forget-pwd")) {
                    closePopup();
                    opt.onForgetPwd();
                } else
                //key number
                if ($(this).index() !== 11 && $(this).parent().hasClass("am-keyboard")) {
                    current = $(this).text();
                    //set current code
                    $("#" + popId).data("pass", $("#" + popId).data("pass") + current);
                    //show current code
                    $("#" + popId).find(".code>span").eq(index - 1).html("&#8226;");
                    //finished checking
                    if (index === 6) {
                        //off click
                        $("#" + popId).find(".am-popbtn").off("touchend");
                        //callback
                        $("#" + popId).find(".code").addClass("am-color-blue");
                        setTimeout(function() {
                            opt.onPasscode($("#" + popId).data("pass"));
                            //code reset
                            $("#" + popId).find(".code>span").text("");
                            $("#" + popId).find(".code").removeClass("am-color-blue");
                            $("#" + popId).data("pass", "");
                            //close popup
                            closePopup();
                        }, 500);
                    }
                } else
                //key delete
                if ($(this).index() === 11) {
                    index -= 2;
                    var tempCode = $("#" + popId).data("pass").substring(0, index);
                    $("#" + popId).data("pass", tempCode);
                    $("#" + popId).find(".code>span").eq(index).text("");
                } else
                //key close
                if ($(this).parent().hasClass("inner")) {
                    //code clear
                    $("#" + popId).find(".code>span").text("");
                    $("#" + popId).data("pass", "");
                    //callback
                    opt.onCancel();
                    //popup close
                    closePopup();
                }
            } else
            //callback type prompt
            if (type === 5) {
                if ($(this).hasClass("am-submit")) {
                    if (opt.onComfirm() !== false) {
                        closePopup();
                    }
                } else if ($(this).hasClass("am-cancel")) {
                    opt.onCancel();
                    closePopup();
                }
            } else
            //callback type slide
            if (type === 6) {
                closePopup();
            } else
            //callback type custom
            if (type === 8) {
                if ($(this).hasClass("am-submit")) {
                    opt.onComfirm(val);
                } else if ($(this).hasClass("am-cancel")) {
                    opt.onCancel();
                }
                closePopup();
            } else
            //callback type custom
            if (type === 9) {
                if ($(this).hasClass("am-submit")) {
                    opt.onComfirm(val);
                } else if ($(this).hasClass("am-cancel")) {
                    opt.onCancel();
                }
                closePopup();
            }
            //防止点击穿透弹层背部有link
            return;
        });
    }
};
$.fn.fnPopup.loadInner = function(options) {
    var opt = $.extend({}, $.fn.fnPopup.loadInner.defaultOpt, options);
    $("#" + opt.id).find(".prompt-inner").html(opt.html);
    opt.onPromptLoadEnd();
};
$.fn.fnPopup.loadInner.defaultOpt = {
    id: "", //parent popid
    html: "", //prompt inner html
    onPromptLoadEnd: function() {} //loadend callback
};
$.fn.fnPopupClose = function() {
    var $this = $(this);
    $this.removeClass("am-on").stop(true, true).fadeOut(200);
    setTimeout(function() {
        $.fn.fnBodyPointer();
        $this.remove();
    }, 400);
    //effect blur reset
    $.fn.fnBodyEffect();
};
//fnHomeNav=============================================================================================================
$.fn.fnHomeNav = function() {
    var $obj = $(".am-home-nav>a.proNav");
    if (!$obj.length) {
        return false;
    }
    //set selecter
    var $nav = $(".am-home-nav>.proList");
    //bing fnBtnTouch
    $nav.find(".am-btn").fnBtnTouch();
    //bind event
    $obj.off("touchend.wxnav").on("touchend.wxnav", function() {
        fnSetNav();
    });
    $.ambody.off("touchstart.wxnav").on("touchstart.wxnav", function() {
        fnSetNav(1);
    });
    //function
    function fnSetNav(state) {
        if ($nav.hasClass("am-on") || state) {
            $nav.removeClass("am-on").stop(true, true).fadeOut(200);
        } else {
            $nav.addClass("am-on").stop(true, true).fadeIn(200);
        }
        return false;
    }
};
//fnHeader==============================================================================================================
$.fn.fnHeader = function() {
    var $obj = $(".am-header>.inner>a[class*='icon-']");
    if (!$obj.length) {
        return false;
    }
    //set selecter
    var $nav = $(".am-header");
    //bind event
    $obj.off("touchend.nav").on("touchend.nav", function() {
        fnSetNav();
    });
    $.ambody.off("touchstart.nav").on("touchstart.nav", function() {
        fnSetNav(1);
    });
    //function
    function fnSetNav(state) {
        if ($nav.hasClass("am-on") || state) {
            $nav.removeClass("am-on");
        } else {
            $nav.addClass("am-on");
        }
    }
};
//fnPanel===============================================================================================================
$.fn.fnPanel = function() {
    var $panelBtn = $(".am-panel-btn>a");
    var $panelCon = $(".am-panel-con>.am-con");
    if (!$panelBtn.length || !$panelCon.length) {
        return false;
    }
    //init
    var initindex = $panelBtn.filter(".am-on").index();
    $panelCon.eq(initindex).addClass("am-on");
    //bind event
    $panelBtn.off("touchend.panel").on("touchend.panel", function() {

        if (!$(this).hasClass("am-on")) {
            var index = $(this).index();
            fnSetPanel(index);

        }
    });
    //function
    function fnSetPanel(index) {
        $panelBtn.eq(index).addClass("am-on").siblings().removeClass("am-on");
        $panelCon.eq(index).addClass("am-on").siblings().removeClass("am-on");
    }
};
//fnSlidePanel==============================================================================================================
$.fn.fnSlidePanel = function(options) {
    var opt = $.extend({}, $.fn.fnSlidePanel.defaultOpt, options);
    var $panelBtn = $(".am-slide-panel-btn>a");
    var $panelCon = $(".am-slide-panel-con>.am-con");
    var index = $panelBtn.filter(".am-on").index();

    init();

    function init() {
        //check init
        if (!$panelBtn.length || !$panelCon.length) {
            return false;
        }
        //check index
        if (index === -1) {
            index = 0;
        }
        //set default index
        $panelBtn.eq(index).addClass("am-on");
        $panelCon.eq(index).addClass("am-on");

        //bind event
        $panelBtn.off("touchend.slidepanel").on("touchend.slidepanel", function() {
            if (!$(this).hasClass("am-on") && !$.touchMoved) {
                index = $(this).index();
                fnSetPanel();
            }
        });
    }
    //function
    function fnSetPanel() {
        $panelBtn.eq(index).addClass("am-on").siblings().removeClass("am-on");
        $panelCon.eq(index).addClass("am-on").siblings().removeClass("am-on");
        opt.onChanged(index);
    }
};
$.fn.fnSlidePanel.defaultOpt = {
    onChanged: function( /*index*/ ) {}
};
//fnIndexBar============================================================================================================
$.fn.fnIndexBar = function() {
    var $obj = $(".am-indexBar").eq(0);
    if (!$obj.length) {
        return false;
    }
    var $bar = $obj.find(".am-index");
    var indexH = $bar.eq(0).height() - 1; //需要用原高度减掉css中设置的顶部偏差值
    var $index = $("#am-index");
    var length = $bar.length;
    var indexTop = new Array(length);
    var current = 0;
    var defaultTop = 0;
    var scrollTop = $(".am-body:eq(0)").scrollTop();

    //set default top
    if ($(".am-on-forever:visible").length) {
        defaultTop += 48;
    }
    if ($(".am-header:visible").length) {
        defaultTop += 88;
    }
    if ($(".am-pos-fixt:visible").length) {
        defaultTop += 64;
    }

    //set each indexTop
    for (var i = 0; i < length; i++) {
        indexTop[i] = $bar.eq(i).offset().top;
    }
    //set scroll function
    $(window).off("scroll" + ".indexBar").on("scroll" + ".indexBar", fnSetScroll);

    function fnSetScroll() {
        scrollTop = $(window).scrollTop();
        //set header container
        if (indexTop[0] > scrollTop + defaultTop && $index) {
            $index.remove();
            $index = false;
        } else if (indexTop[0] < scrollTop + defaultTop && !$index.length) {
            $("body").append("<div id='am-index' class='am-index' style='top:" + defaultTop + "px'></div>");
            $index = $("#am-index");
        }
        //current checking
        for (var i = 0; i < length; i++) {
            if (indexTop[i] < scrollTop + defaultTop) {
                current = i;
                $index.html($bar.eq(i).html());
            }
        }
        //change animate
        if (indexTop[current + 1] < scrollTop + defaultTop + indexH) {
            $index.find(">span").css({
                "-webkit-transform": "translate3d(0," + (indexTop[current + 1] - scrollTop - defaultTop - indexH) + "px,0)"
            });
        }
    }
};
//fnSlideRuler==========================================================================================================
$.fn.fnSlideRuler = function(options) {
    var opt = $.extend({}, $.fn.fnSlideRuler.defaultOpt, options);
    var maxVal = opt.maxVal;
    var minVal = opt.maxVal >= opt.minVal ? opt.minVal : opt.maxVal;
    var $this = $(this);
    var $input = $this.find(".am-input");
    var $inputClear = $input.prev(".am-input-clear");
    var $inputCon = $input.parents(".am-con");
    var $inner = $this.find(".inner");
    var $ruler;
    var length = maxVal - minVal;
    var itemWidth = 100;
    var valStep;
    var valMultiple = 10000;
    var x, _x;
    var scrollRuler;
    var scrollLock = 0;
    var scrollSpeed = 200;
    var valCurrent;
    var $scrollX;
    init();

    function init() {
        if (!$(".am-slideRuler").length) {
            return false;
        }

        var html = "<ul class='ruler'>";
        html += "<li class='first' style='width:" + ($.winW / 2 + 1) + "px'><span>向左滑动</span></li>";

        //最大值 > 最小值
        if (maxVal >= minVal) {
            for (var i = 0; i < length + 1; i++) {
                html += "<li style='width:" + itemWidth + "px;'><span>" + (parseInt(i) + minVal) + "<em>万</em></span></li>";
            }
        }
        //反之
        else {
            html += "<li><span>" + maxVal + "<em>万</em></span></li>";
        }

        html += "</ul>";
        $inner.html(html);
        $input.after("<span class='am-icon-inputedit'></span>");
        $ruler = $inner.find(".ruler");
        $ruler.find("li:last-child").addClass("last").width($.winW / 2 + 1).append("<span>" + opt.msg + "</span>");
        $ruler.css({ "width": length * itemWidth + $.winW + 4 });

        setStep();

        //绑定事件
        $input.off("input.slideruler").on("input.slideruler", inputChange);
        $inputClear.off("touchend.slideruler").on("touchend.slideruler", inputClear);
        //ready init
        minVal !== 0 ? valCurrent = minVal : valCurrent = 0.0001;
        $input.val(valCurrent * valMultiple);
        opt.onReady(valCurrent);

        //判断min<=>max时
        if (opt.minVal > opt.maxVal) {
            $inner.addClass("am-disable");
            $inputCon.addClass("am-disable");
            return false;
        } else if (opt.minVal === opt.maxVal) {
            $inputCon.addClass("am-disable");
        }

        $scrollX = new IScroll(".am-slideRuler .inner", {
            scrollX: true,
            scrollY: false,
            deceleration: 0.005
        });

        $scrollX.on("scroll", function() {
            x = this.x;
            setScroll();
        });

        $scrollX.on("scrollStart", checkFirst);

        $scrollX.on("scrollEnd", function() {
            x = this.x;
            setScrollEnd();
        });
    }

    function checkFirst() {
        $ruler.addClass("am-on");
        $scrollX.off("scrollStart", checkFirst);
    }

    function setStep() {
        valStep = opt.step * valMultiple;
        $ruler.addClass("step" + valStep);
    }

    function setScroll() {
        if ($input.val() === "") {
            $inputClear.show();
        }
        setScrollVal();
        $input.val(valCurrent * valMultiple);
        opt.onChanged(valCurrent);
    }

    function setScrollEnd() {
        setScrollVal();
        setRulerPos(valCurrent);
        $input.val(valCurrent * valMultiple);
        opt.onChanged(valCurrent);
    }

    function setRulerPos(val) {
        x = -1 * (val - 1) * itemWidth + (minVal - 1) * itemWidth;
        $scrollX.scrollTo(x, 0);
    }

    function setScrollVal() {
        x = $scrollX.x;
        valCurrent = -1 * x / itemWidth + minVal;
        //check min step
        if (opt.step === 1) {
            valCurrent = Math.round(valCurrent);
        } else if (opt.step === 0.1) {
            valCurrent = parseFloat(valCurrent.toFixed(1));
        }
        checkValOffset();
    }

    function inputChange() {
        //格式化后有非法字符时，重置输入框
        if ($input.val() !== $input.val().replace(/[^\d.]/g, '')) {
            $input.val($input.val().replace(/[^\d.]/g, ''));
        }
        valCurrent = Number($input.val()) / valMultiple;
        checkValOffset();
        setRulerPos(valCurrent);
        opt.onChanged(valCurrent);
    }

    function inputClear() {
        valCurrent = 0;
        checkValOffset();
        setRulerPos(valCurrent);
        opt.onChanged(valCurrent);
        opt.onClear();
    }

    function checkValOffset() {
        //check offset min and max
        if (valCurrent <= minVal) {
            valCurrent = minVal;
            if (minVal === 0) {
                valCurrent = 0.0001;
            }
        } else if (valCurrent > maxVal) {
            valCurrent = maxVal;
        }
    }

    function toStdAmount(num) {
        if (num) {
            var numArr = num.replace(/,/g, "").split(".");
            var str = numArr[0];
            while (/(\d+)(\d{3})/.test(str)) {
                str = str.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return (numArr.length > 1 ? (str + '.' + numArr[1]) : str);
        } else {
            return '';
        }
    }
};
$.fn.fnSlideRuler.defaultOpt = {
    //所有金额都是以万为单位
    minVal: 1, //最低起投额
    maxVal: 100, //最高起投额
    step: 1, //递增递减额度，可选范围:[1,0.1]
    msg: "",
    onChanged: function(val) {}, //每次改变金额
    onReady: function(val) {}, //初始化完成
    onClear: function() {} //清空输入框
};
//fnCheckDevice=========================================================================================================
$.fn.fnCheckDevice = function() {
    if (($.browser.versions.android && $.winW <= 720) || ($.browser.versions.ios && $.winW <= 320)) {
        $.GlobalEffect = 0;
        $("body").addClass("am-effect-off");
    } else {
        $.GlobalEffect = 1;
        $("body").removeClass("am-effect-off");
    }
};
//fnCheckOrientation====================================================================================================
$.fn.fnCheckOrientation = function() {
    var resizeTimer = null;
    fnResize();
    $(window).on("resize", function() {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function() {
            fnResize();
        }, 200);
    });

    function fnResize() {
        $.winW = $(window).width();
        $.winH = $(window).height();
        if ($.winW > $.winH) {
            $("body").addClass("am-orientation-on");
        } else {
            $("body").removeClass("am-orientation-on");
        }
    }
};
//fnSetInputBlur========================================================================================================
$.fn.fnInputBlur = function() {
    //for input blur
    $(document).off("touchend.inputBlur").on("touchend.inputBlur", function(e) {
        var $slideRulerInner = $(".am-slideRuler");
        if ((e.target.tagName !== "INPUT") && ($("svg").has(e.target).length === 0) && (e.target.className.indexOf("am-input-clear") < 0) && ($slideRulerInner.has(e.target).length === 0)) {
            $("input").blur();
        }
    });
};
//fnBtnTouch============================================================================================================
$.fn.fnBtnTouch = function() {
    var $target = ".am-btn-active, a.am-row, a.am-btn, label.am-row:not(.am-disable), a.am-filter, .am-popbtn";

    $(document)
        .off("touchstart.btnTouch").on("touchstart.btnTouch", $target, function() {
            $(this).addClass("am-on");
        })
        .off("touchend.btnTouch").on("touchend.btnTouch", $target, function() {
            $(this).removeClass("am-on");
        })
        .off("touchmove.btnTouch").on("touchmove.btnTouch", $target, function() {
            if ($.touchMoved) {
                $(this).removeClass("am-on");
            }
        });
};
//fnBodyEffect==========================================================================================================
$.fn.fnBodyEffect = function(obj) {
    //check effect
    if (!$.GlobalEffect) {
        return false;
    }
    //set effect blur
    var length = $(obj).length;
    if (!$.htmlBody.hasClass("am-blur")) {
        $.htmlBody.addClass("am-blur");
        for (var i = 0; i < length; i++) {
            $(obj).eq(i).addClass("am-blur-active");
        }
    } else {
        $.htmlBody.removeClass("am-blur");
        $("am-blur-active").removeClass("am-blur-active");
    }
};
//fnBodyPointer=========================================================================================================
$.fn.fnBodyPointer = function() {
    if (!$.ambody.hasClass("am-on")) {
        $.ambody.addClass("am-on");
    } else {
        $.ambody.removeClass("am-on");
    }
};
//fnPriceLongTouch======================================================================================================
$.fn.fnPriceLongTouch = function(options) {
    var opt = $.extend({}, $.fn.fnPriceLongTouch.defaultOpt, options);
    var $btn = $(this).children(".am-btn");
    var $val = $(this).find(".am-input");
    var timeOffsetL0, timeS;
    var longLock = 1;
    var myTime = new Date();
    var stepVal = Number(opt.stepVal.toFixed(2));
    var val = Number(opt.minVal.toFixed(2));
    var timeOut, stepTime;
    var type;
    init();

    function init() {
        $val.val(opt.curVal);
        $btn
            .off("touchstart.longtouch touchend.longtouch")
            .on("touchstart.longtouch", fnBtnStart)
            .on("touchend.longtouch", fnBtnEnd);
        $val
            .off("input.longtouch")
            .on("input.longtouch", fnValInput);
    }

    function fnValInput() {
        val = Number($val.val()) || opt.curVal;
        opt.onChanged(val);
    }

    function fnBtnStart(e) {
        val = Number($val.val()) || opt.curVal;
        stepVal = Number(opt.stepVal.toFixed(2));
        if ($(this).hasClass("am-btnAdd")) {
            type = 1;
        } else {
            type = 0;
        }

        fnSetVal();
        myTime = new Date();
        timeS = myTime.getTime();
        clearTimeout(timeOut);
        timeOut = setTimeout(fnInterval, 500);
        e.preventDefault();
    }

    function fnBtnEnd() {
        myTime = new Date();
        timeOffsetL0 = myTime.getTime() - timeS;
        longLock = 1;
        clearTimeout(timeOut);
        //判断最大最小后不回调
        if (val !== opt.minVal && val !== opt.maxVal) {
            opt.onTouchEnd(val);
        }
    }

    function fnInterval() {
        myTime = new Date();
        timeOffsetL0 = myTime.getTime() - timeS;
        stepTime = 1 / Math.pow(timeOffsetL0 / 1000, 1.2) * 100;
        if (stepTime < 16.66) {
            stepTime = 16.66
        }
        timeOut = setTimeout(fnInterval, 1 / Math.pow(timeOffsetL0 / 1000, 1.2) * 100);
        fnSetVal();
    }

    function fnSetVal() {
        if (!$.touchMoved) {
            //判断加减按键
            if (type) {
                val += stepVal;
            } else {
                val -= stepVal;
            }
            //判断最大最小值
            if (val < opt.minVal) {
                val = opt.minVal;
                opt.onValMin();
            } else if (val > opt.maxVal) {
                val = opt.maxVal;
                opt.onValMax();
            } else {
                //设置数字并回调
                val = Number(val.toFixed(2));
                $val.val(val);
                opt.onChanged(val);
            }
        }
    }
};
$.fn.fnPriceLongTouch.defaultOpt = {
    minVal: 4, //最小值
    maxVal: 12, //最大值
    curVal: 8, //默认值
    stepVal: 0.01, //最小变化值
    onChanged: function(val) {}, //改变值后回调
    onTouchEnd: function(val) {}, //长按松开回调
    onValMin: function() {}, //小于最小值回调
    onValMax: function() {} //大于最大值回调
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//event type checking
var fnSetEvent = function() {
    $.eventStart = $.isSupportTouch ? "touchstart" : "mousedown";
    $.eventMove = $.isSupportTouch ? "touchmove" : "mousemove";
    $.eventEnd = $.isSupportTouch ? "touchend" : "mouseup";
};
//touchmoved checking
var touchmove = {
    init: function() {
        $(document).off("touchstart").on("touchstart", this.move);
        $(document).off("touchmove").on("touchmove", this.move);
    },
    move: function(e) {
        if (e.type === "touchstart") {
            touchmove._x = e.originalEvent.changedTouches[0].pageX; //for jquery
            touchmove._y = e.originalEvent.changedTouches[0].pageY;
            $.touchMoved = false;
        } else if (e.type === "touchmove") {
            var _x = e.originalEvent.changedTouches[0].pageX;
            var _y = e.originalEvent.changedTouches[0].pageY;
            if (Math.abs(_x - touchmove._x) > 10 || Math.abs(_y - touchmove._y) > 10) {
                $.touchMoved = true;
            }
        }
    }
};
//set local storage page name last 5
var fnPageUnload = function() {
    var arrPageList = localStorage.getItem('pageList').split(",");
    var pageArr = $(".am-outer:eq(0)").attr("class").split(" ") || "noset";
    var pageName;
    if (pageArr === "noset" || pageArr[0] === "am-outer") {
        pageName = "noset";
    } else {
        pageName = pageArr[0];
    }
    if (arrPageList[0] !== pageName) {
        arrPageList.unshift(pageName);
        if (arrPageList.length > 5) {
            arrPageList = arrPageList.slice(0, 5);
        }
        localStorage.setItem("pageList", arrPageList);
    }
};
//page ready
var fnPageReady = function() {
    fnSetEvent();
    touchmove.init();
    $.htmlBody = $("body");
    $.ambody = $("div.am-body").eq(0);
    $.fn.fnCheckOrientation();
    $.fn.fnInputBlur();
    $.fn.fnSetFooterTips();
    $.fn.fnIndexBar();
    $.fn.fnHomeNav();
    $.fn.fnHeader();
    $.fn.fnBtnTouch();
    $.fn.fnPanel();
    $.fn.fnSlidePanel();
    $("label").fnChecked();
    $("input.am-input").fnInput();
    $("div.am-slidedown:not(.am-on)>.am-row>.am-row-title").fnSlideDown();
    $(".am-dropdown .am-dropdown-inner").fnDropDown();
    $(".am-btnSwitch").fnBtnSwitch();
    $("body").on("touchmove.preventDefault", $.preventDefault, false);
    $("body").addClass("am-effect-off");
    $(window).on("unload", fnPageUnload);
    //$(".am-con-btnPrice").fnPriceLongTouch();
};
fnPageReady();
//loading finish========================================================================================================
$('body').imagesLoaded().always(function() {
    $.fn.fnCheckDevice();
    $("body>.am-loading").fadeOut(300);
    $("body").off("touchmove.preventDefault");
});
//});
