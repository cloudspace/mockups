from sikuli.Sikuli import *

def changeName(username):
	click("VV.png")
	type( "a", KEY_CMD)
	wait(1)
	type(username+"\n")

def reconnect():
	if exists("ReconnectNow.png"):
		click("ReconnectNow.png")

def testProjectExists():
	if exists("Sorrythatpro.png"):
		exit("Project not found")

def testNameChange():
	if not exists("Yousuccessfu.png"):
		exit("Name change failed")

def testProjectLoaded():
	wait(5)
	if exists("CloudspaceMo-1.png"):
		print("ok")
	elif exists("ClcudspaceMo.png"):
		print("ok")
	else:
		exit("Page failed to load")
	if exists(Pattern("mockusdev.png").exact().similar(1.00)):
		exit("Auto-redirect to new project URL failed.")
	if exists("ConnectIn.png"):
		exit("Node did not connect")

def testLostConnection():
	if not wait("Yourconnectl.png", 20):
		exit("Socket.io disconnect failed")
	if not exists("ReconnectNow.png"):
		exit("Reconnect Now button missing")
	if not wait("Nextconnecti.png", 10):
		exit("Auto-reconnect attempt not started") 

def testReconnected():
	if not waitVanish("Yourconnectl.png", 20):
		exit("Auto-reconnect failed")
