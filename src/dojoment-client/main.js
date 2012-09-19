require([
	"dojo/_base/array",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/query",
	"dojo/ready",
	"dojoment-client/CodeGlass"
], function(array, dom, domGeom, style, query, ready, CodeGlass){
	var glasses = [];
	ready(function(){
		query(".glass").forEach(function(node){
			glasses.push(new CodeGlass({}, node));
		});

		array.forEach(glasses, function(glass){
			glass.startup();
		});

		console.log("Found " + glasses.length + " examples");

		var toc	= dom.byId("toc");
		pos = domGeom.position(toc, true);
		style.set(toc, {
			position: "fixed",
			top: pos.y + "px",
			left: pos.x + "px",
			width: pos.w + "px"
		});
	});
});