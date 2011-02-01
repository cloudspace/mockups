from sikuli.Sikuli import *

myOS = str(Env.getOS())
myOSVer = str(Env.getOSVersion())
print "OS: " + myOS + " (" + myOSVer + ")"

def getBrowsers():
	if myOS == "MAC":
		browsers = ["chrome-mac","firefox-mac","safari-mac"]
		return browsers
	else:
		exit("Operating System unknown")
