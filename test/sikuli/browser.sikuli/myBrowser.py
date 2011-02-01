from sikuli.Sikuli import *
myOS = Env.getOS()
myOSVer = Env.getOSVersion()
print "OS: " + myOS + " " myOSVer 

# Open Chrome
def openChrome():
	if myOS == "MAC":
		openApp("Google\ Chrome")
	elif myOS == "WINDOWS":
		openApp("googlechrome.exe")
	elif myOS == "LINUX":
		openApp("Google\ Chrome")
	else:
		print "OS not found!"
		exit()
	type(Key.ESC)
	type(Key.ESC)
	type(Key.ESC)

def openFirefox():
	#work on this

# Open Cookie Preferences
def openCookies():
	type(",", KEY_CMD)
	click("JndertheHood.png")
	click("Contentsetti.png")
	if not exists("1295375433222.png"):
		click("Cookies.png")

# Remove Cookies
def removeCookies(url):
	click("Showcookiesa.png")
	type("1295374919460.png", url)
	if exists("RemoveAll.png"):
		click("1295374950584.png")
	click("1295379312202.png")

# Close Cookie Preferences
def closeCookies():
	click("1295374985887.png")
	click("Q6.png")
	click("01.png")
