#!/bin/sh

rm -rf lib
src/util/buildScripts/build.sh --profile profile.js
rm lib/dojoment-client/resources/*.styl
