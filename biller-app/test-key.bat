@echo off
echo Billify POS - Key Verification Test
echo =====================================
echo.
cd /d "%~dp0"
call venv\Scripts\activate.bat
python test_key_verification.py
echo.
pause
