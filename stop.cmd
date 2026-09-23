@echo off
setlocal
cd /d "%~dp0"

taskkill /FI "WINDOWTITLE eq EarthPulse API*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq EarthPulse UI*" /T /F >nul 2>nul

echo [EarthPulse] Procesos detenidos.
endlocal
