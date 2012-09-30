
var bootModule = "build/build";

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
	},{
		name: "dijit",
		location: "dijit"
	},{
		name: "build",
		location: "../build"
	}],

	deps: [bootModule]
};

// Bootstrap
require("../src/dojo/dojo.js");
