VERSION=0.34

serve:
	pocketbase --dir $(CURDIR)/pb_data  serve &
	PB_URL='http://localhost:8090' npm run dev --verbose

stop:
	pkill pocketbase
	pkill npm


build:
	docker build --platform=linux/amd64 -t olopost/blog:$(VERSION) .

push:
	docker push olopost/blog:$(VERSION)
	kubectl set image deployment/blog blog=olopost/blog:$(VERSION)
