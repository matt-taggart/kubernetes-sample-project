config.define_string_list("args", args=True)
cfg = config.parse()
args = cfg.get('args', [])

isDev = 'dev' in args
baseUrl = 'localhost:5001/' if isDev else 'mtaggart89/k8s-sample-project-' 
env = 'dev' if isDev else 'prod'

docker_build(
    baseUrl + 'client',
    context='./client',
    dockerfile='./client/Dockerfile.client.' + env,
    live_update=[
        sync('./client', '/app'),
        run(
            'pnpm install',
            trigger=['./client/package.json']
        )
    ]
)

docker_build(
    baseUrl + 'server',
    context='./server',
    dockerfile='./server/Dockerfile.server.' + env,
    live_update=[
        sync('./server', '/app'),
        run(
            'pnpm install',
            trigger=['./server/package.json']
        )
    ]
)

docker_build(
    baseUrl + 'customers',
    context='./customers',
    dockerfile='./customers/Dockerfile.customers.' + env,
    live_update=[
        sync('./customers', '/app'),
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
