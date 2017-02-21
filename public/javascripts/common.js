// define(['jquery','errorMsg'], function($,errorMsg) {
//     'use strict';

    Date.prototype.format = function(format){ //日期格式化
		var o = { 
			"M+" : this.getMonth()+1, //month 
			"d+" : this.getDate(), //day 
			"h+" : this.getHours(), //hour 
			"m+" : this.getMinutes(), //minute 
			"s+" : this.getSeconds(), //second 
			"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
			"S" : this.getMilliseconds() //millisecond 
		};

		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length===1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format; 
	};
	String.prototype.trim = function(){//去掉string两边字符
　　     return this.replace(/(^\s*)|(\s*$)/g, "");
　　};
	String.prototype.getLen = function(){//计算字符的长度
		var totalLength = 0;     
		var charCode;  
		for (var i = 0; i < this.length; i++) {  
			charCode = this.charCodeAt(i);  
			if (charCode < 0x007f)  {
				totalLength++;
			} else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
				totalLength += 2;
			} else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
				totalLength += 3;
			} else{  
				totalLength += 4;
			}
		}  
		return totalLength;
　　};
    var const_counter = 60;
    var const_counter_timeout = 0;
    var _counter = const_counter;
    // 显示loading框
    var loading = function(txt){
        txt = txt ? txt : "加载中...";
        var _html = "<div id='_vload_'><div class='inner'><div class='con'><div class='loading' type='12'></div><span>" + txt + "</span></div></div></div>";
        $("#_vload_").remove();
        $("body").append(_html);
        $("#_vload_").data("remove", "false");
        $("#_vload_").addClass("show am-effect-active");
        //$("#_vload_ .inner .con span").show();
    };

    // 隐藏loading框
    var unloading = function(){
        $("#_vload_").removeClass("show").removeClass('am-effect-active').data("remove", "true");
        setTimeout(function(){
            if ($("#_vload_").data("remove") === "true") {
                $("#_vload_").remove();
            }
        }, 200);
    };
    var common = {
    	getContent: function(url, type, datatype, data, callback, needloading){
	    	if (needloading !== false) {
    			loading();
    		}
	        setTimeout(function(){
				//除去类型为string的前后的空格
				for( var attr in data){
					if(Object.prototype.toString.call(data[attr]) === '[object String]'){
						data[attr] = data[attr].trim();
					}
					if(Object.prototype.toString.call(data[attr]) === '[object Array]'){
						for(var i=0;i<data[attr].length;i++){
							if(Object.prototype.toString.call(data[attr][i]) === '[object String]'){
								data[attr][i] = data[attr][i].trim();
							}
						}
					}
				}
				//发送ajax
	            $.ajax({
	                url : url,
	                type : type,
	                dataType : datatype,
	                data : data,
					timeout: 300000,
	                headers: {'x-csrf-token': window.csrf},
	                success: function(e){
						if(datatype === 'html' || datatype === 'HTML'){
							try{
								e = $.parseJSON(e);
							}catch(err){}
						}
						if (needloading !== false) {
							unloading();
						}
	                    if (e.status === 'NO_LOGIN') {
	                    	window.location.href = '/login.html';
	                    	return;
	                    } else if (e.status === 'YES_LOGIN') {
	                    	window.location.href = '/';
	                    	return;
	                    } else if (e.status === 'NO_IDVERIFIED') {
	                    	window.location.href = '/account/authentication.html';
	                    	return;
	                    } else if (e.status === 'YES_IDVERIFIED') {
	                    	window.location.href = '/account/identity.html';
	                    	return;
	                    } else if (e.status === 'NO_TRADEPASSWORD') {
	                    	window.location.href = '/account/set_trade_psd.html';
	                    	return;
	                    } else if (e.status === 'YES_TRADEPASSWORD') {
	                    	window.location.href = '/account/safe.html';
	                    	return;
	                    } else if (e.status === 'NO_CARDBINDED') {
	                    	window.location.href='/account/card_addFirstCard.html';
	                    	return;
	                    } else if (e.status === 'YES_CARDBINDED') {
	                    	window.location.href = '/account/identity.html';
	                    	return;
	                    } else if (e.status === '2') {
							$.fn.fnPopup({
								type: "alert",
								icon: "icon-warning",
								msg: e.msg,
								btnComfirmName: "确定"
							});
	                    }
	                    if(typeof callback === 'function'){
	                        callback(e);
	                    }
	                },
	                error : function(e){
	                    if (needloading !== false) {
							unloading();
						}
	                    try{
							console.log(e);
						}catch(er){
							if(window.console){
								window.console.log(e);
							}
						}
						if(e.statusText === 'timeout' || e.statusText === 'error' || e.responseText === '324'){
							window.alert(errorMsg.system.timeout);
						}else{
							window.alert(errorMsg.system.timeout);
						}
	                } 
	            });
	        },10);
	    },
    	testTel: function(str) {
    		return (/^1(\d){10}$/.test(str));
    	},
		testTelNum:function(str){//校验手机号段
			var STR = str.replace(/(^\s*)|(\s*$)/g, "");//去除空格
    		var pattern = /^1((3[0-9])|(5[0-35-9])|(7[0135-8])|(8[0-9])|(4[579]))\d{8}$/;
    		return (pattern.test(STR))
		},
		testEmail:function(_email){
			return (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(_email.trim());
		},
		testNum: function(str) {
			return (/\d/g.test(str));
		},
		testEngChar: function(str) {
			return (/[A-Za-z]/g.test(str));
		},
		testCJKChar: function(str) {
			return (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str));
		},
		testLegalSpicChar: function(str) {
			return (/[~\.\!@#\$\%\^&\*]/g.test(str));
		},
		testIlegalSpicChar: function(str) {
			return (/[,\(\)`<>\?\/:;"'\[\{\]\}\|\\\-_\+=\s]/g.test(str));
		},
		checkStrong: function(str){
			var i = 0;
			if(common.testNum(str)){
				i++;
			}
			if(common.testEngChar(str)){
				i++;
			}
			if(common.testLegalSpicChar(str)){
				i++;
			}
			if(common.testIlegalSpicChar(str)){
				i=4;
			}
			if(common.testCJKChar(str)){
				i=5;
			}
			return i;
		},
		toBigAmount: function(num) {
			var strOutput = "";
			var strUnit = '仟佰拾万仟佰拾亿仟佰拾万仟佰拾元角分';
			num += "00";
			var intPos = num.indexOf('.');
			if (intPos >= 0) {
				num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
			}
			strUnit = strUnit.substr(strUnit.length - num.length);
			for (var i=0; i < num.length; i++) {
				strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
			}
			var res = strOutput.replace(/零角零分$/, '整').replace(/零角/, '').replace(/零分$/, '').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
			return (res === '整' || res === '零元整')?"&nbsp;" :res;
		},
		toStdAmount: function(num) {
			if(num){
				var numArr = (num+'').replace(/,/g,"").split(".");
				var str = numArr[0];
				while(/(\d+)(\d{3})/.test(str)){
					str = str.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
				}
				if(numArr.length === 1){
					return (str+".00");
				} else if(numArr.length === 2){
					if((numArr[1] + "").length === 1){
						return (str +'.' + numArr[1] + "0");
					} else {
						return (str +'.' + numArr[1]);
					}
				}
			}else{
				return '';
			}
		},
		toStdInput: function(num) {
			if(num){
				var numArr = (num+'').replace(/,/g,"").split(".");
				var str = numArr[0];
				while(/(\d+)(\d{3})/.test(str)){
					str = str.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
				}
				if(numArr.length === 2){
					return str +'.' + numArr[1];
				}else{
					return (numArr[1])?(str +'.' + numArr[1]):str;
				}
			}else{
				return '';
			}
		},
		getQueryString2:function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) return unescape(r[2]); return undefined;
		},
		locate: function(id){//定位页面元素
			var shap = document.location.href.indexOf("#");
			if(shap >0){//url存在#
				document.location.href = document.location.href.substr(0,shap) + "#" + id;
			}else{
				document.location.href = document.location.href + "#" + id;
			}
		},
		_getPrecision:function(arg){
			if(arg.toString().indexOf(".")==-1){
				return 0;
			}else{
				return arg.toString().split(".")[1].length;
			}
		},
		_getIntFromFloat:function(arg){
			if(arg.toString().indexOf(".")==-1){
				return arg;
			}else{
				return Number(arg.toString().replace(".",""));
			}
		},
		//乘法
		floatMulti:function(arg1,arg2){
			var precision1=common._getPrecision(arg1);
			var precision2=common._getPrecision(arg2);
			var tempPrecision=0;

			tempPrecision+=precision1;
			tempPrecision+=precision2;
			var int1=common._getIntFromFloat(arg1);
			var int2=common._getIntFromFloat(arg2);
			return (int1*int2)*Math.pow(10,-tempPrecision);
		},
		//加法
		floatAdd:function(arg1,arg2){
			var precision1=common._getPrecision(arg1);
			var precision2=common._getPrecision(arg2);
			var temp=Math.pow(10,Math.max(precision1,precision2));
			return (common.floatMulti(arg1,temp)+common.floatMulti(arg2,temp))/temp;
		},
		//减法
		floatSubtract:function(arg1,arg2){
			var precision1=common._getPrecision(arg1);
			var precision2=common._getPrecision(arg2);
			var temp=Math.pow(10,Math.max(precision1,precision2));
			return (common.floatMulti(arg1,temp)-common.floatMulti(arg2,temp))/temp;
		},
		//除法
		floatDiv:function(arg1,arg2){
			var precision1=common._getPrecision(arg1); 
			var precision2=common._getPrecision(arg2); 
			var int1=common._getIntFromFloat(arg1); 
			var int2=common._getIntFromFloat(arg2); 
			var result=(int1/int2)*Math.pow(10,precision2-precision1); 
			return result; 
		},
		getWeekDay: function(str){//根据日期字符串获取所在周第几天，str-格式yyyy-MM-dd
			var date = new Date();
			var week = ['一','二','三','四','五','六','日']
			date.setYear(str.substr(0,4));
			date.setMonth(str.substr(5,2));
			date.setDate(str.substr(8,2));
			return week[date.getDay()];
		},
		href: function(url){
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			    var referLink = document.createElement('a');
			    referLink.href = url;
			    document.body.appendChild(referLink);
			    referLink.click();
			} else {
			    document.location.href = url;
			}
		},
		isIE8: function(){
			if(navigator.userAgent.indexOf("MSIE 7.0")>0 || navigator.userAgent.indexOf("MSIE 8.0")>0){
				return true;
			}else{
				return false;
			}
		},
		isLeapYear: function (year) {
			return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
		},
		calProfit: function (amt,rate,num,unit){//计算收益
			if(arguments.length !== 4){
				return null;
			}
			rate = common.floatDiv(rate,100);
			return common.floatMulti(common.floatMulti(amt,rate),common.floatDiv(num,365));
			/*
			switch(unit){
				case '天':
				//return common.floatMulti(common.floatMulti(amt,rate),common.floatDiv(num,(common.isLeapYear((new Date).getFullYear()))?366:365));
				return common.floatMulti(common.floatMulti(amt,rate),common.floatDiv(num,365));
				case '月':
				return common.floatMulti(common.floatMulti(amt,rate),common.floatDiv(num,12));
				case '年':
				return common.floatMulti(amt,rate);
			}
			*/
		},
		mailSuffix: [
			'@jianghang.avic.com',
			'@jianghang.com',
			'@avic.com',
			'@zhdzaqm.com',
			'@catic.com.cn',
			'@aviccae.com',
			'@avichm.com',
			'@avichina.com',
			'@csaa.org.cn',
			'@cape.cn',
			'@chrdi.com',
			'@avic-intl.cn',
			'@intl-bj.avic.com',
			'@avicship.com',
			'@caticgz.cn',
			'@caticxm.com',
			'@tianma.cn',
			'@carec.com.cn',
			'@aited.cn',
			'@raisescience.cn',
			'@scc.com.cn',
			'@avic-logistics.com.cn',
			'@catic-eng.com',
			'@szrainbow.com.cn',
			'@avic-energy.com',
			'@avic-mr.com',
			'@avic-forestry.com',
			'@zc.avic.com',
			'@aviccapital.com',
			'@avicfund.com',
			'@groupama-avic.com.cn',
			'@cafco.com.cn',
			'@chinaleasing.net',
			'@scstock.com',
			'@aviclink.com',
			'@aircraft_co.avic.com',
			'@acae.com.cn',
			'@avictest.avic.com',
			'@xaec.com',
			'@dongangroup.cn',
			'@xac.com.cn',
			'@hafei.com',
			'@changhe.com',
			'@caiga.cn',
			'@sanxinglass.com',
			'@avic-gac.com',
			'@joy-air.com',
			'@hongdu.com.cn',
			'@tjaemc.com',
			'@lhgd.com.cn',
			'@aviclub.cn',
			'@cirrusaircraft.com',
			'@avicinformation.cn',
			'@qingan.com',
			'@aited.cn',
			'@avic-apc.com.cn',
			'@avic-defence.com.cn',
			'@cae.ac.cn',
			'@acul.com.cn',
			'@sparkaudio.com',
			'@avic-lutong.com',
			'@castic-smp.com',
			'@catichz.com',
			'@avicade.com',
			'@shbc.com.cn',
			'@chinayaguang.com',
			'@avic-pm.com',
			'@avic-cec.com',
			'@caticzh.com',
			'@aaec.com.cn',
			'@avic-cl.com',
			'@eavic.com',
			'@avic-logistics.net.cn',
			'@avic-phoenix.com',
			'@wh406.com',
			'@biam.ac.cn',
			'@cannews.com.cn',
			'@basc.com.cn',
			'@chsav.com',
			'@avictc.com',
			'@avic-storefriendly.com',
			'@avic.com.cn',
			'@srtc.com.cn',
			'@kongtiao.cn',
			'@avicfinance.com.cn',
			'@avic-aic.com',
			'@fj.avic-intl.cn',
			'@avicsec.com',
			'@catic.cn',
			'@c-bmc.com.cn',
			'@avic-spv.com',
			'@rainbowcn.com',
			'@avic-apc.com',
			'@bjraise.cn',
			'@fiyta.com.cn',
			'@cimm.com.cn',
			'@avicit.com',
			'@cape.avic.com',
			'@avic-steel.com',
			'@avicgeneral.com',
			'@gshmhotels.com',
			'@grandskylight.com',
			'@grandskylight-intl.com',
			'@skytelhotels.com',
			'@catic-co.com',
			'@cayin.cn',
			'@sjjx.cn',
			'@intl-zh.avic.com',
			'@gc.avic-intl.cn',
			'@groupama.com.cn',
			'@qianshao.com'
		],
		disInput: function(dom$){
			if(dom$.length){
				dom$.css('ime-mode','disabled');
				dom$.on("keypress",function(e){e.preventDefault();return false;});
				dom$.on("paste",function(e){e.preventDefault();return false;});
				dom$.on("cut",function(e){e.preventDefault();return false;});
				dom$.on("input",function(e){var dom = e.delegateTarget;dom.value=dom.defaultValue;e.preventDefault();return false;});
			}
		}
    };

    // return common;
// });