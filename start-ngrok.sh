kubectl delete -f ngrok-deployment.yaml
kubectl delete -f ngrok-service.yaml

kubectl apply -f ngrok-deployment.yaml
kubectl apply -f ngrok-service.yaml

