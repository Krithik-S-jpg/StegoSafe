@echo off
REM StegoSafe PWA - Local Development Server Launcher
REM This script starts a local HTTP server to test the PWA

cd /d "%~dp0"
echo.
echo ======================================
echo  StegoSafe - Image Steganography PWA
echo ======================================
echo.
echo Starting local HTTP server...
echo.
echo Open your browser and navigate to:
echo   http://localhost:8000/stegosafe/
echo.
echo Press Ctrl+C to stop the server.
echo.

REM Try to use Python 3 first
python -m http.server 8000 --directory "%~dp0\.."

REM If Python 3 fails, try Python 2
if errorlevel 1 (
    echo Python 3 not found, trying Python 2...
    python -m SimpleHTTPServer 8000
)
