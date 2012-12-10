require.config({
	baseUrl: '.',
	shim : {
		'ga': {
			init: function() {
				var _gaq = window._gaq || [];
				_gaq.push(['_setAccount', 'UA-XXXXX-X'], ['_trackPageview']);
				window._gaq = _gaq;
				return _gaq;
			},
			exports: '_gaq'
		}
	},

	paths : {
		app: 'app',
		ga: 'https://ssl.google-analytics.com/ga',
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizer/modernizr'
	}
});