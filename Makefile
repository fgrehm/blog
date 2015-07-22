default: serve

serve: docker.build
	docker run -ti --rm -p 1313:1313 -v `pwd`:/workspace fgrehm/blog foreman start

hack: docker.build
	docker run -ti --rm -p 1313:1313 -v `pwd`:/workspace fgrehm/blog

docker.build:
	docker build -t fgrehm/blog .

build: docker.build
	rm -rf public/
	docker run -ti --rm -v `pwd`:/workspace fgrehm/blog hugo -b 'http://fabiorehm.com'

deploy: build
	TAG=$$(date +%Y%m%d%H%M%S) && \
		rsync -avze 'ssh -p 4363' --delete public/ 'fabiorehm.com':'/home/fabio/docker-nginx/sites/fabiorehm.com/' && \
		git tag $$TAG && git push && git push --tags
