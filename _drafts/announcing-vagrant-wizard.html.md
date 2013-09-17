---
title: 'Announcing vagrant wizard'
# date: TBD When publishing
tags:
---

Based on http://railswizard.org/

Vagrant::Config.run do |config|
  config.my_plugin.name = "foo"
  config.my_plugin.location = "bar"
end

Vagrant::Config.run do |config|
  config.vm.box     = "quantal64-dev-box-2013-01-23"

  config.vm.provision :wizard do |wizard|
    wizard.install :rbenv, {
      :rubies => {
        '1.9.3-p327-falcon' => {
          :gems => ['...'],
          :gemrc => ['...']
        }
    }

    wizard.install :nodejs => { :npm => { 'coffee' } }

    wizard.install :redis     => { :memory => '...' }
    wizard.install :memcached => { :memory => '...' }
    wizard.install :postgres
    wizard.install :mysql
    wizard.install :apache => {
      :vhosts => { .... }
    }
    wizard.install :nginx => {
      :vhosts => { .... }
    }
  end

  # Configure VM to use 1.5gb of ram and 3 cpus
  config.vm.customize [
                    "modifyvm", :id,
                    "--memory", 1536,
                      "--cpus", "3"
                    ]

  # Becomes
  config.vm.cpus   = 3
  config.vm.memory = '1.5'.gb
end
