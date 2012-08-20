define([
	"dojo/node!highlight.js",
	"dojo/node!marked"
], function(hljs, marked){

	var heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
		highlight = function(code, lang){
			// Only including the languages we want to support
			switch(lang){
				case "glass":
					break;
				case "js":
					code = hljs.highlight("javascript", code).value;
					break;
				case "html":
					code = hljs.highlight("xml", code).value;
					break;
				case "bash":
				case "css":
				case "diff":
				case "dos":
				case "http":
				case "java":
				case "javascript":
				case "json":
				case "perl":
				case "python":
				case "php":
				case "markdown":
				case "xml":
					code = hljs.highlight(lang, code).value;
					break;
			}
			return code;
		};

	// Configure marked
	marked.setOptions({
		gfm: true,
		pendantic: false,
		highlight: highlight
	});

	return {
		parse: function(data){
			var h1 = heading.exec(data),
				title = h1 ? h1[2] : "Reference Guide";

			return {
				title: title,
				doc: marked(data),
				toc: ""
			};
		},

		highlight: highlight
	};
});