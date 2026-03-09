@echo off
echo ================================================
echo Building Billify POS executable...
echo ================================================
cd /d "%~dp0"

REM Activate virtual environment
echo.
echo [1/4] Activating virtual environment...
call venv\Scripts\activate.bat

REM Clean previous build
echo [2/4] Cleaning previous build...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

REM Build with PyInstaller
echo [3/4] Building with PyInstaller...
pyinstaller Billify-POS.spec

REM Check if build succeeded
echo [4/4] Checking build status...
if exist dist\Billify-POS.exe (
    echo.
    echo ================================================
    echo SUCCESS! Executable created successfully!
    echo ================================================
    echo Location: dist\Billify-POS.exe
    echo.
    echo NOTE: Console mode is ENABLED for debugging.
    echo       You will see debug output when running.
    echo       To disable, edit Billify-POS.spec and
    echo       change console=True to console=False
    echo ================================================
) else (
    echo.
    echo ================================================
    echo ERROR! Build failed. Check output above.
    echo ================================================
)

echo.
pause
