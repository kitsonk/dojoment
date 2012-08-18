define([
	"dojo/node!fs",
	"dojo/Deferred"
], function(fs, Deferred){

	function asDeferred(f, a){
		var d = new Deferred(),
			args = Array.prototype.slice.call(a);
		args.push(function(err, data){
			if(err){
				d.reject(err);
			}else{
				d.resolve(data);
			}
		});
		f.apply(this, args);
		return d;
	}

	return {
		readFile: function(){
			return asDeferred(fs.readFile, arguments);
		}
	};
});