# setten #

Dojo Toolkit style utilities and wrappers for Node.

This package is designed to provide Dojo-style AMD modules to make working with NodeJS more the "Dojo way".

## License ##

This code is licensed under the ["New" BSD License][license].

## Installation ##

Via **[cpm][cpm]**:

```bash
$ cpm install setten
```

Via **[volo][volo]**:

```bash
$ volo add kitsonk/setten
```

## Tests ##

The unit tests included with the package leverage the [Dojo Objective Harness][doh] (D.O.H.).  In order to leverage
D.O.H. it is assumed that the `dojo` package and the `util` directory of Dojo which contains the `doh` package are 
installed as siblings of the `setten` package, for example:

```
lib/dojo
lib/setten
lib/util/doh
```

This can be changed by modifying the `setten/tests/index.js` package map.

The execute the tests, execute the following command from the `/setten` directory:

```bash
$ node tests
```

## Modules ##

### setten/dfs ###

This is a wrapper for the NodeJS `fs` module, that takes the asynchronous callback calls and converts them into a
`dojo/promise` Promise based return.

For example, you might have written code like this in "plain" NodeJS:

```js
var fs = require("fs");

fs.readFile("/etc/passwd", function(err, data){
	if(err) throw err;
	console.log(data);
});
```

This could now be rewritten as:

```js
require(["setten/dfs"], function(dfs){
	dfs.readFile("/etc/passwd").then(function(data){
		console.log(data);
	}, function(err){
		throw err;
	});
});
```

### setten/dfs-extra ###

This is a wrapper for the [fs-extra][fsextra] module.  This takes the extra functions provides by this libarary and
provides a `dojo/promise` based return.

### setten/util ###

This is a utility library used internerally within the package.  It provides a convience function that converts
callback functions into a `dojo/promise` Promise return.  It would work like this:

```js
require(["setten/util"], function(util){
	var fn = function(data, callback){
		// do something async
		callback(err, info);
	}

	var pfn = util.asDeferred(fn, this, false);

	pfn("something").then(function(info){
		// async return
	}, function(err){
		// handle error
	});
});
```

The arguments for `asDeferred()` are:

 Argument | Type     | Description
----------|----------|--------------------------------------------------------------------------------------
fn        | Function | The function whos return should be converted to a Promise.
self      | Object?  | The scope to be used in conjunction with the function.  Defaults to `this`.
noError   | Boolean? | `true` if the callback does not include an ``error`` argument.  Defaults to `false`.

Because promises can only be fulfilled with a single value, if the callback is called with more than one argument
(minus the error argument) then the promise is fulfilled with the supplied arguments as an array, otherwise it just 
fufills with the single argument it was passed.

[license]: https://github.com/kitsonk/setten/blob/master/LICENSE
[cpm]: https://github.org/kriszyp/cpm
[volo]: http://volojs.org/
[doh]: http://dojotoolkit.org/reference-guide/1.8/util/doh.html
[fsextra]: https://github.com/jprichardson/node-fs-extra