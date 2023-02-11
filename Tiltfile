docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/client',
    context='./client',
    dockerfile='./client/Dockerfile.dev',
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
    context='./nest-server',
    dockerfile='./nest-server/Dockerfile.dev',
    live_update=[
        sync('./nest-server', '/app'),
        run(
            'pnpm install',
            trigger=['./nest-server/package.json']
        )
    ]
)

docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/customers',
    context='./customers-microservice',
    dockerfile='./customers-microservice/Dockerfile.dev',
    live_update=[
        sync('./customers-microservice', '/app'),
        run(
            'pnpm install',
            trigger=['./customers-microservice/package.json']
        )
    ]
)

docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/auth',
    context='./auth-microservice',
    dockerfile='./auth-microservice/Dockerfile.dev',
    live_update=[
        sync('./auth-microservice', '/app'),
        run(
            'pnpm install',
            trigger=['./auth-microservice/package.json']
        )
    ]
)

docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/greetings',
    context='./greetings-microservice',
    dockerfile='./greetings-microservice/Dockerfile.dev',
    live_update=[
        sync('./greetings-microservice', '/app'),
        run(
            'pnpm install',
            trigger=['./greetings-microservice/package.json']
        )
    ]
)

docker_build(
    'us-west2-docker.pkg.dev/elegant-tangent-374007/card-couture/images',
    context='./images-microservice',
    dockerfile='./images-microservice/Dockerfile.dev',
    live_update=[
        sync('./images-microservice', '/app'),
        run(
            'pnpm install',
            trigger=['./images-microservice/package.json']
        )
    ]
)

k8s_yaml(kustomize('./kustomize/environments/development', flags = ["--enable-alpha-plugins"]))
secret_settings(disable_scrub = True)
