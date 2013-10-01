desc 'Build the site using Jekyll + Grunt'
task :build do
  sh 'grunt'
  sh 'jekyll build --lsi --verbose'
end

desc 'Deploy to production'
task :deploy => :build do
  sh "rsync -avze 'ssh -p 536' --delete _site/ 'fabiorehm.com':'/var/www/fabiorehm.com'"
  tag = Time.now.to_s[0..-7].gsub(/\s+|:/, '-')
  sh "git tag #{tag} && git push --tags"
end
