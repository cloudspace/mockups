
# Cloudspace Mockup Creator

## Description

The goal of the mockup creator is to serve a way of creating and editing mockups collaboratively. The server should run off of node.js, and data is stored with mongodb. Static files are served in nginx in our default setup.
  
## Installation

These should probably be run as root.

#### Basic package installation

    apt-get update
    apt-get install build-essential libssl-dev openssl curl nginx -y

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
    npm install socket.io@0.6.8

**Note:** there is a potential 'gotcha' for updated versions of Socket.IO (we use 0.6.8). The repository contains a public/socket.io.js file, which is the client-side code to get Socket.IO working. It was copied directly from the Socket.IO library. That file can change for newer versions of Socket.IO, so we would have to copy the socket.io.js file from the library into our repository when picking a newer version. *We mainly want nginx serving static content which is why we don't use node.js + Socket.IO's default behavior of managing the socket.io.js file.*

#### Set up nginx

Nginx should already be installed (from the earlier apt-get). Just be sure to set up the server. For example, set up the following location block in /etc/nginx/sites-enabled/default:

    location / { 
      root   /path/to/this/repository/public;
      index  index.html index.htm;
    }


#### TODO

Add process for mongodb.

