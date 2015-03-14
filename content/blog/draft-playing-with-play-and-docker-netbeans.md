---
layout: post
category: blog
draft: true
date: '2030-01-01'
---

- bootstrap project from $HOME/projects
```
wget http://downloads.typesafe.com/typesafe-activator/1.2.10/typesafe-activator-1.2.10-minimal.zip -O /tmp/activator.zip
sudo apt-get update && sudo apt-get install unzip -y
cd /tmp/ && unzip activator.zip && mv activator-* $HOME/activator
sudo ln -s $HOME/activator/activator /usr/local/bin/activator
cd /workspace
activator new playing-with-play play-java
```

Fire up console  from new netbeans session, leverage docker exec

```
./activator
```

bind mount home dir on the host (`pwd`/.docker-netbeans for example) or will download the internet all the time)


https://www.playframework.com/documentation/2.3.5/ProductionHeroku
add postgresql plugin to project/plugins.sbt
reload from activator shell

https://www.playframework.com/documentation/2.1.1/ProductionHeroku
info on running locally

docs are not that good

http://stackoverflow.com/questions/10113832/how-do-i-use-play-framework-2-0-in-netbeans
eclipsify
import on netbeans

* access http server from outside

Repository

Script to run netbeans

Home dir

Web apps

http://wiki.netbeans.org/FaqSilentInstallationNB61

http://de.slideshare.net/mobile/dotCloud/dockerizing-your-appli
https://registry.hub.docker.com/u/codekoala/sikuli/
http://stackoverflow.com/a/25334301
http://stackoverflow.com/a/25280523
