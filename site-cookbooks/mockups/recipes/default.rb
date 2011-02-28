
include_recipe "nginx"

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


