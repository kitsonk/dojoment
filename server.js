
// Initial module to load
var loadModule = "dojoment-server/server";

// Configuration of Dojo
dojoConfig = {
	baseUrl: "src/",
	async: 1,
	deferredInstrumentation: 0,

	hasCache: {
		"host-node": 1,
		"dom": 0
	},

	packages: [{
		name: "dojo",
		location: "dojo"
	}, {
		name: "setten",
		location: "setten"
	}, {
		name: "dojoment-server",
		location: "dojoment-server"
	}, {
		name: "marked",
		location: "marked"
	}],

	deps: [loadModule]
};

// Bootstrap
require("./src/dojo/dojo.js");
