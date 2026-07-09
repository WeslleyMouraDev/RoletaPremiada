@echo off
title Roleta Premiada Hunter - Servidor Local
color 0A
echo.
echo =============================================
echo    ROLETA PREMIADA HUNTER
echo    Iniciando servidor local...
echo =============================================
echo.

IF NOT EXIST node_modules (
    echo [INFO] Instalando dependencias...
    call npm install
    IF ERRORLEVEL 1 (
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas!
    echo.
)

echo [INFO] Iniciando servidor de desenvolvimento...
echo [INFO] Acesse: http://localhost:5173
echo.
echo Pressione Ctrl+C para encerrar o servidor.
echo.
call npm run dev

pause
