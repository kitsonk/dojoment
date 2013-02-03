var profile = (function(){
	var testResourceRe = /^dojoment-client\/tests\//,
		miniResourceRe = /\.styl$/,
		copyOnly = function(filename, mid){
			var list = {
				"dojoment-client/profile":1,
				"dojoment-client/package.json":1
			};
			return (mid in list) || (/^dojoment-client\/resources\//.test(mid) && !/\.(css|styl)$/.test(filename)) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
			},

			mini: function(filename, mid){
				return miniResourceRe.test(filename);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			}
		}
	};
})();