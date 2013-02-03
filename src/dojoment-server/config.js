define([
	"dojo/text!config.json"
], function(configJSON){
	return JSON.parse(configJSON)[process.env.NODE_ENV || "development"];
});