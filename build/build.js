require([
	"build/util"
], function(util){
	util.walk("refdocs").then(function(files){
		console.log(files);
	});
});