require([
	"dojo/_base/array",
	"dojo/query",
	"dojo/ready",
	"dojoment-client/CodeGlass"
], function(array, query, ready, CodeGlass){
	var glasses = [];
	ready(function(){
		query(".glass").forEach(function(node){
			glasses.push(new CodeGlass({}, node));
		});

		array.forEach(glasses, function(glass){
			glass.startup();
		});

		console.log("Found " + glasses.length + " examples");
	});
});