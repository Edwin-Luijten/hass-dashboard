include .env
export

addon:
	docker run -it --rm	--privileged -v /var/run/docker.sock:/var/run/docker.sock:ro -v ./:/data homeassistant/amd64-builder --amd64 -t /data --docker-user --test