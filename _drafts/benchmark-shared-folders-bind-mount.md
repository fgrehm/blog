 * Dentro do virtualbox limitado, pasta compartilhada
 * Dentro do virtualbox limitado, pasta compartilhada (NFS)
 * Com minha maquina e tudo liberado
 * Com minha maquina limitando



used 7e92109ac8fde7dde56ed1db1d8f824e519dca7c as master was broken =/

i7, quad-core, 8 threads, /proc/cpuinfo
no ssd
ubuntu precise up to date, kernel 3.8.0-26

vagrant up --no-provision
vagrant reload
vagrant ssh

cd /vagrant
bundle
bundle exec rake db:migrate
RAILS_ENV=test bundle exec rake db:migrate

# BASELINE

## VirtualBox Precise32 (discourse base box) with NFS

```
time `bundle exec script/rails runner "0"`

real 0m14.054s
real 0m6.263s
real 0m6.236s
```

```
bundle exec rake db:migrate && RAILS_ENV=test bundle exec rake db:migrate
bundle exec rake spec

Finished in 2 minutes 36.12 seconds
Finished in 2 minutes 47.31 seconds
Finished in 2 minutes 44.72 seconds
```

```
createdb pgbench
/usr/lib/postgresql/9.1/bin/pgbench

pgbench -i -s 10 pgbench
pgbench -T 600 pgbench

transaction type: TPC-B (sort of)
scaling factor: 10
query mode: simple
number of clients: 1
number of threads: 1
duration: 600 s
number of transactions actually processed: 367911
tps = 613.184408 (including connections establishing)
tps = 613.188813 (excluding connections establishing)
```

## VirtualBox Precise64 with NFS

https://github.com/discourse/discourse/blob/master/docs/DEVELOPER-ADVANCED.md#building-your-own-vagrant-vm

```

```

# From within a VBox VM and folder present on the guest machine (not shared)
