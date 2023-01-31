docker build -t auth -f ./auth/Dockerfile.auth.dev ./auth
docker tag auth us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth

docker build -t customers -f ./customers/Dockerfile.customers.dev ./customers
docker tag customers us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers

docker build -t greetings -f ./greetings/Dockerfile.greetings.dev ./greetings
docker tag greetings us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/greetings
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/greetings

docker build -t images -f ./images/Dockerfile.images.dev ./images
docker tag images us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/images
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/images

docker build -t server -f ./server/Dockerfile.server.dev ./server
docker tag server us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/server
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/server

docker build -t client -f ./client/Dockerfile.client.dev ./client
docker tag client us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client
docker push us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client
