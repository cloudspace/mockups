from sikuli.Sikuli import *

def disconnect():
	if exists("2.png"):
		click("2.png")
	elif exists("2-1.png"):
		click("2-1.png")
	click("TurnAirPortO.png")
	wait(3)

def connect():
	if exists("1296525577004.png"):
		click("1296525577004.png")
	click("TurnAirPortO-1.png")
	wait(5)