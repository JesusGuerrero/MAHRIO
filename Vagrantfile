Vagrant.configure("2") do |config|

  config.vm.box = "netsensia/ubuntu-trusty64"

  # provisioning necessary software for Vagrant deployment
  config.vm.provision :shell, :path => ".devops/vagrant/bootstrap.sh", :args => "/vagrant"
  config.vm.provision :shell, :path => ".devops/vagrant/mongodb/bootstrap_mongodb.sh", :args => "/vagrant"
  config.vm.provision :shell, :path => ".devops/vagrant/javascript/NodeJS/bootstrap_node.sh", :args => "/vagrant"
  config.vm.provision :shell, :path => ".devops/vagrant/javascript/NodeJS/bootstrap_npm_utils.sh", :args => "/vagrant"
  config.vm.provision :shell, :path => ".devops/vagrant/javascript/NodeJS/bootstrap_jesus_stack.sh", :args => "/vagrant"

  config.vm.network :private_network, ip: "192.168.56.112"
  config.vm.network "forwarded_port", guest: 27017, host: 27017
  config.vm.synced_folder '.', '/vagrant', nfs: true  
  
  #Default VirtualBox provider
  config.vm.provider :virtualbox do |vb|
    host = RbConfig::CONFIG['host_os']

    # Give VM 1/4 system memory & access to all cpu cores on the host
    if host =~ /darwin/
        cpus = `sysctl -n hw.ncpu`.to_i
    elsif host =~ /linux/
        cpus = `nproc`.to_i
    end

    vb.customize ["modifyvm", :id, "--cpus", cpus]
    vb.customize ["modifyvm", :id, "--memory", "1024"]
    vb.gui = false

  end

  config.vm.provider :vmware_fusion do |vb|
    vb.vmx["memsize"] = "1024"
    vb.gui = false
  end

end

