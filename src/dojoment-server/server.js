define([
	"dojo/node!express",
	"dojo/node!jade",
	"dojo/node!stylus",
	"dojo/node!nib",
	"dojo/node!colors",
	"setten/dfs",
	"dojoment-server/config",
	"dojoment-server/docutil"
], function(express, jade, stylus, nib, colors, dfs, config, docutil){

	function compile(str, path){
		return stylus(str).set("filename", path).use(nib());
	}

	/* Express Application */
	var app = express(),
		appPort = process.env.PORT || config.port || 8002,
		env = process.env.NODE_ENV || "development";

	// Configure the application
	app.configure(function(){
		app.locals.pretty = true;
		app.set("view engine", "jade");
		app.set("views", "views");
		app.use(express.logger(env && env === "production" ? null : "dev"));
		app.use(express.compress());
		app.use(express.favicon("_static/favicon.ico"));
		app.use(express.cookieParser());
		app.use(express.cookieSession({ secret: 'sUyC2IAOnzPpfjHRjSDpUUgQvmANfW9i3dOeNtqChnj6iMG5BzK1n3vjZkrW' }));
		app.use(express.bodyParser());
		app.use(app.router);

		app.use(stylus.middleware({
			src: ".",
			compile: compile,
			compress: true
		}));

		app.use("/_static", express["static"]("./_static"));
		app.use("/src", express["static"]("src"));
		app.use("/lib", express["static"]("lib"));

		app.use("/500", function(request, response, next){
			next(new Error("All your base are belong to us!"));
		});

		app.use(function(request, response, next){
			response.status(404);
			if(request.accepts("html")){
				response.render("404", { url: request.url });
				return;
			}else if(request.accepts("json")){
				response.send({ error: "Not Found", url: request.url });
				return;
			}

			response.type("text").send("Not Found");
		});

		app.use(function(error, request, response, next){
			response.status(error.status || 500);
			if(request.accepts("html")){
				response.render("500", {
					error: error,
					bugs: config.repoInfo.bugs
				});
			}else if(request.accepts("json")){
				response.send({ error: error });
			}else{
				response.type("text").send(error);
			}
		});
	});

	// Main document handler
	app.get("/*", function(request, response, next){
		if(request.params[0] == "404" || /^_static/.test(request.params[0]) || /^src/.test(request.params[0])){
			next();
		}else{
			var docFileName = "refdocs/" + request.params[0] + (request.params[0] === "" ?
				"index.md" : /\/$/.test(request.params[0]) ? "index.md" : /\.md$/i.test(request.params[0]) ?
				"" : ".md");
			dfs.exists(docFileName).then(function(exists){
				if(exists){
					return dfs.readFile(docFileName, "utf8").then(function(data){
						var parsedDoc = docutil.parse(data);
						response.render("wiki", {
							title: parsedDoc.title,
							crumbs: docutil.crumbs(request.params[0].replace(/\/(index(\.md)?)?$/, "")),
							toc: parsedDoc.toc,
							doc: parsedDoc.doc,
							cdn: config.repoInfo.cdn,
							leader: config.repoInfo.title,
							copyright: config.repoInfo.copyright
						});
					});
				}else{
					next();
				}
			}).otherwise(next);
		}
	});

	// Start Listening
	app.listen(appPort);
	console.log("HTTP server started on port: ".grey + appPort.toString().cyan);
});