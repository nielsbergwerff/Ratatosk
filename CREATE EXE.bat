CALL npm install nwjs-builder-phoenix -D
CALL npm run dist

CD dist\Ratatosk-win || exit /b

REN "js-client" "js"
MOVE /y html\*.* .

RD /s /q "html"

POWERSHELL -Command "(gc package.json) -replace 'html/index.html', 'index.html' | Out-File package.json -Encoding UTF8"
POWERSHELL -Command "(gc index.html) -replace '/socket.io/socket.io.js', './node_modules/socket.io-client/dist/socket.io.js' | Out-File index.html -Encoding UTF8"

MAKENSIS ..\..\InstallerScript.nsi
