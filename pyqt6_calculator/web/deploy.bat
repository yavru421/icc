@echo off
echo Deploying to GitHub Pages...

REM Create or clean dist directory
if exist "dist" rmdir /s /q dist
mkdir dist

REM Create assets directory in dist
mkdir dist\assets

REM Copy web files to dist
xcopy /Y index.html dist\
xcopy /Y styles.css dist\
xcopy /Y app.js dist\
xcopy /Y manifest.json dist\
xcopy /Y service-worker.js dist\

REM Copy assets if they exist (create dummy logo if not)
if not exist "assets" mkdir assets
if not exist "assets\logo.png" (
    echo Creating placeholder logo...
    copy nul assets\logo.png
)
if not exist "assets\logo-192.png" copy assets\logo.png assets\logo-192.png
if not exist "assets\logo-512.png" copy assets\logo.png assets\logo-512.png
xcopy /Y /E /I assets dist\assets

REM Initialize git in dist
cd dist
git init
git config user.email "dondlingergeneralcontracting@gmail.com"
git config user.name "yavru421"

REM Create and switch to gh-pages branch directly
git checkout --orphan gh-pages

REM Add and commit changes
git add .
git commit -m "Initial web app deployment"

REM Add GitHub remote and push
git remote add origin https://github.com/yavru421/icc.git
git push -f origin gh-pages

echo Deployment complete!
cd ..
