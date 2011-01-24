
# Cloudspace Mockup Creator

## Description

The goal of the mockup creator is to serve a way of creating and editing mockups collaboratively. The server should run off of node.js, and data is stored with mongodb. Static files are served in nginx in our default setup.
  
## Tests

To run unit tests, execute ./specs.sh. 

Our test coverage should be improved to run on a CI server. Unit tests are currently using node's native Assert module.

## Installation

#### Virtual Box Setup

Start a new virtual box using Ubuntu 10.04 64 bit server edition

Be sure to adjust settings before starting the box, under network settings, set the first adapter to bridged and choose your airport in the box below that appears.

#### Basic package installation

SSH into your virtual box.

    sudo apt-get update
    sudo apt-get install build-essential libssl-dev openssl curl nginx dkms -y

#### Install node.js

Download the newest stable version of node.js (v0.2.6 as of 2011-01-19), unpack, and install it:

    cd /tmp
    wget http://nodejs.org/dist/node-v0.2.6.tar.gz
    tar -xvzf node-v0.2.6.tar.gz
    cd node-v0.2.6
    ./configure
    make
    sudo make install


#### Install npm, Socket.IO

    cd /tmp
    curl http://npmjs.org/install.sh | sudo sh
    sudo npm install socket.io@0.6.8

**Note:** there is a potential 'gotcha' for updated versions of Socket.IO (we use 0.6.8). The repository contains a public/socket.io.js file, which is the client-side code to get Socket.IO working. It was copied directly from the Socket.IO library. That file can change for newer versions of Socket.IO, so we would have to copy the socket.io.js file from the library into our repository when picking a newer version. *We mainly want nginx serving static content which is why we don't use node.js + Socket.IO's default behavior of managing the socket.io.js file.*

#### Configure SSH Keys

(You do not want to be root for this step)
Add your github account authorized key to the virtual box in the folder /home/ubuntu/.ssh (public and private key files) and then add your public key to the authorized keys file (which you may have to create)

#### Clone the repo

(You do not want to be root for this step)
Go into the /srv folder and clone the repo

    git clone git@github.com:cloudspace/Mockups.git 

#### Set up nginx

Nginx should already be installed (from the earlier apt-get). Just be sure to set up the server. For example, set up the following location block in /etc/nginx/sites-enabled/default:

    location / { 
      root   /srv/Mockups/public;
      index  index.html index.htm;
    }

Restart nginx

    sudo service nginx restart

#### Start the nodejs application

Run the following commands:

    cd /srv/Mockups
    sudo node app.js

#### Update Your Local Hosts File

On your computer update your hosts file to add an entry matching the IP of your vbox to a url that you will use for development, such as mockups.dev
#### TODO

Add process for mongodb.

