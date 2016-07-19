default:
	@echo 'No default task'

serve:
	hugo server

build:
	hugo

deploy: build public/.git
	cd public \
	&& git add -A . \
	&& git commit -m 'Regenerated website' \
	&& git push -u origin gh-pages

public/.git:
	cd public \
	&& git init \
	&& git remote add origin git@github.com:fgrehm/blog.git \
	&& git checkout -b gh-pages

.PHONY: serve build deploy
