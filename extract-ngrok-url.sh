kubectl exec $(kubectl get pods -l=app=ngrok -o=jsonpath='{.items[0].metadata.name}') -- curl http://localhost:4040/api/tunnels
