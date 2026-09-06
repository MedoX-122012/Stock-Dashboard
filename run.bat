@echo off
SETLOCAL
cd /d "%~dp0"
echo ==========================================
echo  MarketPulse - Real-Time Stock Dashboard
echo ==========================================

if not exist node_modules (
    echo [1/2] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencies OK.
)

echo [2/2] Starting dev server...
echo       http://localhost:5173
echo       Press Ctrl+C to stop.
echo.

call npm run dev -- --open

pause
