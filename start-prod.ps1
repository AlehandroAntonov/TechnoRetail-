# start-prod.ps1 - starts the TechnoRetail stack in PROD mode (fast).
# Makes a production build and runs "next start".
# NOTE: the build needs the backend stopped (otherwise the Prisma DLL is locked).
# Run:   .\start-prod.ps1           (rebuild + start)
#        .\start-prod.ps1 -NoBuild  (skip build if .next already exists)

param([switch]$NoBuild)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$srv  = Join-Path $root "server"

Write-Host "=== TechnoRetail: PROD start ===" -ForegroundColor Cyan

# 1) Docker + MySQL
Write-Host "[1/5] Docker + MySQL..." -ForegroundColor Yellow
$dockerOk = $false
try { docker info *> $null; $dockerOk = ($LASTEXITCODE -eq 0) } catch { $dockerOk = $false }
if (-not $dockerOk) {
  $dd = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dd) {
    Start-Process $dd
    for ($i = 0; $i -lt 60; $i++) { Start-Sleep -Seconds 3; try { docker info *> $null; if ($LASTEXITCODE -eq 0) { $dockerOk = $true; break } } catch {} }
  }
  if (-not $dockerOk) { Write-Host "  Docker is not available." -ForegroundColor Red; exit 1 }
}
Push-Location $root; docker compose up -d | Out-Null; Pop-Location
for ($i = 0; $i -lt 40; $i++) { if ((docker inspect --format "{{.State.Health.Status}}" singitronic_mysql 2>$null) -eq "healthy") { break }; Start-Sleep -Seconds 2 }
Write-Host "  MySQL is ready." -ForegroundColor Green

# 2) Stop old backend (free the Prisma engine dll for the build)
Write-Host "[2/5] Stopping previous backend..." -ForegroundColor Yellow
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like "*app.js*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 3) Build
if (-not $NoBuild) {
  Write-Host "[3/5] npm run build (may take ~1 min)..." -ForegroundColor Yellow
  Push-Location $root
  & npm run build
  $code = $LASTEXITCODE
  Pop-Location
  if ($code -ne 0) { Write-Host "  Build failed (exit $code)." -ForegroundColor Red; exit 1 }
  Write-Host "  Build OK." -ForegroundColor Green
} else {
  Write-Host "[3/5] Build skipped (-NoBuild)." -ForegroundColor Yellow
}

# 4) Backend
Write-Host "[4/5] Backend (node app.js, :3001)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k","node app.js" -WorkingDirectory $srv
Start-Sleep -Seconds 3

# 5) Frontend prod
Write-Host "[5/5] Frontend prod (next start, :3000)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k","npx next start" -WorkingDirectory $root

Write-Host ""
Write-Host "Ready. http://localhost:3000  (backend :3001)" -ForegroundColor Cyan
