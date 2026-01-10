$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$backendEnv = Join-Path $backend ".env.local"

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$backend`"; `$env:DOTENV_CONFIG_PATH=`"$backendEnv`"; npm install; npm run dev"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$frontend`"; npm install; npm run dev"
)
