define([
	"dojo/_base/config", // config.baseUrl
	"dojo/_base/declare", // declare
	"dojo/_base/fx", // baseFx.anim
	"dojo/_base/lang", // lang.hitch
	"dojo/dom-class", // domClass.toggle domClass.contains
	"dojo/dom-construct", // domConst.place
	"dojo/dom-geometry", // domGeom.getContentBox
	"dojo/dom-style", // style.set
	"dojo/json", // JSON.parse
	"dojo/has", // has
	"dojo/on", // on
	"dojo/query", // query
	"dijit/_OnDijitClickMixin",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetBase",
	"dijit/Dialog",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dojo/text!./resources/CodeGlass.html",
	"dojo/text!./resources/CodeGlassCodeTemplate.html",
	"dojo/sniff"
], function(config, declare, baseFx, lang, domClass, domConst, domGeom, style, JSON, has, on, query, _OnDijitClickMixin,
		_TemplatedMixin, _WidgetBase, Dialog, ContentPane, TabContainer, template, codeTemplate){

	var scriptOpen = "<scr" + "ipt>",
		scriptClose = "</" + "scri" + "pt>",
		codeGlassRegEx = /\{\{\s?([^\}]+)\s?\}\}/g;

	return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin], {
		parts: null,
		dialog: null,
		iframe: null,
		tc: null,
		tabExample: null,
		tabCode: null,
		renderedCode: "",
		baseUrl: config.baseUrl,
		theme: "claro",
		showSource: true,
		templateString: template,

		buildRendering: function(){
			var nlTextArea = query("textarea.parts", this.srcNodeRef),
				nlPre = query("pre", this.srcNodeRef);
			if(nlTextArea.length){
				this.parts = JSON.parse(nlTextArea[0].innerHTML, true);
				domConst.destroy(nlTextArea[0]);
			}
			this.inherited(arguments);
		},

		_run: function(e){
			e && e.preventDefault();

			if(this.iframe) domConst.destroy(this.iframe);
			if(!this.renderedCode) this._renderCode();

			if(!this.dialog){
				this.dialog = new Dialog({
					title: "CodeGlass"
				}, this.dialogNode);
				this.tc = new TabContainer({
					tabPosition: "bottom",
					style: {
						width: "700px",
						height: "480px"
					}
				});
				this.tabExample = new ContentPane({
					title: "Example",
					content: "Preparing Example..."
				});
				this.tabCode = new ContentPane({
					title: "Code"
				});
				this.tc.addChild(this.tabExample);
				this.tc.addChild(this.tabCode);
				this.dialog.addChild(this.tc);
				this.tabExample.startup();
				this.tabCode.startup();
				this.tc.startup();
				this.dialog.startup();
			}

			this.tabCode.set("content", "Preparing Example...");
			this.dialog.show();

			setTimeout(lang.hitch(this, function(){

				var tabExampleContentBox = domGeom.getContentBox(this.tabExample.domNode),
					iframe = this.iframe = domConst.create("iframe", {
						src: "javascript: '" +
							this.renderedCode.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'",
						style: {
							height: (tabExampleContentBox.h - 6) + "px",
							width: (tabExampleContentBox.w - 1) + "px",
							border: "none",
							visibility: "hidden"
						}
					});

				this.tabExample.set("content", iframe);

				function display(){
					style.set(iframe, {
						"visibility": "visible",
						opacity: 0
					});
					baseFx.anim(iframe, { opacity: 1 });
				}

				on(iframe, "load", display);

			}), this.dialog.duration + 450);

		},

		_showCode: function(e){
			e && e.preventDefault();
		},

		_toggle: function(e){
			e && e.preventDefault();
			domClass.toggle(this.domNode, "closed");
		},

		_renderCode: function(){
			var p = document.createElement('a');
			p.href = this.domNode.ownerDocument.URL;
			console.log(p.host);
			var codeParts = {
				css:'\t<link rel="stylesheet" href="' + this.baseUrl + 'dijit/themes/' + this.theme + '/' +
					this.theme + '.css">\n\t<link rel="stylesheeet" href="' + this.baseUrl + 'dijit/themes/' +
					this.theme + '/document.css">\n\t',
				bodyargs: 'class="' + this.theme + '"',
				html: ""
			};

			if(has("ie")){
				codeParts.js = "<scr" + "ipt src='" + p.protocol + "//" + p.host +
					this.baseUrl + "dojo/dojo.js'" + ">" + scriptClose;
			}else{
				codeParts.js = "<scr" + "ipt src='" +
					this.baseUrl + "dojo/dojo.js'" + ">" + scriptClose;
			}

			var locals = {
				dataUrl: this.baseUrl,
				baseUrl: this.baseUrl,
				theme: this.theme
			};

			for(var key in this.parts){
				var part = lang.replace(this.parts[key], locals, codeGlassRegEx);
				switch(key){
					case "js":
						codeParts.js += scriptOpen + part + scriptClose;
						break;
					case "html":
						codeParts.html += part.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
						break;
					case "css":
						codeParts.css += '<style type="text/css">\n' + part + "\n</style>";
				}
			}

			this.renderedCode = lang.replace(codeTemplate, codeParts);
		}
	});
});