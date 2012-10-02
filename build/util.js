define([
	"dojo/Deferred",
	"dnode/dfs"
], function(Deferred, dfs){
	return {
		walk: function(dir, match){
			var results = [],
				d = new Deferred();
			dfs.readdir(dir).then(function(list){
				var pending = list.length;
				if(!pending) return d.resolve(results);
				list.forEach(function(file){
					file = dir + "/" + file;
					dfs.stat(file).then(function(stat){
						if(stat && stat.isDirectory()){
							walk(file).then(function(res){
								results = results.concat(res);
								if(!--pending) return d.resolve(results);
							});
						}else{
							results.push(file);
							if(!--pending) return d.resolve(results);
						}
					});
				});
			});

			return d.promise;
		}
	};
});