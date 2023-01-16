docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client',
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
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/server',
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
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers',
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

docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth',
    context='./auth',
    dockerfile='./auth/Dockerfile.auth.dev',
    live_update=[
        sync('./auth', '/app'),
        run(
            'pnpm install',
            trigger=['./auth/package.json']
        )
    ]
)

k8s_yaml(kustomize('./kustomize/environments/development', flags = ["--enable-alpha-plugins"]))
