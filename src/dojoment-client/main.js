define([
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/query",
	"dojo/ready",
	"./CodeGlass"
], function(array, lang, dom, domConst, domGeom, style, query, ready, CodeGlass){
	var glasses = [];
	ready(function(){
		query(".lang-codeglass").forEach(function(node){
			var n = lang.clone(node);
			domConst.place(n, node.parentNode, "replace");
			glasses.push(new CodeGlass({}, n));
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