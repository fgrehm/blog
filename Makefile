default:
	@echo 'No default task'

serve:
	hugo server

build:
	rm -rf public
	hugo

deploy: build
	#PUSH

.PHONY: serve build deploy
