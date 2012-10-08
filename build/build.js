require([
	"build/util",
	"dojo/promise/all",
	"setten/dfs",
	"dojoment-server/config",
	"dojoment-server/docutil",
	"dojo/node!path",
	"dojo/node!jade",
	"dojo/node!highlight.js"
], function(util, all, dfs, config, docutil, path, jade, highlight){
	var p = [],
		template;

	var compileTemplate = function(data, filename){
		template = jade.compile(data, {
			filename: filename
		});
	};

	var outputFile = function(data, filename){

		var umask = process.umask();

		function createDir(dir, pos){
			var p = dir.normalize(dir).split(path.sep),
				pos = pos || 0,
				d = p.slice(0, pos + 1).join(path.sep) || path.sep;
			dfs.stat(d).then(function(){
				createDir(dir, pos + 1);
			}, function(err){
				if(err && err.errno != 17){
					throw err;
				}else{
					
				}
			})
		};

		filedir = path.dirname(filename);

	};

	var renderFiles = function(path){
		util.walk("refdocs", /\.mdown$/).then(function(files){
			files.forEach(function(file){
				p.push(dfs.readFile(file, "utf8").then(function(data){
					var parsedDoc = docutil.parse(data),
						doc = template({
							title: parsedDoc.title,
							crumbs: docutil.crumbs(file.replace(/^refdocs\//, "")
								.replace(/(\/(index(\.mdown)?)?|\.mdown)$/, "")),
							toc: parsedDoc.toc,
							doc: parsedDoc.doc,
							cdn: config.repoInfo.cdn,
							leader: config.repoInfo.title,
							copyright: config.repoInfo.copyright
						}),
						outfile = "build/html/";
					return dfs.writeFile();
				}));
			});
			all(p).then(function(results){
				console.log("done", results[0]);
			});
		}).otherwise(function(err){
			console.error(err);
		});
	};

	dfs.readFile("layouts/wiki.jade", "utf8").then(function(data){
		compileTemplate(data, "layouts/wiki.jade");
		renderFiles("refdocs");
	}).otherwise(function(err){
		console.error(err);
	});

});