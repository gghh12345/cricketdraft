@echo off
echo Initializing Git repository...
cd c:\Users\Welcome\Desktop\AIM
git init
git add .
git commit -m "Initial commit of Cricket Draft Game"
git branch -M main
git remote add origin https://github.com/gghh12345/cricketdraft.git
echo.
echo Pushing to GitHub...
echo A window will pop up asking you to log into GitHub. Please authorize it.
git push -u origin main
echo.
pause
