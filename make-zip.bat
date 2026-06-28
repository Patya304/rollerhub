@echo off
setlocal

cd /d "%~dp0"

echo.
echo RollerHub source ZIP keszitese...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '.\src', '.\prisma', '.\public', '.\package.json', '.\package-lock.json', '.\tsconfig.json', '.\next.config.ts', '.\components.json', '.\README.md', '.\CLAUDE.md', '.\AGENTS.md', '.\eslint.config.mjs', '.\postcss.config.mjs', '.\prisma.config.ts' -DestinationPath '.\rollerhub-source.zip' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo KESZ: rollerhub-source.zip letrehozva.
    echo Ezt kuldd fel ChatGPT-nek.
) else (
    echo.
    echo HIBA tortent a ZIP keszitese kozben.
)

echo.
pause