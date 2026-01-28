@echo off
REM HORUS Governance Daily Scan Launcher
REM Authoritative entry point

set BASE_DIR=G:\我的雲端硬碟\HORUS-GOVERNANCE
set REPORT_DIR=G:\我的雲端硬碟\HORUS-DERIVED\reports

echo ==========================================
echo HORUS Governance Scan - %DATE% %TIME%
echo ==========================================

cd /d %BASE_DIR%\scripts

REM 1. Run Node.js Scanner
npm run scan

REM 2. Log completion
echo Scan completed at %DATE% %TIME% >> %REPORT_DIR%\scan-history.log

exit /b 0
