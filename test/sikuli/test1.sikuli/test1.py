##############################
# Initial test for the Node.js Mockups app
# Assumes Mac OS + Google Chrome and
# an /etc/hosts entry for mockups.dev
##############################

App.open("Google Chrome")
click("F.png")
exists("1295917715592.png")
type("1295917715592.png", "http://mockups.dev\n")
exists("CloudspaceMo.png")
waitVanish("Connecting.png")
click("ndusers.png")
exists("Anonymous.png")
exists("x645v25.png")

# Test Socket.io Connection Loss
click("1295919834869.png")
click("TurnAirPortO.png")
wait(5)
App.focus("Google Chrome")
if not wait("Therequested.png", 20):
	print "Socket.io disconnect failed"
	exit()

# Reconnect to Internet
click("1295919982435.png")
click("TurnAirPortO-1.png")
wait(5)
App.focus("Google Chrome")
click("1295920051816.png")
exists("DisblavName.png")

# Test Name Change
click("DisplayNameA.png")
type( "a", KEY_CMD)
wait(1)
type("Todd\n")
if not exists("Yousuccessfu.png"):
	print "Name change failed"
	exit()
click("ndusers.png")
if not exists("Todd-1.png"):
	print "Name change failed"
	exit()
if not exists("x645v25-1.png"):
	print "Name changed failed"
	exit()
else:
	print "SUCCESS!"