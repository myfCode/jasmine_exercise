define(['jquery','common','errorMsg'], function($,common,errorMsg) {
    'use strict';

	var flag = true;
	//短信验证码
	function loadToken(e){
		var dom = e.delegateTarget;
		if($(dom).hasClass('am-disable')){
			return false;
		}
		//申明传参对象
		var postData = {
			verifyType: 'sms.buy',
			cardPkid: $('#cardPkid').val()
		};

		//调用ajax方法
		common.getContent('/sendVerificationCodeByEncryptedMobile.html','POST', 'JSON', postData, function(data){
			//根据status状态值判断成功或其他情况
			if (data.status === '0') {
				$("input[name='pkid']").val(data.tempVerificationPkid);
				$('.token').removeClass('am-hide');
				$('#voiceText').removeClass('am-hide');
				$('#voiceTextEnd').addClass('am-hide');
				$.fn.fnBtnVerifyCode({
					target: $(dom)
				});
			}
		});
	}
	//勾选框逻辑
	function checkCheckbox(){
		var v = $("#amount").val().replace(/,/g,"");
		if ($('#accountAvailable').val() === '1') {
			if ($('#accountBalance').val() === '0') {
				//如果钱包余额为0，钱包不能选，默认选银行卡
				$('#walletPay').addClass('am-disable');
				$('#bankPay').addClass('am-disable').find('.am-icon-checkbox').addClass('am-on');
				$('#bankPayAmount').html(v);
			} else {
				if (parseInt(v*100,10) <= parseInt(($("#accountBalance").val())*100,10)) {
					//如果投资金额小于等于钱包余额为单选
					if (parseInt(v*100,10) > parseInt(($("#bankLimit").val())*100,10)) {
						//如果投资金额大于银行卡限额，银行卡不可选，默认选钱包
						$('#walletPay').find('.am-icon-checkbox').addClass('am-on');
						$('#bankPay').addClass('am-disable').find('#bankPayAmount').html('0.00');
						$('#walletPayAmount').html(v);
					} else {
						//如果投资金额小于等于银行卡限额，都可选
						$('#bankPay').find('.am-icon-checkbox').addClass('am-on');
						$('#bankPayAmount').html(v);
						$('#bankPayAmount').show();
						$('#walletPay').fnChecked({
							onChecked: function(){
								if($('#walletPay').find('.am-icon-checkbox').hasClass('am-on')){
									$('#bankPay').find('.am-icon-checkbox').removeClass('am-on');
									$('#bankPayAmount').html('0.00');
									$('#walletPayAmount').html(v);
								}else{
									$('#walletPayAmount').html('0.00');
									$('#bankPay').find('.am-icon-checkbox').addClass('am-on');
									$('#bankPayAmount').html(v);
								}
							}
						});
						$('#bankPay').fnChecked({
							onChecked: function(){
								if($('#bankPay').find('.am-icon-checkbox').hasClass('am-on')){
									$('#walletPay').find('.am-icon-checkbox').removeClass('am-on');
									$('#walletPayAmount').html('0.00');
									$('#bankPayAmount').html(v);
								}else{
									$('#bankPayAmount').html('0.00');
									$('#walletPay').find('.am-icon-checkbox').addClass('am-on');
									$('#walletPayAmount').html(v);
								}
							}
						});
					}
				} else {
					if ($('#mixpay').val() === '1') {
						if (parseInt(v*100,10) > parseInt(($("#bankLimit").val())*100,10)) {
							//当投资金额大于银行卡限额时，必须同时勾选
							$('#walletPay').addClass('am-disable').find('.am-icon-checkbox').addClass('am-on');
							$('#bankPay').addClass('am-disable').find('.am-icon-checkbox').addClass('am-on');
							$('#walletPayAmount').html($("#accountBalance").val());
							$('#bankPayAmount').html(common.floatSubtract(v,$("#accountBalance").val()));
						} else {
							//可只用银行卡或钱包＋银行卡
							//$('#walletPay').find('.am-icon-checkbox').addClass('am-on');
							$('#bankPay').addClass('am-disable').find('.am-icon-checkbox').addClass('am-on');
							//$('#walletPayAmount').html($("#accountBalance").val());
							$('#bankPayAmount').html(v);
							$('#bankPayAmount').show();
							$('#walletPay').fnChecked({
								onChecked: function(){
									if($('#walletPay').find('.am-icon-checkbox').hasClass('am-on')){
										$('#walletPayAmount').html($("#accountBalance").val());
										$('#bankPayAmount').html(common.floatSubtract(v,$("#accountBalance").val()));
									}else{
										$('#walletPayAmount').html('0.00');
										$('#bankPayAmount').html(v);
									}
								}
							});
						}
					} else {
						//不可混合支付，因为投资金额大于钱包余额，所以只能用银行卡
						$('#walletPay').addClass('am-disable');
						$('#walletPayAmount').html('0.00');
						$('#bankPay').addClass('am-disable').find('.am-icon-checkbox').addClass('am-on');
						$('#bankPayAmount').html(v);
						$('#bankPayAmount').show();
					}
				}
			}
		} else {
			//如果钱包不可用，钱包不能选，默认选银行卡
			$('#walletPay').addClass('am-disable');
			$('#bankPayAmount').html(v);
			$('ul.am-con').find('li').each(function(){
				$(this).removeClass('am-disable');
				if (parseInt($('#amount').val().replace(/,/g,"")*100,10) > parseInt($(this).find('#limit').val()*100,10)) {
					$(this).addClass('am-disable');
				}else{
					if(flag){
						flag = false;
						$(this).trigger('click');
						$(this).parent().trigger('click');
					}
				}
			});
			
		}
	}
	//确认购买
	function goBuy(){
		var amt = $("#amount").val().replace(/,/g,"");
		var accountBalance = $("#accountBalance").val();
		var accountAvailable = $("#accountAvailable").val();
		var acct = Number($("#walletPay").find('.am-icon-checkbox').hasClass('am-on'));
		var card = Number($("#bankPay").find('.am-icon-checkbox').hasClass('am-on'));
		var companyVerified = $("#companyVerified").val();
		var cert = $("#cert").val();
		var password = $("#password").val();
		var mixpay = $("#mixpay").val();
		var accountMoney = $("#walletPayAmount").html();
		var cardPkid = $("#cardPkid").val();
		var bankLimit = $("#bankLimit").val();
		
		if(mixpay === "" && acct === 1 && card === 1){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.amount.purchase_payMethod_mix
			});
			return ;
		}
		if(acct === 0 && card === 0){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.amount.purchase_payMethod_none
			});
			return ;
		}
		
		var bankLimitNumber = Number(bankLimit)*100;
		var accountBalanceNumber = Number(accountBalance)*100;
		var amtNumber = Number(amt)*100;
		if(acct === 1){
			if(accountBalanceNumber < amtNumber){
				if(card === 1){
					if(amtNumber-accountBalanceNumber > bankLimitNumber){
						$.fn.fnNotice({
							target: $("#purchasing .am-fieldset"),
							msg: errorMsg.amount.purchase_big_acct_bank
						});
						return ;
					}
				}else{
					$.fn.fnNotice({
						target: $("#purchasing .am-fieldset"),
						msg: errorMsg.amount.purchase_big_acct
					});
					return ;
				}
			}
		}else if(card === 1){
			if(amtNumber > bankLimitNumber){
				$.fn.fnNotice({
					target: $("#purchasing .am-fieldset"),
					msg: errorMsg.amount.purchase_big_bank
				});
				return ;
			}
		}
		//至少购买minAmountBuy
		if(Number(amt) < Number($('#minAmountBuy').val())){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.amount.purchase_min_error($('#minAmountBuy').val())
			});
			return ;
		}
		if(cert === ""){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.token.none
			});
			return ;
		}
		if(password === ""){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.trade_password.none
			});
			return ;
		}
		if(password.trim().length !== 6 || isNaN(password)){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.trade_password.incorrect
			});
			return ;
		}
		if(accountAvailable !== "1" && acct === 1){
			$.fn.fnNotice({
				target: $("#purchasing .am-fieldset"),
				msg: errorMsg.amount.purchase_payMethod_none
			});
			return ;
		}
		//不允许输入小数，将用户输入金额向下取整
		if($("#isAmountDecimal").val() !== '1'){
			amt = Math.floor(amt);
		}
		var postData = {
			amount: amt,
			accountPay: acct.toString(),
			bankPay: card.toString(),
			verificationCode: cert,
			tempVerificationPkid: $("input[name='pkid']").val(),
			tradePassword: password,
			accountBalance: accountBalance,
			accountMoney: accountMoney,
			accountAvailable: accountAvailable,
			bankLimit: bankLimit,
			cardPkid: cardPkid
		};

		common.getContent("/trade/purchasingTJJF.html", "POST", "JSON", postData, function(data){
			if (data.status === '0') {
				$("#purchasing").hide();
				if(data.buyDate){
					$("#purchasingSuccess1").removeClass('am-hide');
					$("#purchasingSuccess1").find('#date1').html(data.buyDate);
					$("#purchasingSuccess1").find('#date2').html(data.valueDate);
					$("#purchasingSuccess1").find('#date3').html(data.canQueryProfitDate);
				}else{
					$("#purchasingSuccess2").removeClass('am-hide');
					$("#purchasingSuccess2").find('#date1').html(data.valueDate);
					$("#purchasingSuccess2").find('#date2').html(data.canQueryProfitDate);
				}
			} else if (data.status === '1') {
				if(data.tip === '5'){
					$("#purchasing").hide();
					$("#purchasingSuccess1").addClass('am-hide');
					$("#purchasingUnknow").removeClass('am-hide');
				}else{
					$.fn.fnNotice({
						target: $("#purchasing .am-fieldset"),
						msg: data.msg
					});
				}
			}
		});

	}
	//发送语音短信
	function sendVoiceClicked(e){
		var dom = e.delegateTarget;
		//初始化错误提示
		
		var pkid = $('input[name="pkid"]').val();
		
		//申明传参对象
		var postData = {
			tempVerificationPkid: pkid
		};

		//调用ajax方法
		common.getContent('/sendVoiceCode.html','POST', 'JSON', postData, function(data){
			//根据status状态值判断成功或其他情况
			if (data.status === '0') {
				$('#voiceText').addClass('am-hide');
				$('#voiceTextEnd').removeClass('am-hide');
			} else {
				$.fn.fnNotice({
					target: $("#purchasing .am-fieldset"),
					msg: data.msg
				});
			}
		});
	}
	//选中银行卡
	function checkBank(e){
		var dom = e.delegateTarget;
		if($(dom).hasClass('am-disable')){
			return false;
		}
		$('#cardPkid').val($(dom).find('#cardId').val());
		$('#bankLimit').val($(dom).find('#limit').val());
		$('#shieldedBankMobile').html($(dom).find('#bankMobile').val());
		$('#bankPay').find('.am-g25').html($(dom).find('label').html());
		$('#bankPay').find('.BankLimit').html($(dom).find('p').html());
		$('#bankPay').find('.bankLogo').removeClass().addClass($(dom).find('div').attr('class'));
		$('#bankPay').find('.am-icon-checkbox').addClass('am-on');
		$.fn.fnBtnVerifyCode.clear({
			target: $('#get-cert')
		});
		$('#cert').val('');
		$('#voiceText').addClass('am-hide');
		$('#voiceTextEnd').addClass('am-hide');
		$('.token').addClass('am-hide');
	}
	
    var init = function() {
    	$(".form-safe-keyboard").fnKeyBoard();//安全键盘
    	$('ul.am-con').find('li').on('click',checkBank);
		checkCheckbox();
    	$("#get-cert").on("click",loadToken);
		$("#confirm").on("click",goBuy);
    	$('#sendVoice').on('click',sendVoiceClicked);
    };

    return {
        init: init
    };
});