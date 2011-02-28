
include_recipe "nginx"
include_recipe "nodejs::npm"


template "#{node[:nginx][:dir]}/sites-available/mockups" do
  source "mockup-site.erb"
  owner "root"
  group "root"
  mode 0644
end

nginx_site "mockups" do
  enable true
end

nginx_site "default" do
  enable false
end

npm_packages %w(mongodb@0.7.9 nodeunit@0.5.0 socket.io@0.6.8)
