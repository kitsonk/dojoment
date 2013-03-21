var profile = (function(){

	var generalModules = [];

	return {
		releaseDir: '../lib',
		basePath: 'src',
		action: 'release',
		mini: true,
		selectorEngine: 'lite',
		layerOptimize: 'closure',
		cssOptimize: 'comments',

		packages: [{
			name: 'dojo',
			location: 'dojo'
		}, {
			name: 'dijit',
			location: 'dijit'
		}, {
			name: 'dojoment-client',
			location: 'dojoment-client'
		}],

		defaultConfig: {
			hasCache: {
				'dojo-built': 1,
				'dojo-loader': 1,
				'dom': 1,
				'host-browser': 1,
				'config-selectorEngine': 'lite'
			},
			locale: 'en-us',
			async: 1
		},

		staticHasFatures: {
			'dojo-firebug': 0
		},

		layers: {
			'dojo/dojo': {
				include: [ 'dojo/dojo' ],
				customBase: true,
				boot: true
			},
			'dojoment-client': {
				exclude: [ 'dojo/dojo' ]
			}
		}
	};
})();