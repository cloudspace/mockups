#!/bin/sh

mkdir -p test/results
nodeunit --reporter junit --output test/results test/lib/*

