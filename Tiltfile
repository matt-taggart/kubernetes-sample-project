docker_build(
    'client',
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

k8s_yaml('./deploy/client-deployment.yaml')

docker_build(
    'server',
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

k8s_yaml('./deploy/server-deployment.yaml')

docker_build(
    'customers',
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

k8s_yaml('./deploy/customers-deployment.yaml')
