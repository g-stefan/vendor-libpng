@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set ACTION=%1
if "%1" == "" set ACTION=make

echo -^> %ACTION% vendor-libpng

goto StepX
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:StepX

call :cmdX xyo-cc --mode=%ACTION% --source-has-archive libpng

copy /Y /B source\scripts\pnglibconf.h.prebuilt source\pnglibconf.h

if not exist output\ mkdir output
if not exist output\include\ mkdir output\include
if not exist output\include\pngconf.h copy source\pngconf.h output\include\pngconf.h
if not exist output\include\pnglibconf.h copy source\pnglibconf.h output\include\pnglibconf.h
if not exist output\include\png.h copy source\png.h output\include\png.h
if not exist output\include\pnginfo.h copy source\pnginfo.h output\include\pnginfo.h
if not exist output\include\pngstruct.h copy source\pngstruct.h output\include\pngstruct.h

call :cmdX xyo-cc --mode=%ACTION% @build/source/libpng.static.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/libpng.dynamic.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/pngtest.compile
