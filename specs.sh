#!/bin/sh

# Remove the results XML file
rm -f test/results test/results.xml

# Run through all our test models
# Consider updating this to work with all subfolders (not just test/models)
FILES=./test/models/*
for f in $FILES
do
  # Run tests on the file and append data to results
  # TODO output files by class name for junit 'classname'
  /usr/bin/env node $f $@ | tr '\n' ' ' | sed -r 's~ (PASS|FAIL):~\n \1: ~g' | tee -a test/results
done

pass=`grep 'PASS:' test/results | wc -l`
fail=`grep 'FAIL:' test/results | wc -l`
total=`expr $pass + $fail`

echo "\nPassed: $pass, Failed: $fail\n"

cat > test/results.xml << eof
<?xml version="1.0" encoding="UTF-8"?> 
<testsuite errors="0" failures="$fail" name="Mockup Creator" tests="$pass">
eof

#<testcase classname="Mockup Creator" name=""></testcase> 

#<testcase classname="Hero Carousel.Visitor can click a hero's name and get to some of the hero's speeches" name="Visitor can click a hero's name and get to some of the hero's speeches" time="0.668719"> 
#  <failure message="failed Visitor can click a hero's name and get to some of the hero's speeches" type="failed"> 
#    <![CDATA[
#]]>

grep -h ' PASS: ' test/results | sed -r 's~^( PASS: )(.*)$~<testcase classname="Mockup Creator" name="\2"></testcase>~' >> test/results.xml
grep -h ' FAIL: ' test/results | sed -r 's~^( FAIL: )([^\~]*)\~(.*)$~<testcase classname="Mockup Creator" name="\2"><failure message="\2" type="failed">\n<![CDATA[\n\3\n]]>\n</failure></testcase>~' >> test/results.xml

echo '</testsuite>' >> test/results.xml

