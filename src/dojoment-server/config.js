define([
	"dojo/text!config.json",
	"dojo/json"
], function(configJSON, JSON){
	return JSON.parse(configJSON);
});