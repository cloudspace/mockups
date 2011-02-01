from sikuli.Sikuli import *

def openBrowser(browseros):
	if browseros == "chrome-mac":
		App.focus("Google Chrome")
		click("1295927341980.png")
		while exists("SikuliIDE.png"):
			App.focus("Google Chrome")
			wait(1)
	elif browseros == "firefox-mac":
		App.focus("Firefox")
		click("1295937601003.png")
		while exists("SikuliIDE.png"):
			App.focus("Firefox")
			wait(1)
	elif browseros == "safari-mac":
		App.focus("Safari")
		click("1295939266560.png")
		while exists("SikuliIDE.png"):
			App.focus("Safari")
			wait(1)
	else:
		exit("Browser not found")

def selectURL():
	type("l", KEY_CMD)

def openURL(url):
	selectURL()
	type(url+"\n")
	wait(3)

def copyURL():
	selectURL()
	type( "a", KEY_CMD)
	type( "c", KEY_CMD)

def pasteURL():
	selectURL()
	type("v", KEY_CMD)
	type("\n")

def reloadPage():
	if exists("1295995288421.png"):
		click("1295995288421.png")
	elif exists("1295995312378.png"):
		click("1295995312378.png")
	elif exists("1295995335286.png"):
		click("1295995335286.png")
	else:
		exit("Browser refresh button not found")


def removeCookies(urls):
	__openCookieSettings()
	for url in urls:
		if exists("Chrome.png"):
			type("al.png", url)
			if exists("1295907771375.png"):
				click("1295907771375.png")
			click("1295907793934.png")
		elif exists("Firefox.png"):
			type("1295985153669.png", url)
			wait(1)
			while  not exists("Site.png"):
				click("RemoveCookie.png")
				type(Key.UP) # Hack for the cookies that keep being added by Firefox
			if exists("Q-1.png"):
				click("Q-1.png")
			elif exists("1295986311698.png"):
				click("1295986311698.png")
		elif exists("Safari.png"):
			type("Q.png", url)
			wait(1)
			while  not exists("WebsiteName.png"):
				click("RemoveAll.png")
				wait("1295986502311.png")
				click("1295986502311.png")
			click("1295985499181.png")
		else:
			exit("Broswer cookie settings not found")
	__closeCookieSettings()


def __openCookieSettings():
	if exists("Chrome.png"):
		click("Chrome.png")
		click("Preferences.png")
		click("IndertheHocc.png")
		click("Contentsetti.png")
		if not exists("1295907682602.png"):
			click("Cookies.png")
		click("Showcookiesa.png")
	elif exists("Firefox.png"):
		click("Firefox.png")
		click("Preferences-1.png")
		click("Privacv.png")
		click("removeindivi.png")
	elif exists("Safari.png"):
		click("Safari.png")
		click("Preferences-2.png")
		click("Security.png")
		click("ShowCookies.png")
	else:
		exit("Browser cookie settings not found")

def __closeCookieSettings():
	if exists("Chrome.png"):
		click("1295907808768.png")
		type(Key.ESC)
		type(Key.ESC)
	elif exists("Firefox.png"):
		click("1295984776039.png")
		type(Key.ESC)
	elif exists("Safari.png"):
		click("1295985055093.png")
		type(Key.ESC)		
	else:
		exit("Brower cookie settings not found")
