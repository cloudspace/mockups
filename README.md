# Cloudspace Mockup Creator

## Description

The goal of the mockup creator is to serve a way of creating and editing mockups collaboratively. The server should run off of node.js, and data is stored with mongodb. Static files are served in nginx in our default setup.
  
## Tests

To run unit tests:

    nodeunit test/lib/*

## Installation

### Virtual Box Setup
Our development setup for the mockupcreator consists of

* VirtualBox accessed via Vagrant
* Chef for the setup of the development box

Start a new virtual box using Ubuntu 10.04 64 bit server edition

Be sure to adjust settings before starting the box, under network settings, set the first adapter to bridged and choose your airport in the box below that appears.

####Install vagrant

http://vagrantup.com/docs/getting-started/index.html

Clone the mockup creator repo:

  git clone git@github.com:cloudspace/mockupcreator.git

In the mockupcreator project directory:

  cp Vagrantfile.default Vagrantfile

Update the Vagrantfile with your server specific settings

####Set up Chef

  gem install chef

You can get a lot of good cookbooks by cloning the opscode repo
  git clone https://github.com/opscode/cookbooks.git

All of the recipes that you need in order to get a development box up and running are in two places.

1. Vagrantfile.default

    Any recipes that appear as follows will need to be added your opscode user account

      chef.add_recipe('git::default')

2. There are site-specific cookbooks in [project_root]/site-cookbooks/ that contain site specific overrides for the default chef recipes. These can be added by editing your knife.rb config to include the path to site-cookbooks.  
  EX. ~/.chef/knife.rb
    .
    .
    cookbook_path            ["#{ENV['HOME']}/cookbooks",'./site-cookbooks']
    .

Here I have added a secondary directory based on the current directory I'm in that will look in site-cookbooks.  This way I can call:

  knife cookbook upload [recipe]

from any project that uses this structure.
  
From this point you will be ready to deploy to a development environment.

vagrant up #will run all of the chef commands necessary to create a working environment
cap deploy:check_dependencies #will check to see if you have what you need
cap deploy:setup && cap deploy #will set up and start up your application on the box you just set up
