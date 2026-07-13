# stop.ps1 - stops backend and frontend (leaves the MySQL container running).
# To stop the DB too:  .\stop.ps1 -Db

param([switch]$Db)

$root = $PSScriptRoot

Write-Host "Stopping backend (app.js) and frontend (next)..." -ForegroundColor Yellow
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like "*app.js*" -or $_.CommandLine -like "*next*" } |
  ForEach-Object {
    Write-Host ("  stop PID " + $_.ProcessId)
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

if ($Db) {
  Write-Host "Stopping MySQL container..." -ForegroundColor Yellow
  Push-Location $root; docker compose stop | Out-Null; Pop-Location
}

Write-Host "Done." -ForegroundColor Green
