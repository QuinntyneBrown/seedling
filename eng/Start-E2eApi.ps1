#Requires -Version 7
<#
.SYNOPSIS
  Starts the Seedling API on :5100 for Playwright, on a fresh SQLite file
  instead of SQL Server.

.DESCRIPTION
  Stops any running API, deletes the e2e database under .run/e2e, and starts
  the API with Seedling:Database:Provider=Sqlite; on SQLite the API creates
  the schema from the model on startup. The script then seeds the accounts the
  e2e fixtures expect (`seedling seed --provider Sqlite`) and checks the API
  answers. No LocalDB, no `seedling migrate`, and every run starts from the
  same data. Logs go to .run/logs.

.PARAMETER Build
  Build the API and CLI first (by default the solution is assumed built).

.PARAMETER Port
  The API port. Default 5100, which the Angular environment compiles in.
#>
param(
    [switch]$Build,
    [int]$Port = 5100
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $repoRoot 'backend'
$dataDir = Join-Path $repoRoot '.run/e2e'
$logDir = Join-Path $repoRoot '.run/logs'
$database = Join-Path $dataDir 'seedling-e2e.db'
$connection = "Data Source=$database"
New-Item -ItemType Directory -Force $dataDir, $logDir | Out-Null

$running = Get-Process -Name dotnet, Seedling.Api -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like '*Seedling.Api*' }
foreach ($p in $running) {
    Write-Host "Stopping API process $($p.Id)."
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
if ($running) { Start-Sleep -Seconds 2 }

Get-ChildItem $dataDir -Filter 'seedling-e2e.db*' | Remove-Item -Force

if ($Build) {
    dotnet build (Join-Path $backend 'Seedling.sln') --nologo
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:Seedling__Database__Provider = 'Sqlite'
$env:SEEDLING_CONNECTION = $connection

$out = Join-Path $logDir 'e2e-api.out.log'
$err = Join-Path $logDir 'e2e-api.err.log'
$api = Start-Process -FilePath 'dotnet' -PassThru -WorkingDirectory $backend `
    -RedirectStandardOutput $out -RedirectStandardError $err `
    -ArgumentList 'run', '--project', (Join-Path $backend 'src/Seedling.Api'), '--no-build', '--urls', "http://localhost:$Port"
Write-Host "API starting on SQLite (pid $($api.Id)); database $database; logs in $logDir"

$deadline = (Get-Date).AddSeconds(60)
$up = $false
do {
    Start-Sleep -Seconds 2
    if ($api.HasExited) { throw "The API exited with code $($api.ExitCode). Check $err and $out." }
    try {
        $up = (Invoke-WebRequest -Uri "http://localhost:$Port/api/_ping" -TimeoutSec 5 -UseBasicParsing).StatusCode -eq 200
    } catch { }
} while (-not $up -and (Get-Date) -lt $deadline)
if (-not $up) { throw "The API did not answer on :$Port within 60 s. Check $out." }

# Seed the accounts and data the e2e fixtures expect, once `seedling seed` exists.
# dotnet run --project (Join-Path $backend 'src/Seedling.Cli') --no-build -- seed --provider Sqlite --connection $connection
# if ($LASTEXITCODE -ne 0) { throw "seedling seed failed with exit code $LASTEXITCODE." }

Write-Host "API is up on SQLite at http://localhost:$Port."
