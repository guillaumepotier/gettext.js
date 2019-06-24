(function() {
	var i18n, docIsLoaded;

	document.addEventListener('DOMContentLoaded', function() {
		document.body.innerHTML = 'Test failed!';
		if(i18n) runTest();
		else docIsLoaded = true;
	});

	function runTest() {
		i18n.setMessages('messages', 'en', {
			'Test failed!': 'Test successfull!',
		}, 'nplurals=2; plural=n>1;');
		i18n.setLocale('en');
		document.body.innerHTML = i18n.gettext('Test failed!');
	}

	window.testGettext = function(gettext) {
		i18n = gettext();
		if(docIsLoaded) runTest();
	}
})();
