require([
	"dojo/node!util",
	"dojo/node!express",
	"dojo/node!jade",
	"dojoment-server/config",
	"dojoment-server/dfs",
	"dojoment-server/docutil"
], function(util, express, jade, config, dfs, docutil){
	var app = express(),
		appPort = process.env.PORT || 8002;

	// Configure the application
	app.configure(function(){
		app.locals.pretty = true;
		app.set("view engine", "jade");
		app.set("views", "layouts");
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'sUyC2IAOnzPpfjHRjSDpUUgQvmANfW9i3dOeNtqChnj6iMG5BzK1n3vjZkrW' }));
		app.use(app.router);

		app.use("/_static", express["static"]("./_static"));
		app.use("/src", express["static"]("./src"));

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
				response.render("500", { error: error });
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
			var docFileName = "refdocs/" + request.params[0] + (request.params[0] === "" ? "index.mdown" : /\/$/.test(request.params[0]) ? "index.mdown" : /.mdown$/i.test(request.params[0]) ? "" : ".mdown");
			dfs.exists(docFileName).then(function(exists){
				if(exists){
					return dfs.readFile(docFileName, "utf8").then(function(data){
						var parsedDoc = docutil.parse(data);
						response.render("wiki", {
							title: parsedDoc.title,
							toc: parsedDoc.toc,
							doc: parsedDoc.doc,
							cdn: config.repoInfo.cdn,
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

	util.puts("HTTP server started on port: " + appPort);
});