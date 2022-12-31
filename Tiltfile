docker_build(
    'localhost:5001/client',
    context='.',
    dockerfile='./client/Dockerfile.dev',
    only=['./client/'],
    live_update=[
        sync('./client/', '/app/client/'),
        run(
            'pnpm install',
            trigger=['./client/package.json']
        )
    ]
)

docker_build(
    'localhost:5001/server',
    context='.',
    dockerfile='./server/Dockerfile.dev',
    only=['./server/'],
    live_update=[
        sync('./server/', '/app/server/'),
        run(
            'pnpm install',
            trigger=['./server/package.json']
        )
    ]
)

docker_build(
    'localhost:5001/customers',
    context='.',
    dockerfile='./customers/Dockerfile.dev',
    only=['./customers/'],
    live_update=[
        sync('./customers/', '/app/customers/'),
        run(
            'pnpm install',
            trigger=['./customers/package.json']
        )
    ]
)

k8s_yaml('./deploy/server-deployment.yaml')
k8s_yaml('./deploy/client-deployment.yaml')
k8s_yaml('./deploy/customers-deployment.yaml')

k8s_yaml('./deploy/server-cluster-ip-service.yaml')
k8s_yaml('./deploy/client-cluster-ip-service.yaml')
k8s_yaml('./deploy/customers-cluster-ip-service.yaml')

k8s_yaml('./deploy/database-persistent-volume-claim.yaml')
k8s_yaml('./deploy/redis-deployment.yaml')
k8s_yaml('./deploy/postgres-deployment.yaml')

k8s_yaml('./deploy/ingress-service.yaml')

