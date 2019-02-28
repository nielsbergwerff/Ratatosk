CALL npm run dist

SETLOCAL=ENABLEDELAYEDEXPANSION

CD dist\Ratatosk-0.0.1-win-x86

POWERSHELL -Command "(gc package.json) -replace 'html/index.html', 'index.html' | Out-File package.json"

DEL "CREATE EXE.bat"
DEL "Run Server.bat"
DEL "InstallerScript.nsi"
DEL "README.md"
DEL "config.json"
DEL "Ratatosk Installer.exe"

REN "js-client" "js"
MOVE /y html\*.* .

RD /s /q "html"
RD /s /q "js-server"

MAKENSIS ..\..\InstallerScript.nsi
