
// Initial module to load
var serverModule = "dojoment-server/main";

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
		name: "dojox",
		location: "dojox"
	},{
		name: "dojoment-server",
		location: "dojoment-server"
	}],

	deps: [serverModule]
};

// Bootstrap
require("./src/dojo/dojo.js");
