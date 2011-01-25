#!/bin/sh

# Set color vars
GREEN="\033[0;32m"
RED="\033[0;31m"
RESET="\033[m"

# Remove the results XML file
rm -f test/results test/results.xml

# Run through all our test models
# Consider updating this to work with all subfolders (not just test/models)
FILES=./test/models/*
for f in $FILES
do
  # Run tests on the file and append data to results
  # TODO output files by class name for junit 'classname'
  /usr/bin/env node $f $@ | tr '\n' '\t' | sed -r 's~ (PASS|FAIL):~\n \1: ~g' | tee -a test/results
done

# Stats
pass=`grep 'PASS:' test/results | wc -l`
fail=`grep 'FAIL:' test/results | wc -l`
total=`expr $pass + $fail`

# Output to user
echo "\n\n${GREEN} Passed: ${pass}${RESET}, ${RED}Failed: ${fail}${RESET}\n"

# Output XML!
# Headers
cat > test/results.xml << eof
<?xml version="1.0" encoding="UTF-8"?> 
<testsuite errors="0" failures="$fail" name="Mockup Creator" tests="$pass">
eof

# Pass/Fail lines
grep -h ' PASS: ' test/results | sed -r 's~^( PASS: )(.*)$~<testcase classname="Mockup Creator" name="\2"></testcase>~' >> test/results.xml
grep -h ' FAIL: ' test/results | sed -r 's~^( FAIL: )([^\~]*)\~(.*)$~<testcase classname="Mockup Creator" name="\2"><failure message="\2" type="failed">\n<![CDATA[\n\3\n]]>\n</failure></testcase>~' | sed -r 's~\t~\n~g' >> test/results.xml

# End
echo '</testsuite>' >> test/results.xml

