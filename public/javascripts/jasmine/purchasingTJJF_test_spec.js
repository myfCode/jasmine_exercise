describe('test function getSMSVerifyCode/', function() {
	
	var _getSMSVerifyCode;

	beforeEach(function() {
		jasmine.getFixtures().fixturesPath = 'javascripts/jasmine/fixtures/';
		loadFixtures('c.html');

		_getSMSVerifyCode = getSMSVerifyCode({
				dom: $("#get-cert"),
				cardPkid: $('#cardPkid').val()
			});


		spyOn(_getSMSVerifyCode, 'domClicked').and.callThrough();
		spyOn(_getSMSVerifyCode, 'getCodeSuccess').and.callThrough();
		spyOn(_getSMSVerifyCode, 'getCode').and.callThrough();
		
	})
	

	it('1. before click', function() {
		expect(_getSMSVerifyCode.hasDisable()).toBe(false);
		expect($('.token').hasClass('am-hide')).toBe(true);
		expect($('#voiceText').hasClass('am-hide')).toBe(true);
		expect(_getSMSVerifyCode.getData()).toBe(null);
	})

	it('2. getSMSVerifyCode clicked', function() {
		_getSMSVerifyCode.domClicked();
		expect(_getSMSVerifyCode.domClicked).toHaveBeenCalled();
		expect(_getSMSVerifyCode.getCodeSuccess).toHaveBeenCalled();
		expect(_getSMSVerifyCode.getCode).toHaveBeenCalled();
		expect(_getSMSVerifyCode.hasDisable()).toBe(true);
	})
})

describe('test function checkbox/', function() {

	var _checkBox = checkBox({
		account: 10000,
		accountAviable: '1',
		accountBalance: 0,
		mixpay: 1,
		bankLimit: 500
	})

})