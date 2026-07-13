# start-dev.ps1 - starts the whole TechnoRetail stack in DEV mode.
# Run:   .\start-dev.ps1        (or right-click -> Run with PowerShell)
# Stop:  .\stop.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$srv  = Join-Path $root "server"

Write-Host "=== TechnoRetail: DEV start ===" -ForegroundColor Cyan

# 1) Docker Desktop
Write-Host "[1/4] Docker..." -ForegroundColor Yellow
$dockerOk = $false
try { docker info *> $null; $dockerOk = ($LASTEXITCODE -eq 0) } catch { $dockerOk = $false }
if (-not $dockerOk) {
  $dd = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dd) {
    Write-Host "  Starting Docker Desktop, waiting for the daemon..."
    Start-Process $dd
    for ($i = 0; $i -lt 60; $i++) {
      Start-Sleep -Seconds 3
      try { docker info *> $null; if ($LASTEXITCODE -eq 0) { $dockerOk = $true; break } } catch {}
    }
  }
  if (-not $dockerOk) { Write-Host "  Docker is not available. Start Docker Desktop manually and re-run." -ForegroundColor Red; exit 1 }
}
Write-Host "  Docker is ready." -ForegroundColor Green

# 2) MySQL (container has restart=unless-stopped, usually already up)
Write-Host "[2/4] MySQL (docker compose up -d)..." -ForegroundColor Yellow
Push-Location $root
docker compose up -d | Out-Null
Pop-Location
for ($i = 0; $i -lt 40; $i++) {
  $status = (docker inspect --format "{{.State.Health.Status}}" singitronic_mysql 2>$null)
  if ($status -eq "healthy") { break }
  Start-Sleep -Seconds 2
}
Write-Host ("  MySQL: " + (docker inspect --format "{{.State.Health.Status}}" singitronic_mysql 2>$null)) -ForegroundColor Green

# 3) Backend (:3001) in its own window
Write-Host "[3/4] Backend (node app.js, :3001)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k","node app.js" -WorkingDirectory $srv
Start-Sleep -Seconds 3

# 4) Frontend dev (:3000) in its own window
Write-Host "[4/4] Frontend dev (npm run dev, :3000)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k","npm run dev" -WorkingDirectory $root

Write-Host ""
Write-Host "Ready. Open http://localhost:3000  (backend: http://localhost:3001)" -ForegroundColor Cyan
Write-Host "Backend and frontend run in separate terminal windows - keep them open." -ForegroundColor Cyan
