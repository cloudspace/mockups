require 'capistrano/ext/multistage'
set :application, "mockups"
set :repository,  "git@github.com:cloudspace/#{application}.git"

set :scm, :git
set :branch, "master"
set :deploy_via, :remote_cache

set :node_file, "app.js"
set :deploy_to, "/srv/#{application}"
set :stages, %w(development staging production)
set :default_stage, 'development'

set :user, 'root'
set :use_sudo, false

default_run_options[:pty] = true
ssh_options[:keys] = ["~/.ssh/mockup.pem", "~/.ssh/id_rsa"]
ssh_options[:forward_agent] = true


namespace :deploy do
  task :start, :roles => :app, :except => { :no_release => true } do
		run "rm /var/db/mongodb/mongod.lock" if file_exists?("/var/db/mongodb/mongod.lock") and not running?("mongod")
		run "start mongo"
		run "start #{application}"
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    run "stop #{application}"
		run "stop mongo"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "restart #{application} || #{try_sudo :as => 'root'} start #{application}"
  end
	task :check_dependencies, :roles => :app do
			to_screen "Checking dependencies..."
			to_screen "Mongo is not installed"  unless installed? "mongo"
			to_screen "NPM is not installed"    unless installed? "npm"
			to_screen "Nginx is not set up"		  unless file_exists?("ls -d /etc/nginx/sites-enabled")
			to_screen "What do you think you should do?"
	end

	task :create_deploy_to_with_sudo, :roles => :app do
		run "mkdir -p #{deploy_to}"
		run "chown #{admin_runner}:#{admin_runner} #{deploy_to}"
  end

	#this is kind of a hack.  I pipe to xargs b/c capture needs some sort of output and xargs will always give a newline at least
	def running?(program); capture("ps ax | grep -v grep | grep #{program} | xargs")[program] end
	def file_exists?(abs_loc); ! capture("ls #{abs_loc} | xargs")['No such file or directory'] end
	def installed?(program); ! capture("whereis #{program}").sub( /#{program}:(\s)*/,"").empty? end
	def to_screen msg; puts "\t===============#{msg}===============" end

	task :write_upstart_script, :roles => :app do
	site_upstart_script = <<-UPSTART
		description "#{application}"

		start on startup
		stop on shutdown

		script
				# We found $HOME is needed. Without it, we ran into problems
				export HOME="/home/#{admin_runner}"

				cd #{current_path}
				exec sudo -u root sh -c "node #{current_path}/#{node_file} >> #{shared_path}/log/#{application}.log 2>&1"
		end script

		respawn
UPSTART
	mongo_upstart_script = <<-UPSTART
		description "mongo"

		start on startup
		stop on shutdown

		script
				# We found $HOME is needed. Without it, we ran into problems
				export HOME="/home/#{admin_runner}"

				cd #{current_path}
				exec sudo -u root sh -c "mongod"
		end script

		respawn
UPSTART

  put site_upstart_script, "/tmp/#{application}_upstart.conf"
  put mongo_upstart_script, "/tmp/mongo_upstart.conf"
	run "mv /tmp/mongo_upstart.conf /etc/init/mongo.conf"
	run "mv /tmp/#{application}_upstart.conf /etc/init/#{application}.conf"
  end
end

before 'deploy:setup', 'deploy:create_deploy_to_with_sudo'
after 'deploy:setup', 'deploy:write_upstart_script'
