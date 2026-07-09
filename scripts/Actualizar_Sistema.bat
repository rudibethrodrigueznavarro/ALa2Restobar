@echo off
echo ========================================================
echo Actualizando Sistema ALa2-Restobar a la ultima version
echo ========================================================
echo.
echo Paso 1: Descargando la version mas reciente de la nube...
docker compose -f ..\docker-compose.prod.yml pull app

echo.
echo Paso 2: Reiniciando el sistema con la nueva version...
docker compose -f ..\docker-compose.prod.yml up -d

echo.
echo ========================================================
echo ¡Actualizacion Completada Exitosamente!
echo La informacion y bases de datos se han mantenido intactas.
echo ========================================================
pause
