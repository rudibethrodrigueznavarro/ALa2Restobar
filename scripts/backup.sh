#!/bin/sh

# Directorio donde se guardarán los backups locales (mapeado a Windows)
BACKUP_DIR="/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

echo "Iniciando respaldo automático: $DATE"

# 1. Respaldo de Base de Datos PostgreSQL
echo "Exportando Base de Datos..."
pg_dump -h db -U postgres -d basedatos -F c -f "$BACKUP_DIR/db_backup_$DATE.dump"

# 2. Respaldo de Archivos MinIO (Imágenes)
echo "Comprimiendo archivos de MinIO..."
cd /minio_data
zip -r "$BACKUP_DIR/minio_backup_$DATE.zip" .

# 3. Limpieza de respaldos antiguos (Opcional, mantiene los últimos 7 días)
echo "Limpiando respaldos más antiguos de 7 días..."
find $BACKUP_DIR -name "*.dump" -type f -mtime +7 -exec rm {} \;
find $BACKUP_DIR -name "*.zip" -type f -mtime +7 -exec rm {} \;

echo "Respaldo completado con éxito."
