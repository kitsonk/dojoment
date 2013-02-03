define([
	"dojo/Deferred"
], function(Deferred){

	var asDeferred = function(/*Function*/ f, /*Object*/ self, /*Boolean*/ noError){
		self = self || this;
		return noError ? function(){
			var d = new Deferred(),
				args = Array.prototype.slice.call(arguments);
			args.push(function(){
				var args = Array.prototype.slice.call(arguments);
				d.resolve(args.length > 1 ? args : args[0]);
			});
			f.apply(self, args);
			return d.promise;
		} : function(){
			var d = new Deferred(),
				args = Array.prototype.slice.call(arguments);
			args.push(function(){
				var args = Array.prototype.slice.call(arguments),
					err = args.shift();
				if(err){
					d.reject(err);
				}else{
					d.resolve(args.length > 1 ? args : args[0]);
				}
			});
			f.apply(self, args);
			return d.promise;
		};
	};

	return {
		asDeferred: asDeferred
	};
});