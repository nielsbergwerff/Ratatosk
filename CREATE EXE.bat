CALL npm install nwjs-builder-phoenix -D
CALL npm run dist

RD /s /q .\dist\Ratatosk-win-x86
MOVE .\dist\Ratatosk-1.0.0-win-x86 .\dist\Ratatosk-win-x86
CD dist\Ratatosk-win-x86 || exit /b

POWERSHELL -Command "(gc package.json) -replace 'html/index.html', 'index.html' | Out-File package.json" -Encoding UTF8
DEL "CREATE EXE.bat"
DEL "RUN SERVER.bat"
DEL "InstallerScript.nsi"
DEL "README.md"
DEL "config.json"
DEL "Ratatosk Installer.exe"

REN "js-client" "js"
MOVE /y html\*.* .

RD /s /q "html"
RD /s /q "js-server"

MAKENSIS ..\..\InstallerScript.nsi
