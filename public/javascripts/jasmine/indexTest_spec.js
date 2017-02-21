describe('indexTest_spec.js function test', function() {

	// it('adf sddfd', function() {
	// 	expect($('h1').text()).not.toBe('');
	// 	expect($('h1').text()).toBe('Express');
	// })


	// it('sdffddfd df', function() {
	// 	expect($('#input').val()).toEqual(123);
	// })

	function checkedThree() {
		$('input[type="checkbox"]').eq(2).attr('checked', 'checked');
		$('input[type="checkbox"]').eq(4).attr('disabled', 'disabled');
	}

	// checkedThree();

	beforeEach(function() {
		jasmine.getFixtures().fixturesPath = 'javascripts/jasmine/fixtures/';
		loadFixtures('a.html');
		checkedThree();
	})


// checkedThree();
	

	it('test checkedThree function', function() {
		expect($('input[type="checkbox"]').eq(2)).toBeChecked();
		expect($('input[type="checkbox"]').eq(4)).toBeDisabled();
	})

	it('test loadFixtures function', function() {
		expect($('#box').length).toBe(1);
		expect($('input[type="text"]').val()).toBe("123");
	})
})