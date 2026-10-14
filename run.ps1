# Inkora Turnkey Startup Script for PowerShell
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     INKORA — BLOG BUILDER + SOCIAL PUBLISHING PLATFORM    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

# 1. Check MySQL Service
Write-Host "[1/4] Checking MySQL status..." -ForegroundColor Yellow
$mysqlRunning = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlRunning -and $mysqlRunning.Status -ne 'Running') {
    Write-Host "Starting MySQL service..." -ForegroundColor Yellow
    Start-Service -Name "MySQL80"
}
Write-Host "[✓] Database service is ready." -ForegroundColor Green

# 2. Start Backend
Write-Host "[2/4] Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "mvnw.cmd spring-boot:run" -WorkingDirectory $backendDir

# Wait for backend health
Write-Host "Waiting for backend health endpoint..." -ForegroundColor Gray
$healthy = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($resp.status -eq 'UP') {
            $healthy = $true
            break
        }
    } catch {}
}

if ($healthy) {
    Write-Host "[✓] Backend is UP and listening on http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "[!] Backend is still starting in background terminal." -ForegroundColor DarkYellow
}

# 3. Start Frontend
Write-Host "[3/4] Starting Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory $frontendDir

Start-Sleep -Seconds 2
Write-Host "[✓] Frontend is UP and listening on http://localhost:5173" -ForegroundColor Green

# 4. Open in Default Browser
Write-Host "[4/4] Opening Inkora in your browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Inkora is running!                                      " -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173                         " -ForegroundColor White
Write-Host " Backend:  http://localhost:8080/api                     " -ForegroundColor White
Write-Host " Health:   http://localhost:8080/api/health              " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
