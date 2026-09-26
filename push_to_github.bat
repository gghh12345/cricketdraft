@echo off
echo Configuring Git...
set PATH=%PATH%;C:\Program Files\Git\cmd
cd c:\Users\Welcome\Desktop\AIM

echo Setting repository URL to gghh12345/cricketdraft...
git remote set-url origin https://github.com/gghh12345/cricketdraft.git

echo.
echo ========================================================
echo A NEW GITHUB LOGIN WINDOW WILL POP UP NEXT.
echo PLEASE LOG IN USING THE 'gghh12345' ACCOUNT TO AUTHORIZE!
echo ========================================================
echo.
git push -u origin main --force
echo.
pause
