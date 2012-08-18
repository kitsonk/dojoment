require([
	"dojo/node!util",
	"dojo/node!express",
	"dojo/node!jade",
	"dojo/node!marked",
	"dojoment-server/dfs"
], function(util, express, jade, marked, dfs){
	var app = express(),
		appPort = process.env.PORT || 8002;

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

	app.get("/:doc", function(request, response, next){
		if(request.params.doc == "404"){
			next();
		}else{
			dfs.readFile("refdocs/index.mdown", "utf8").then(function(data){
				response.render("wiki", {
					md: marked(data)
				});
			}, function(err){
				next(err);
			});
		}
	});

	app.listen(appPort);

	util.puts("HTTP server started on port: " + appPort);
});