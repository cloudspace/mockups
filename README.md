
# Cloudspace Mockup Creator

## Description

The goal of the mockup creator is to serve a way of creating and editing mockups collaboratively. The server should run off of node.js, and data is stored with mongodb. Static files are served in nginx in our default setup.
  
## Installation

These should probably be run as root.

#### Basic package installation

    apt-get update
    apt-get install build-essential libssl-dev openssl curl -y

#### Install node.js

Download the newest stable version of node.js (v0.2.6 as of 2011-01-19), unpack, and install it:

    cd /root
    wget http://nodejs.org/dist/node-v0.2.6.tar.gz
    tar -xvzf node-v0.2.6.tar.gz
    cd node-v0.2.6
    ./configure
    make
    make install

Obviously, this will create it in the /root folder. Use your own discretion.

#### Install npm, Socket.IO

    curl http://npmjs.org/install.sh | sh
    npm install socket.io

#### TODO

Add process for nginx and mongodb.

