VERSION=0.0.26

serve:
	pocketbase --dir $(CURDIR)/pb_data  serve &
	PB_URL='http://localhost:8090' npm run dev --verbose

stop:
	pkill pocketbase
	pkill npm


build:
	npm version $(VERSION)
	docker build --platform=amd64 -t olopost/blog:$(VERSION) .


buildnative:
	npm version $(VERSION) || true
	docker build -t olopost/blog:$(VERSION) .


push:
	docker push olopost/blog:$(VERSION)
	kubectl set image deployment/blog blog=olopost/blog:$(VERSION)
