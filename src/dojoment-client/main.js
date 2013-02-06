define([
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/query",
	"dojo/ready",
	"./CodeGlass"
], function(array, lang, win, dom, domConst, domGeom, style, on, query, ready, CodeGlass){
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

		// wiki fixed TOC
		var toc	= dom.byId("toc");
		if (toc) {
			pos = domGeom.position(toc, true);
			style.set(toc, {
				position: "fixed",
				top: pos.y + "px",
				left: pos.x + "px",
				width: pos.w + "px"
			});
		}

		// built guide version select
		var refver = dom.byId("refver");
		if (refver) {
			// Set change event on version to navigate to other version of the docs
			on(refver, "change", function(e){
				var v = e.target.value;
				win.global.location.href = win.global.location.href.replace(/\/[12]\.[0-9]\//i, "/" + v + "/");
			});
		
			// Ensure the drop down version list has the right value
			var vmatch = /\/([12]\.[0-9])\//i.exec(win.global.location.href);
			if (vmatch){
				refver.value = vmatch[1];
			}
		}
	});
});