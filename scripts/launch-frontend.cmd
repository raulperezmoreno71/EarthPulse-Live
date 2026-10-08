@echo off
cd /d "%~dp0..\frontend"
if not exist node_modules (
  call npm.cmd ci || exit /b 1
)
call npm.cmd run dev -- --host 127.0.0.1 --strictPort
