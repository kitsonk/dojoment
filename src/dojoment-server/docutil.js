define([
	"dojo/node!highlight.js",
	"dojo/node!marked"
], function(hljs, marked){

	var glassify = function(code){

			function stripIndent(str){
				str = str.replace(/(^\n+|\n+$)/, "");
				var pad = str.match(/^ */)[0].length;
				return str.replace(new RegExp("^ {" + pad + "}", "gm"), "");
			}

				// Match any empty newlines
				// RegEx:
				//		^ - Start of Line
				//		\n+ - One or more newlines
			var space = /^\n+/,

				// Match code blocks, for example:
				//
				//		::js::
				//			console.log();
				//
				// RegEx:
				//		^ - Start of line
				//		:{2} - Two ::
				//		 * - Any spaces
				//		(\w+) - Capture
				//			\w+ - At least one non-whitespace
				//		 * - Any spaces
				//		\n+ - At least one newline
				//		((?: {2,}[^\n]+(?:\n|$)+)*) - Capture
				//			(?: {2,}[^\n]+(?:\n|$)+)* - Repeatable non capturing group
				//				 {2,} - Two or more spaces
				//				[^\n]+ - At least one character not a newline
				//				(?:\n|$)+ - Non-capturing group of at least one
				//					\n|$ - New-line or end of line
				codeblock = /^:{2} *(\w+) *:{2} *\n+((?: {2,}[^\n]+(?:\n|$)+)*)/,

				// Match multi-line indented paragraphs.
				//
				// RegEx:
				//		^ - Start of line
				//		 {2,} - Two or more spaces
				//		[^\n]+ - One or more charecters not a new line
				//		\n - New Line
				//		(?: {2,}[^\n]+(?:\n|$))* - Repeatable non-capturing group
				//			 {2,} - Two or more spaces
				//			[^\n]+ - One or more charecters not a new line
				//			(?:\n|$) - Non capturing group
				//				\n|$ - New-line or end of line
				paragraph = /^ {2,}[^\n]+\n(?: {2,}[^\n]+(?:\n|$))*/,

				// Catch all for any lines of text.
				//
				//	RegEx:
				//		^ - Start of line
				//		[^\n]+ - One or more charecters not a new-line
				text = /^[^\n]+/,
				output = [],
				parts = {},
				cap;

			while(code){
				if(cap = space.exec(code)){
					code = code.substring(cap[0].length);
					continue;
				}
				if(cap = codeblock.exec(code)){
					var part;
					code = code.substring(cap[0].length);
					switch(cap[1]){
						case "dojoConfig":
							parts.dojoConfig = stripIndent(cap[2]);
							break;
						case "js":
						case "javascript":
							part = stripIndent(cap[2]);
							parts.js = part;
							output.push('<pre><code class="lang-javascript">' +
								hljs.highlight("javascript", part).value + "</code></pre>");
							break;
						case "html":
							part = stripIndent(cap[2]);
							parts.html = part;
							output.push('<pre><code class="lang-xml">' +
								hljs.highlight("xml", part).value + "</code></pre>");
							break;
						case "css":
							part = stripIndent(cap[2]);
							parts.css = part;
							output.push('<pre><code class="lang-css">' +
								hljs.highlight("css", part).value + "</code></pre>");
					}
					continue;
				}
				if(cap = paragraph.exec(code)){
					code = code.substring(cap[0].length);
					output.push("<p>" + marked.inline(stripIndent(cap[0])) + "</p>\n");
					continue;
				}
				if(cap = text.exec(code)){
					code = code.substring(cap[0].length);
					output.push(marked.inline(stripIndent(cap[0])));
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