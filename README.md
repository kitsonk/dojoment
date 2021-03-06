# dojoment #

**dojoment** is an experimental project looking at the possibility of a markdown based community editable documentation wiki which can be used instead of the current solution which is based on reStructuredText.

The main objectives of this project are:
* Base the entire solution on JavaScript (because that is what we are about)
* Leverage as much of the Dojo Toolkit as possible (eat our own dogfood)
* Adopt markdown as the primary markup
* Extend the markdown syntax, if required, to provide live examples
* Provide a community editable wiki
* Make it easier to generate final documentation for the website
* Fully integrate into git and GitHub for documentation storage
* Assess the suitability to be able to create Dojo Tutorials
* Align better with the Dojo Inline Documentation Parser

## Licensing ##

This is released under the same "New" BSD License as the Dojo Toolkit:
* [The "New" BSD License][bsd]

(Note: It is not licensed under the AFL 2.1)

Additional libraries are licensed and copyrighted by their respective owners.

## Requirements ##

* [Node.js][nodejs] - Requires v0.8 or later (including `npm`)
* [Dojo Toolkit][dojo] - Requires v1.8.0 or later
* [express][express] - Requires v3.0.0 or later
* [jade][jade] - Requires v0.27.2 or later
* [marked][marked] - Requires v0.2.5 or later (customized)
* [highlight.js][hljs] - Requires v7.1.0 or later
* [stylus][stylus] - Requires v0.29.0 or later
* [Font-Awesome][fontawesome] - Requires v2.0 or later
* [setten][setten] - Requires v0.1.1 or later

The Dojo Toolkit and Font-Awesome and the customized fork of marked are installed as submodules and can be managed by `git`.  express, jade, highlight.js and stylus are installed as node modules and can be managed via `npm`.

## Installation ##

*Experimental* does mean experimental, this is under heavy development and I may not remember to update the `README` every time.

* Ensure you have `git`, Node.js, `npm` and installed.
* You will also need [cpm][cpm] or [volo][volo] to install the AMD dependencies.
* Clone the repository recursively:

	```bash
	git clone --recursive https://github.com/kitsonk/dojoment.git
	```

* Update the `config.json`.
* Update the reference docs repository:

	```bash
	cd dojoment/refdocs
	git pull
	```

* Install AMD dependencies.

	* Using **[cpm][cpm]**:

		```bash
		cd ..
		cpm --packages-path=src install dojo
		cpm --packages-path=src install dijit
		cpm --packages-path=src install setten
		```

	* Using **[volo][volo]**:

		```bash
		cd ..
		volo install -amd
		```

* Build the client library build:

	```bash
	src/util/buildScripts/build.sh --profile dojoment.profile.js
	```

* Start the server:

	```bash
	node server
	```

You will get a message indicating that the server is running and what port it is running on.

## Generating Static Documentation ##

In order to generate all the reference documentation

[bsd]: /kitsonk/dojoment/blob/master/LICENSE
[nodejs]: http://nodejs.org/download/
[dojo]: http://dojotoolkit.org/download/
[express]: http://expressjs.com/
[jade]: http://jade-lang.com/
[marked]: https://github.com/chjj/marked/
[hljs]: http://softwaremaniacs.org/soft/highlight/en/
[stylus]: http://learnboost.github.com/stylus/
[fontawesome]: http://fortawesome.github.com/Font-Awesome/
[volo]: http://volojs.org/
[cpm]: https://github.com/kriszyp/cpm/
[setten]: https://github.com/kitsonk/setten/