#!/bin/sh

rm -rf build/html
node build
src/util/buildScripts/build.sh --profile build/build.profile.js
rm build/html/_static/lib/dojoment-client/resources/*.styl