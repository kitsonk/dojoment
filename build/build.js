require([
	"build/util",
	"dojo/Deferred",
	"dojo/promise/all",
	"setten/dfs-extra",
	"setten/util",
	"dojoment-server/config",
	"dojoment-server/docutil",
	"dojo/node!path",
	"dojo/node!jade",
	"dojo/node!stylus",
	"dojo/node!nib",
	"dojo/node!highlight.js",
	"dojo/node!colors"
], function(util, Deferred, all, dfs, settenUtil, config, docutil, path, jade, stylus, nib, highlight, colors){
	
	var stylusFiles = [
		'_static/css/guide.styl'
	];

	var filesToCopy = [
		'_static/Font-Awesome',
		'_static/css/site.css',
		'_static/css/print.css',
		'_static/css/highlight.css',
		'_static/images'
	];

	var p = [],
		template;

	function compileTemplate(filename, data) {
		return jade.compile(data, {
			filename: filename,
			pretty: true
		});
	}

	function render(data, filename) {
		var dfd = new Deferred();

		stylus(data).use(nib()).set('filename', filename).render(function (err, css) {
			if (err) {
				dfd.reject(err);
			} else {
				dfd.resolve(css);
			}
		});

		return dfd.promise;
	}

	function outputFile(filename, data) {
		var dfd = new Deferred();

		var umask = process.umask();

		function createDir(dir, pos){
			var p = path.normalize(dir).split(path.sep);
			pos = pos || 0;
			var d = p.slice(0, pos + 1).join(path.sep) || path.sep;
			return dfs.stat(d).then(function(){
				if(pos <= p.length){
					return createDir(dir, pos + 1);
				}
			}, function(err){
				if(err && err.errno != 17){
					try {
						dfs.mkdirSync(d);
					} finally {
						return createDir(dir, pos + 1);
					}
				}else{
					dfd.reject(err);
				}
			});
		}

		filedir = path.dirname(filename);

		createDir(filedir).then(function(){
			dfs.writeFile(filename, data, 'utf8').then(function (){
				dfd.resolve(filename);
			}, function (err) {
				dfd.reject(err);
			});
		});

		return dfd.promise;
	}

	function renderFiles() {
		var data, parsedDoc, doc, outfile,
			p = [];
		return util.walk("refdocs", /\.md(own)?$/).then(function(files){
			files.forEach(function(file){
				data = dfs.readFileSync(file, "utf8");
				parsedDoc = docutil.parse(data);
				outfile = file.replace(/^refdocs\//, 'build/html/').replace(/\.md(own)?$/, '.html');
				doc = template({
					root: path.relative(outfile, 'build/html/').replace(/^\.\.\/?/, '') || '.',
					title: parsedDoc.title + ' - Dojo Toolkit Reference Guide',
					toc: parsedDoc.toc,
					doc: parsedDoc.doc,
					cdn: config.repoInfo.cdn,
					copyright: config.repoInfo.copyright
				});
				p.push(outputFile(outfile, doc).then(function (fn) {
					console.log('  ' + fn.blue);
				}));
			});
			return all(p);
		}).otherwise(function(err){
			console.error(err);
		});
	}

	function renderCss(files) {
		return all(files.map(function (file) {
			var outFile = 'build/html/_static/css/' + path.basename(file, '.styl') + '.css';
			return dfs.readFile(file, 'utf8').then(function (data) {
				return render(data, outFile).then(function (css) {
					return outputFile(outFile, css).then(function (name) {
						console.log('  ' + name.blue);
					});
				});
			});
		}));
	}

	function copyFiles(files) {
		return all(files.map(function (file) {
			var dest = 'build/html/' + file;
			return dfs.copy(file, dest).then(function () {
				console.log('  ' + dest.blue);
			});
		}));
	}

	console.log("\ndojoment Documentation Builder\n------------------------------\n".grey);
	dfs.readFile("views/guide.jade", "utf8").then(function(data){
		console.log("Compile template...".yellow);
		template = compileTemplate("views/build.jade", data);
		console.log("Render files...".yellow);
		return renderFiles("refdocs").then(function () {
			console.log('Document Rendering Complete!'.yellow);
		});
	}).then(function () {
		console.log("Render CSS...".yellow);
		return renderCss(stylusFiles).then(function () {
			console.log('CSS Rendering Complete!'.yellow);
		});
	}).then(function () {
		console.log("Copy files/folders...".yellow);
		return copyFiles(filesToCopy).then(function () {
			console.log('Copying complete.'.yellow);
		});
	}).otherwise(function(err){
		console.error(err.toString().red);
	});

});