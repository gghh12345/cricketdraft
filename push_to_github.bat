@echo off
echo Configuring Git...
set PATH=%PATH%;C:\Program Files\Git\cmd
cd c:\Users\Welcome\Desktop\AIM

echo Setting repository URL to gghh12345/cricketdraft...
git remote set-url origin https://github.com/gghh12345/cricketdraft.git

echo Staging and committing changes...
git add -A
git commit -m "Fix room creation, Render crash, and socket connectivity"

echo.
echo ========================================================
echo PUSHING TO GITHUB (gghh12345/cricketdraft)...
echo A GitHub authorization prompt may appear if needed.
echo ========================================================
echo.
git push -u origin main --force
echo.
echo ========================================================
echo PUSH SUCCESSFUL! Render will auto-deploy the update.
echo ========================================================
pause
