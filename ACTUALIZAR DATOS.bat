@echo off
cd /d "%~dp0"
py -3 actualizar_datos.py
if errorlevel 1 (
  echo.
  echo No se pudieron actualizar los datos. Verifica que Python 3 este instalado y que los CSV esten en la carpeta data.
  pause
  exit /b 1
)
echo.
echo Listo. Ya podes abrir index.html con doble clic.
pause
