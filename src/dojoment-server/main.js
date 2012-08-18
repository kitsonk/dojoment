require([
	"dojo/node!util",
	"dojo/node!express",
	"dojo/node!jade",
	"dojo/node!marked",
	"dojo/Deferred"
], function(util, express, jade, marked, Deferred){
	var app = express.createServer(),
		appPort = process.env.PORT || 8002;

	app.configure(function(){
		app.set("view options", { layout: false, md: marked });
		app.set("view engine", "jade");
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'sUyC2IAOnzPpfjHRjSDpUUgQvmANfW9i3dOeNtqChnj6iMG5BzK1n3vjZkrW' }));
		app.use(app.router);

		app.use("/_static", express["static"].src("./_static"));
	});

	app.get("/:doc", function(request, response, next){

	});
});