define([
	"dojo/promise/all",
	"setten/dfs"
], function(all, dfs){

	var walk = function(dir, match){
		var results = [];
		return dfs.readdir(dir).then(function(list){
			var pending = list.length,
				p = [];
			if(!pending) return results;
			list.forEach(function(file){
				file = dir + "/" + file;
				p.push(dfs.stat(file).then(function(stat){
					if(stat && stat.isDirectory()){
						return walk(file).then(function(res){
							results = results.concat(res);
							if(!--pending) return results;
						});
					}else{
						if(!match || (match && match.test(file))){
							results.push(file);
						}
						if(!--pending) return results;
					}
				}));
			});
			return all(p).then(function(res){
				r = [];
				res.forEach(function(result){
					if(result && result.length){
						r = r.concat(result);
					}
				});
				return r;
			});
		});
	};

	return {
		walk: walk
	};
});