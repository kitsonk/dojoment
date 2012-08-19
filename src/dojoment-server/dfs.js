define([
	"dojo/node!fs",
	"dojo/Deferred"
], function(fs, Deferred){

	// Convert a standard node "callback" function into a Deferred
	function asDeferred(f, noError){
		return noError ? function(){
			var d = new Deferred(),
				args = Array.prototype.slice.call(arguments);
			args.push(function(data){
				d.resolve(data);
			});
			f.apply(this, args);
			return d;
		} : function(){
			var d = new Deferred(),
				args = Array.prototype.slice.call(arguments);
			args.push(function(err, data){
				if(err){
					d.reject(err);
				}else{
					d.resolve(data);
				}
			});
			f.apply(this, args);
			return d;
		};
	}

	var dfs = {},
		singleArgFunctions = ["exists"];

	// Iterate through each property of the module
	for(var f in fs){ 
		if(typeof fs[f] == "function" && !/(^_|Sync$)/.test(f)){ // It is something we want to convert
			dfs[f] = asDeferred(fs[f], ~singleArgFunctions.indexOf(f)); // Create a deferred
		}
	}

	return dfs;
});