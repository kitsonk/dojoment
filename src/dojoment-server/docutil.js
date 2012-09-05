define([
	"dojo/node!highlight.js",
	"dojo/node!marked"
], function(hljs, marked){

	var glassify = function(code){
			code = code.replace(/^\n/, "");
			var block = /^ *:{2} *(\w+) *:{2} *\n([^\0]+?)(\n *:{2}|$)/,
				paragraph = /^([^\n]+\n?(?!$2 *:{2} *(\w+) *:{2} *\n([^\0]+?)(\n *:{2}|$)))+\n*/,
				text = /^[^\n]*/,
				output = [],
				parts = {},
				cap;
			while(code){
				if(cap = block.exec(code)){
					var part;
					code = code.substring(cap[0].length - cap[3].length + 1);
					switch(cap[1]){
						case "dojoConfig":
							parts.dojoConfig = cap[2];
							break;
						case "js":
						case "javascript":
							part = cap[2].replace(/^ *\n/, "");
							parts.js = part;
							output.push('<pre><code class="lang-javascript">' +
								hljs.highlight("javascript", part).value + "</code></pre>");
							break;
						case "html":
							part = cap[2].replace(/^ *\n/, "");
							parts.html = part;
							output.push('<pre><code class="lang-xml">' +
								hljs.highlight("xml", part).value + "</code></pre>");
							break;
						case "css":
							part = cap[2].replace(/^ *\n/, "");
							parts.css = part;
							output.push('<pre><code class="lang-css">' +
								hljs.highlight("css", part).value + "</code></pre>");
					}
					continue;
				}
				if(cap = paragraph.exec(code)){
					code = code.substring(cap[0].length);
					output.push("<p>" + marked.inline(cap[1]) + "</p>");
					continue;
				}
				if(cap = text.exec(code)){
					code = code.substring(cap[0].length);
					console.log("text");
					continue;
				}
			}
			return '<div class="glass"><textarea class="parts">' + JSON.stringify(parts) + "</textarea>\n" + output.join("\n") + '</div>';
		},

		highlight = function(code, lang){
			// Only including the languages we want to support
			switch(lang){
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
		highlight: highlight,
		codeglass: glassify
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
		highlight: highlight,
		glassify: glassify
	};
});