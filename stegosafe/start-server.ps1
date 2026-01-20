# StegoSafe PWA - Local Development Server Launcher (PowerShell)
# This script starts a local HTTP server to test the PWA

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  StegoSafe - Image Steganography PWA" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting local HTTP server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Open your browser and navigate to:" -ForegroundColor Green
Write-Host "  http://localhost:8000/stegosafe/" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

# Get the parent directory
$parentDir = Split-Path -Parent (Get-Location)

# Try to use Python 3 first
try {
    Write-Host "Attempting to start Python 3 HTTP server..." -ForegroundColor Yellow
    python -m http.server 8000 --directory $parentDir
} catch {
    # If Python 3 fails, try Python 2
    try {
        Write-Host "Python 3 not found, trying Python 2..." -ForegroundColor Yellow
        python -m SimpleHTTPServer 8000
    } catch {
        Write-Host "Error: Python not found on this system." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install Python or use another HTTP server:" -ForegroundColor Yellow
        Write-Host "  - Node.js: npx http-server stegosafe -p 8000" -ForegroundColor Gray
        Write-Host "  - Ruby: ruby -run -ehttpd . -p 8000" -ForegroundColor Gray
        Write-Host "  - PHP: php -S localhost:8000" -ForegroundColor Gray
    }
}
