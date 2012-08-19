require([
	"dojo/node!util",
	"dojo/node!express",
	"dojo/node!jade",
	"dojo/node!marked",
	"dojo/node!highlight.js",
	"dojoment-server/dfs"
], function(util, express, jade, marked, hljs, dfs){
	var app = express(),
		appPort = process.env.PORT || 8002;

	// Configure marked
	marked.setOptions({
		gfm: true,
		pendantic: false,
		highlight: function(code, lang){
			if(lang == "js"){
				code = hljs.highlight("javascript", code).value;
			}
			console.log(code, lang);
			return code;
		}
	});

	// Configure the application
	app.configure(function(){
		app.locals.pretty = true;
		app.locals.markdown = marked;
		app.set("view engine", "jade");
		app.set("views", "layouts");
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'sUyC2IAOnzPpfjHRjSDpUUgQvmANfW9i3dOeNtqChnj6iMG5BzK1n3vjZkrW' }));
		app.use(app.router);

		app.use("/_static", express["static"]("./_static"));

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

	app.get("/*", function(request, response, next){
		if(request.params[0] == "404" || /^_static/.test(request.params[0])){
			next();
		}else{
			var doc = "refdocs/" + request.params[0] + ".mdown";
			dfs.exists(doc).then(function(exists){
				if(exists){
					dfs.readFile(doc, "utf8").then(function(data){
						response.render("wiki", {
							md: marked(data)
						});
					}, function(err){
						next(err);
					});
				}else{
					next();
				}
			}, function(err){
				next(err);
			});
		}
	});

	app.listen(appPort);

	util.puts("HTTP server started on port: " + appPort);
});