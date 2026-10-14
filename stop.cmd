@echo off
title Stop Inkora Processes
echo ==========================================================
echo    Stopping Inkora Full-Stack Services                    
echo ==========================================================
echo.
echo Stopping Java backend processes...
taskkill /F /IM java.exe 2>nul
echo Stopping Node frontend processes...
taskkill /F /IM node.exe 2>nul
echo.
echo [OK] All Inkora processes stopped.
pause
