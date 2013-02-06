
var bootModule = "build/build";

// Configuration of Dojo
dojoConfig = {
	baseUrl: "src/",
	async: 1,
	deferredInstrumentation: 1,

	hasCache: {
		"host-node": 1,
		"dom": 0
	},

	packages: [{
		name: "dojo",
		location: "dojo"
	},{
		name: "setten",
		location: "setten"
	},{
		name: "dojoment-server",
		location: "dojoment-server"
	},{
		name: "marked",
		location: "marked"
	},{
		name: "build",
		location: "../build"
	}],

	deps: [bootModule]
};

// Bootstrap
require("../src/dojo/dojo.js");
