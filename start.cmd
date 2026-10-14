@echo off
title Inkora - Blog Builder + Social Publishing Platform
echo ==========================================================
echo    INKORA — BLOG BUILDER + SOCIAL PUBLISHING PLATFORM     
echo ==========================================================
echo.
echo Starting Backend (Spring Boot 3 + Java 21) on Port 8080...
start "Inkora Backend (8080)" cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo Starting Frontend (React + Vite) on Port 5173...
start "Inkora Frontend (5173)" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting 5 seconds before opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173
echo.
echo ==========================================================
echo  Inkora full-stack application launched successfully!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080
echo ==========================================================
pause
