# Dashboard de Impacto Digital — Asociación Deportiva Club Sport Herediano

Dashboard estático de Facebook e Instagram, preparado para abrirse directamente con doble clic en `index.html`. **No necesita iniciar un servidor, usar un archivo BAT para abrirlo ni tener conexión a internet para mostrar los datos incluidos.**

## Período
29 de septiembre de 2025 al 31 de octubre de 2026.

## Abrir el dashboard
1. Descomprimí toda la carpeta.
2. Abrí `index.html` con doble clic.
3. Los datos ya están integrados en `js/data.js`; no se hace ninguna solicitud `fetch` a archivos CSV, por lo que no aparece el error `Failed to fetch` al abrirlo localmente.

## Cómo actualizarlo en el futuro
Los CSV originales están en `data/`. Para incorporar nuevas exportaciones de Meta Business Suite:

1. Reemplazá los CSV correspondientes dentro de `data/`, conservando los nombres de archivo.
2. Ejecutá `ACTUALIZAR DATOS.bat` una sola vez. Este archivo **solo convierte los CSV en datos JavaScript**; no inicia un servidor ni deja una ventana de servidor abierta.
3. Abrí `index.html` con doble clic para revisar el dashboard.
4. En GitHub Desktop, hacé Commit y Push para publicar los cambios.

El actualizador requiere Python 3 instalado en Windows. Si no lo tenés, los datos actuales ya están integrados y el dashboard funciona sin instalar nada; para futuras actualizaciones se puede generar `js/data.js` con el mismo script desde otro equipo con Python.

## Criterios de lectura
- Visualizaciones, interacciones, visitas y clics: se suman los registros diarios de ambas plataformas.
- Seguidores: el dashboard suma los valores diarios exportados; no debe interpretarse como el tamaño actual de la comunidad. La exportación de Instagram recibida comienza el 12/11/2025.
- Espectadores: se muestra la suma de los valores diarios reportados; no representa personas únicas durante todo el período.
- El período inicia el 29/09/2025. Los datos del 28/09/2025 que aparecen en algunas exportaciones se excluyen.

## Archivos principales
- `index.html`: dashboard.
- `assets/escudo-club-sport-herediano.png`: escudo transparente proporcionado.
- `css/styles.css`: estilos.
- `js/app.js`: gráficos, cálculos y presentación.
- `js/data.js`: datos integrados para funcionamiento local sin servidor.
- `data/`: CSV originales.
- `actualizar_datos.py` y `ACTUALIZAR DATOS.bat`: actualización de datos desde los CSV.
