VERSION=0.0.40

.PHONY: serve stop build push

serve:
	pocketbase --dir $(CURDIR)/pb_data  serve &
	PB_URL='http://localhost:8090' npm run dev --verbose

stop:
	pkill pocketbase
	pkill npm


build:
	npm version $(VERSION) || echo "Version not changed ($(VERSION)"
	docker build --platform=linux/amd64 -t olopost/blog:$(VERSION) .

push:
	docker push olopost/blog:$(VERSION)
	kubectl set image deployment/blog blog=olopost/blog:$(VERSION)
