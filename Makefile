delete-ngrok:
	kubectl delete -f ngrok-deployment.yaml
	kubectl delete -f ngrok-service.yaml

apply-ngrok:
	kubectl apply -f ngrok-deployment.yaml
	kubectl apply -f ngrok-service.yaml

extract-ngrok-url:
	kubectl exec $$(kubectl get pods -l=app=ngrok -o=jsonpath='{.items[0].metadata.name}') -- curl http://localhost:4040/api/tunnels

get-ngrok-port:
	kubectl get svc ngrok-service -o=jsonpath='{.spec.ports[?(@.port==4040)].nodePort}'

update-dev-images:
	docker build -t auth -f ./auth-microservice/Dockerfile.dev ./auth-microservice
	docker tag auth us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth
	docker build -t customers -f ./customers-microservice/Dockerfile.dev ./customers-microservice
	docker tag customers us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers
	docker build -t greetings -f ./greetings-microservice/Dockerfile.dev ./greetings-microservice
	docker tag greetings us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/greetings
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/greetings
	docker build -t images -f ./images-microservice/Dockerfile.dev ./images-microservice
	docker tag images us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/images
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/images
	docker build -t server -f ./nest-server/Dockerfile.dev ./nest-server
	docker tag server us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/server
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/server
	docker build -t client -f ./client/Dockerfile.dev ./client
	docker tag client us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client
	docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client
