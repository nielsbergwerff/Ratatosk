call npm run dist
cd dist\Ratatosk-0.0.1-win-x86
del "CREATE EXE.bat"
del "InstallerScript.nsi"
del "README.md"
del "Ratatosk Installer.exe"
rmdir /s /q "js-server"
makensis ..\..\InstallerScript.nsi
