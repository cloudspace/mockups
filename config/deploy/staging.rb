location = YAML.load_file( 'config/servers.yml')['staging']['location']
server location, :app, :web, :primary => true
set :port, "22"
set :admin_runner, 'root'
