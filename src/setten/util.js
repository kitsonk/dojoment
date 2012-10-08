define([
	"dojo/Deferred"
], function(Deferred){

	var asDeferred = function(f, noError){
		return noError ? function(){
			var d = new Deferred(),
				args = Array.prototype.slice.call(arguments);
			args.push(function(data){
				d.resolve(data);
			});
			f.apply(this, args);
			return d.promise;
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
			return d.promise;
		};
	};

	return {
		asDeferred: asDeferred
	};
});