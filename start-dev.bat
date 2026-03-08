@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo.
echo Starting development server...
echo Open http://localhost:4173 in your browser.
echo.
call npm run dev

pause
