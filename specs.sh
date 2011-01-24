#!/bin/sh

FILES=./test/models/*
for f in $FILES
do
	/usr/bin/env node $f $@
done


