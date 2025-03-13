REM filepath: c:\Users\John\Documents\imperial\pyqt6_calculator\build.bat
@echo off
setlocal

echo Building ICC Calculator...

REM Check if running with admin privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with admin privileges
) else (
    echo Please run as administrator
    pause
    exit /b 1
)

REM Deactivate any active virtual environment first
if defined VIRTUAL_ENV (
    call %VIRTUAL_ENV%\Scripts\deactivate.bat
)

REM Clean previous builds
echo Cleaning previous builds...
if exist "build" rmdir /s /q "build"
if exist "dist" rmdir /s /q "dist"
if exist "*.spec" del /s /q "*.spec"

REM Create fresh virtual environment
echo Creating fresh virtual environment...
if exist "venv" rmdir /s /q "venv"
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Upgrade pip and install dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt --no-cache-dir

REM Build executable
echo Building executable...
python build_exe.py

if errorlevel 1 (
    echo Build failed
    pause
    exit /b 1
)

echo Build complete! Check the dist folder for the executable.
pause
endlocal