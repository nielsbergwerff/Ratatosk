OutFile "Ratatosk Installer.exe"

Var dir

Section
StrCpy $dir $EXEPATH
StrLen $0 $EXEFILE
StrCpy $dir $dir -$0
StrCpy $dir $dir"/Ratatosk"
SectionEnd

InstallDir $dir

Section
StrCpy $INSTDIR $dir
SetOutPath $INSTDIR
File /r "Ratatosk-win-x86"
WriteUninstaller $INSTDIR\uninstaller.exe
FindFirst $0 $1 $INSTDIR\dist\Ratatosk-win-x86\*.*
loop:
  StrCmp $1 "" done
  rename $INSTDIR\dist\Ratatosk-win-x86\$1 $INSTDIR\$1
  FindNext $0 $1
  Goto loop
done:
FindClose $0
RMDir /r $INSTDIR\dist
SectionEnd

Section "Uninstall"
Delete $INSTDIR\uninstaller.exe
RMDir /r $INSTDIR
SectionEnd
