location = YAML.load_file( 'config/servers.yml')['development']['location']
server location, :app, :web, :primary => true
set :port, "2222"
set :admin_runner, 'vagrant'
