@echo off
setlocal
cd /d "%~dp0"

where java >nul 2>nul || (echo [EarthPulse] Java no esta disponible. & exit /b 1)
where node >nul 2>nul || (echo [EarthPulse] Node.js no esta disponible. & exit /b 1)

start "EarthPulse API" /min "%ComSpec%" /d /k call "%~dp0scripts\launch-backend.cmd"
start "EarthPulse UI" /min "%ComSpec%" /d /k call "%~dp0scripts\launch-frontend.cmd"

echo [EarthPulse] Iniciado: http://localhost:5173
echo [EarthPulse] API y UI se ejecutan en ventanas minimizadas.
endlocal
