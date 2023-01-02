config.define_string_list("args", args=True)
cfg = config.parse()
args = cfg.get('args', [])

isDev = 'dev' in args
baseUrl = 'localhost:5001/' if isDev else 'mtaggart89/k8s-sample-project-' 
env = 'dev' if isDev else 'prod'
ingressEnabled = 'false' if isDev else 'true'

docker_build(
    baseUrl + 'client',
    context='.',
    dockerfile='./docker/Dockerfile.client.' + env,
    live_update=[
        sync('./client', '/app/client'),
        run(
            'pnpm install',
            trigger=['./client/package.json']
        )
    ]
)

docker_build(
    baseUrl + 'server',
    context='.',
    dockerfile='./docker/Dockerfile.server.' + env,
    only=['./server/'],
    live_update=[
        sync('./server', '/app/server'),
        run(
            'pnpm install',
            trigger=['./server/package.json']
        )
    ]
)

docker_build(
    baseUrl + 'customers',
    context='.',
    dockerfile='./docker/Dockerfile.customers.' + env,
    live_update=[
        sync('./customers', '/app/customers'),
        run(
            'pnpm install',
            trigger=['./customers/package.json']
        )
    ]
)

yaml = helm(
  './deploy',
  name='deploy',
  values=['./deploy/values.' + env + '.yaml'],
  set=['ingress.enabled=true']
  )
k8s_yaml(yaml)

k8s_resource('client-deployment', port_forwards=3000)
