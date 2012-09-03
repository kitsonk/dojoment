define([
	"dojo/node!highlight.js",
	"dojo/node!marked"
], function(hljs, marked){

	var highlight = function(code, lang){
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
		},

		getToc = function(tokens){
			var toc = "",
				currentDepth = 0;
			tokens.forEach(function(token){
				if(token.type == "heading"){
					if(token.depth > currentDepth){
						toc += "<ul>";
					}else if(token.depth < currentDepth){
						toc += "</li>\n</ul>\n";
					}else{
						toc += "</li>\n";
					}
					currentDepth = token.depth;
					toc += "<li>" + (token.anchor ? '<a href="#' + token.anchor + '">' : "") + token.text + (token.anchor ? "</a>" : "");
				}
			});
			if(currentDepth !== 0){
				toc += "</li>\n</ul>\n";
			}
			return toc;
		},

		getTitle = function(tokens){
			var h1;
			tokens.some(function(token){
				if(token.type == "heading"){
					h1 = token.text;
					return true;
				}else{
					return false;
				}
			});
			return h1 || "Reference Guide";
		};

	// Configure marked
	marked.setOptions({
		gfm: true,
		pendantic: false,
		anchors: true,
		highlight: highlight
	});

	return {
		parse: function(data){
			var tokens = marked.lexer(data);

			return {
				title: getTitle(tokens),
				toc: getToc(tokens),
				doc: marked.parser(tokens)
			};
		},

		toc: getToc,
		title: getTitle,
		highlight: highlight
	};
});