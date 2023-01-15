docker_build(
    'client',
    context='./client',
    dockerfile='./client/Dockerfile.client.dev',
    live_update=[
        sync('./client', '/app'),
        run(
            'pnpm install',
            trigger=['./client/package.json']
        )
    ]
)

docker_build(
    'server',
    context='./server',
    dockerfile='./server/Dockerfile.server.dev',
    live_update=[
        sync('./server', '/app'),
        run(
            'pnpm install',
            trigger=['./server/package.json']
        )
    ]
)

docker_build(
    'customers',
    context='./customers',
    dockerfile='./customers/Dockerfile.customers.dev',
    live_update=[
        sync('./customers', '/app'),
        run(
            'pnpm install',
            trigger=['./customers/package.json']
        )
    ]
)

k8s_yaml(kustomize('./kustomize/environments/development', flags = ["--enable-alpha-plugins"]))
