var profile = (function(){
	var testResourceRe = /^setten\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"setten/setten.profile":1,
				"setten/package.json":1,
				"setten/tests":1,
			};
			return (mid in list) ||
				(/^setten\/resources\//.test(mid) && !/\.css$/.test(filename)) ||
				/(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid);
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