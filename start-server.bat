@echo off
echo ========================================
echo SGPA Prediction System - Server Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Starting SGPA Server...
echo.
echo Server will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server
node server.js

pause
