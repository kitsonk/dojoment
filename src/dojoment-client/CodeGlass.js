define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/config", // config.baseUrl
	"dojo/_base/declare", // declare
	"dojo/_base/fx", // baseFx.anim
	"dojo/_base/lang", // lang.hitch
	"dojo/aspect", // aspect.after
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
	"dijit/Toolbar",
	"dijit/form/Button",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dojo/text!./resources/CodeGlass.html",
	"dojo/text!./resources/CodeGlassCodeTemplate.html",
	"dojo/text!./resources/CodeGlassExportTemplate.html",
	"dojo/i18n!dijit/nls/loading",
	"dojo/sniff"
], function(array, config, declare, baseFx, lang, aspect, domClass, domConst, domGeom, style, JSON, has, on, query,
		_OnDijitClickMixin, _TemplatedMixin, _WidgetBase, Dialog, Toolbar, Button, BorderContainer, ContentPane,
		TabContainer, template, codeTemplate, exportTemplate, i18nLoading){

	var scriptOpen = "<scr" + "ipt>",
		scriptClose = "</" + "scri" + "pt>",
		codeGlassRegEx = /\{\{\s?([^\}]+)\s?\}\}/g;

	return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin], {

		// parts: Object
		//		Contains the un-encoded parts of the code.
		parts: null,

		// dialog: dijit/Dialog
		//		The dialog that displays the example.
		dialog: null,

		// iframe: IFrame
		//		The DOM Node where the example executes.
		iframe: null,

		// tc: dijit/layout/TabContainer
		//		The tab container that sits within the dialog.
		tc: null,

		// tabExample: dijit/layout/ContentPane
		//		Contains the content where the example is displayed.
		tabExample: null,

		// tabCode: dijit/layout/ContentPane
		tabCode: null,

		// paneCode: dijit/layout/ContentPane
		paneCode: null,

		// toolbarCode: dijit/Toolbar
		toolbarCode: null,

		// renderedCode: String
		renderedCode: "",

		// displayedCode: String
		displayedCode: "",

		// baseUrl: String
		baseUrl: config.baseUrl,

		// baseClass: String
		baseClass: "CodeGlass",

		// cdn: String
		cdn: config.cdn,

		// theme: String
		theme: "claro",

		// showSource: Boolean
		showSource: true,

		// width: Integer
		width: 700,

		// height: Integer
		height: 480,

		// title: String
		title: "Code Glass",

		// exportUrl: String
		//		This is the URL that should be used for posting code to.
		exportUrl: "http://jsfiddle.net/api/post/dojo/",

		// exportDojoVersion: String
		//		This is the version of Dojo that should be used when exporting.
		exportDojoVersion: "1.8",

		// _exampleFired: Boolean
		_exampleFired: false,

		// templateString: String
		templateString: template,

		// labels: Object
		labels: {
			run: "<i class='icon-play'></i> Run",
			runTitle: "Run Code Example",
			code: "<i class='icon-file'></i> Code",
			codeTitle: "Display Source Code",
			collapse: "<i class='icon-chevron-up'></i> Collapse",
			collapseTitle: "Collapse Code Example",
			expand: "<i class='icon-chevron-down'></i> Expand",
			expandTitle: "Expand Code Example",
			example: "<i class='icon-play'></i> Example",
			copy: "<i class='icon-copy'></i> Select All",
			copyTitle: "Select all the Code",
			"export": "<i class='icon-share'></i> Export",
			exportTitle: "Export to JSFiddle"
		},

		buildRendering: function(){
			var nlTextArea = query("textarea.parts", this.srcNodeRef),
				nlPre = query("pre", this.srcNodeRef);
			if(nlTextArea.length){
				this.parts = JSON.parse(nlTextArea[0].innerHTML, true);
				domConst.destroy(nlTextArea[0]);
			}
			this.inherited(arguments);
		},

		_dialogHide: function(){
			this._exampleFired = false;
		},

		_exampleShow: function(){
			if(!this._exampleFired){
				this._exampleFired = true;

				if(this.iframe) domConst.destroy(this.iframe);
				this.tabExample.set("content", '<div class="CodeGlassLoading">' + i18nLoading.loadingState + '</div>');

				setTimeout(lang.hitch(this, function(){

					var tabExampleContentBox = domGeom.getContentBox(this.tabExample.domNode),
						iframe = this.iframe = domConst.create("iframe", {
							src: "javascript: '" +
								this.renderedCode.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'",
							style: {
								height: (tabExampleContentBox.h - 6) + "px",
								width: tabExampleContentBox.w + "px",
								border: "none",
								visibility: "hidden"
							}
						});

					this.tabExample.set("content", iframe);

					on(iframe, "load", function(){
						style.set(iframe, {
							"visibility": "visible",
							opacity: 0
						});
						baseFx.anim(iframe, { opacity: 1});
					});

				}), this.dialog.duration + 450);
			}
		},

		_exportCode: function(e){
			e && e.preventDefault();
			var exportParts = {
				action: this.exportUrl + this.exportDojoVersion + "/",
				title: "just testing",
				description: "",
				resources: lang.replace("{cdn}dijit/themes/{theme}/{theme}.css,{cdn}dijit/themes/{theme}/document.css",{
					theme: this.theme,
					cdn: this.cdn
				}),
				theme: this.theme,
				dojoConfig: "",
				js: this.parts.js.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") || "",
				html: this.parts.html || "",
				css: this.parts.css || ""
			};
			var exportCode = lang.replace(exportTemplate, exportParts);
			var exportNode = domConst.toDom(exportCode);
			exportNode.submit();
			domConst.destroy(exportNode);
		},

		_selectCode: function(e){
			e && e.preventDefault();
			if(this.textareaCode){
				this.textareaCode.focus();
				this.textareaCode.select();
			}
		},

		_codeShow: function(){
			if(!this.displayedCode) this._renderCode();
			if(!this.textareaCode){
				var textarea = this.textareaCode = domConst.create("textarea", {
					innerHTML: this.displayedCode
				});
				this.paneCode.set("content", textarea);
				on(textarea, "dblclick", lang.hitch(this, this._selectCode));
			}
		},

		_buildDialog: function(){
			var bcCode = new BorderContainer({
					gutters: false
				}),
				toolbarCode = new Toolbar({
					region: "top"
				}),
				buttonCopy = new Button({
					label: this.labels.copy,
					title: this.labels.copyTitle
				});

			this.dialog = new Dialog({
				title: this.title
			}, this.dialogNode);
			this.tc = new TabContainer({
				tabPosition: "bottom",
				style: {
					width: this.width + "px",
					height: this.height + "px"
				}
			});
			this.tabExample = new ContentPane({
				title: this.labels.example,
				content: '<div class="CodeGlassLoading">' + i18nLoading.loadingState + '</div>'
			});
			this.tabCode = new ContentPane({
				title: this.labels.code
			});
			this.paneCode = new ContentPane({
				region: "center",
				content: '<div class="CodeGlassLoading">' + i18nLoading.loadingState + '</div>'
			});

			buttonCopy.on("click", lang.hitch(this, this._selectCode));

			toolbarCode.addChild(buttonCopy);
			bcCode.addChild(toolbarCode);
			bcCode.addChild(this.paneCode);
			this.tabCode.addChild(bcCode);
			this.tabExample.on("show", lang.hitch(this, this._exampleShow));
			this.tabCode.on("show", lang.hitch(this, this._codeShow));
			this.tc.addChild(this.tabExample);
			this.tc.addChild(this.tabCode);
			this.dialog.addChild(this.tc);
			this.dialog.on("hide", lang.hitch(this, this._dialogHide));

			// The dialog should cascade the startup creation
			this.dialog.startup();
		},

		_run: function(e){
			e && e.preventDefault();

			if(!this.renderedCode) this._renderCode();

			if(!this.dialog) this._buildDialog();

			this.tc.selectChild(this.tabExample);
			this.dialog.show();

		},

		_showCode: function(e){
			e && e.preventDefault();

			if(!this.dialog) this._buildDialog();

			this.tc.selectChild(this.tabCode);
			this.dialog.show();
		},

		_toggle: function(e){
			e && e.preventDefault();
			domClass.toggle(this.domNode, "closed");
			domConst.place(domClass.contains(this.domNode, "closed") ? this.labels.expand : this.labels.collapse,
				this.collapseLabel,
				"only");
		},

		_renderCode: function(){
			var codeParts = {
					css: '\t<link rel="stylesheet" href="' + this.baseUrl + 'dijit/themes/' + this.theme + '/' +
						this.theme + '.css">\n\t<link rel="stylesheet" href="' + this.baseUrl + 'dijit/themes/' +
						this.theme + '/document.css">\n\t<link rel="stylesheet" href="' + this.baseUrl +
						'dojoment-client/resources/CodeGlassCode.css">\n\t',
					js: "<scr" + "ipt src='" + (has("ie") ? this.cdn : this.baseUrl) +	// has("ie") works around IE
						"dojo/dojo.js'>" + scriptClose + "\n\t",							// issue with local resources
					bodyargs: 'class="' + this.theme + '"',
					html: "",
					dojoConfig: ""
				},

				locals = {
					dataUrl: this.baseUrl,
					baseUrl: this.baseUrl,
					theme: this.theme
				};

			for(var key in this.parts){
				var part = lang.replace(this.parts[key], locals, codeGlassRegEx);
				switch(key){
					case "dojoConfig":
						// codeParts.dojoConfig = scriptOpen + part + scriptClose;
						break;
					case "js":
						codeParts.js += scriptOpen + "\n" +
							part.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") + scriptClose;
						break;
					case "html":
						codeParts.html += part.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
						break;
					case "css":
						codeParts.css += '<style type="text/css">\n' + part + "\n</style>";
				}
			}

			this.renderedCode = lang.replace(codeTemplate, codeParts);
			this.displayedCode = this.renderedCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\t/g, "    ");
			if(has("ie")){
				this.displayedCode = this.displayedCode.replace(/\n/g, "<br/>");
			}
		}
	});
});