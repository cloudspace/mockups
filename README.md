# Cloudspace Mockups

## Description

The goal of Cloudspace Mockups is to serve a way of creating and editing mockups collaboratively. The server should run off of node.js, and data is stored with mongodb. Static files are served in nginx in our default setup.
  
## Tests

To run unit tests:

    nodeunit test/lib/*

## Installation

### Development Environment Setup
Our development setup for Cloudspace Mockups consists of

* VirtualBox accessed via Vagrant
* Chef for the setup of the development box

Once set up, your virtual box will have:

* nginx
* mongo
* nodejs
* npm + required packages
* git

####Virtual Box

Download a new virtual box from: http://www.virtualbox.org/wiki/Downloads

Start a new virtual box using Ubuntu 10.04 64 bit server edition

####Install vagrant

http://vagrantup.com/docs/getting-started/index.html

Clone the Cloudspace Mockups repo:

    git clone git@github.com:cloudspace/mockups.git

In the Cloudspace Mockups project directory:

    cp Vagrantfile.default Vagrantfile

Update the Vagrantfile with your server specific settings

####Set up Chef

    gem install chef

You can get a lot of good cookbooks by cloning the opscode repo

    git clone https://github.com/opscode/cookbooks.git

All of the recipes that you need in order to get a development box up and running are in two places.

1. Vagrantfile.default

    Any recipes that appear as follows **chef.add_recipe('[recipe name]')** will need to be added your opscode user account

2. There are site-specific cookbooks in [project_root]/site-cookbooks/ that contain site specific overrides for the default chef recipes. These can be added by editing your knife.rb config to include the path to site-cookbooks.  
  EX. ~/.chef/knife.rb

    .
    .
    cookbook_path   ["#{ENV['HOME']}/cookbooks",'./site-cookbooks']
    .

Here I have added a secondary directory based on the current directory I'm in that will look in site-cookbooks.  This way I can call:

    knife cookbook upload [recipe]

from any project that uses this structure.
  
From this point you will be ready to deploy to a development environment.

    vagrant up #will run all of the chef commands necessary to create a working environment

####Deploy the Application

If you would like to test the deployment through capistrano then run:

    cap deploy:check_dependencies #will check to see if you have what you need
    cap deploy:setup && cap deploy #will set up and start up your application on the box you just set up

Otherwise, log in to the box and run:

		git checkout git@github.com:cloudspace/mockups.git
		cd mockups
		sudo mongod &    #run mongo as a daemon
		sudo node app.js #call node on the file that controls the application

###EC2 Deployment

Add your EC2 credentials to your .bash_profile(or .bashrc). This should look something like the following:
    export AWS_ACCESS_KEY_ID=[KEY_ID]
    export AWS_SECRET_ACCESS_KEY=[SECRET_ACCESS_KEY]

Then call the launch instances script:

    ./launch_instances ami-98e515f1 --key ec2_keypair_name -f ~/userdata.json  --tags Name Mockups -w

In this call ami-98e515f1 is a 32-bit amazon image with chef installed on it.
The file userdata.json contains the following json:
    {"validation_key": "Your organizations chef validation ssh private key"}
The tag Name will allow elastifox to see the name of Mockups on for your box.


After creating the box, the script should spit out a domain name.  Ssh into the box and add your personal public key to the authorized_hosts file in both /root/.ssh/ and ~/.ssh/ . This will allow you to login without having to use the box's pem. 

On the ec2 box run: chef-client #as root

This will set the current box up as a node for your opscode organization.  Once that is done:

* Log into manage.opscode.com
* Go to Roles -> Create
* The Vagrantfile in your local project directory will contain all of the recipes needed for you to create a role.
* Add those recipes to the role you are creating.
* Add that role to the node that was just added.
* Back on your ec2 box run: chef-client #again.  This will install all of the server applications necessary.

####Deploy the Application

    cap staging deploy:check_dependencies #will check to see if you have what you need
    cap staging deploy:setup && cap deploy #will set up and start up your application on the box you just set up
