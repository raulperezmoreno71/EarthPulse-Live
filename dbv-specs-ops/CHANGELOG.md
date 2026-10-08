# Changelog

Todos los cambios relevantes de EarthPulse Live se documentan aquí siguiendo versionado semántico.

## [Sin publicar]

### Added

- Atlas mundial vectorial local y detalle cartográfico opcional sin clave.
- Nueva composición responsive con hero editorial, métricas, distribución de fenómenos, leyenda y paneles rediseñados.
- Ordenación de eventos por fecha o prioridad, carga incremental, filtro de prioridad baja y atajos temporales.
- README completo en español con arquitectura, tecnologías, arranque, configuración, uso y límites.
- Pruebas del atlas incluido y validación de coordenadas y enlaces externos.

### Fixed

- Eliminada la dependencia obligatoria de las teselas CARTO que muestran “API key required”.
- La serie temporal incluye días sin eventos para no unir puntos separados como actividad continua.
- Arranque limpio del frontend con instalación automática de dependencias si faltan.

### Security

- Coordenadas geográficas acotadas y enlaces de origen restringidos a HTTP(S) en ingesta y frontera del cliente.
- Auditoría npm sin vulnerabilidades conocidas en dependencias de producción.

### Known limitations

- La auditoría visual interactiva en navegador sigue pendiente porque la sesión no dispone de navegador controlable; se verificaron compilación, pruebas y servicios HTTP.

## [0.1.0] - 2026-09-23

### Added

- Especificación funcional, arquitectura y sistema de diseño iniciales.
- Plan de implementación para la ingesta de datos reales de USGS y NASA EONET.
- Backend Spring Boot con dominio normalizado, persistencia Flyway, perfiles PostgreSQL/H2 y sincronización programada.
- Clientes reales de USGS GeoJSON y NASA EONET con upsert idempotente, trazabilidad y tolerancia a fallo parcial.
- API de dashboard filtrable con eventos, resumen, actividad temporal y salud de fuentes.
- Interfaz React/TypeScript responsive con mapa global, clustering, métricas, filtros, feed, detalle y gráfica.
- Agent Readiness con OpenAPI, `llms.txt`, catálogo, manifiesto y cabeceras `Link`.
- Docker Compose, variables de ejemplo y scripts de arranque/parada para Windows, macOS y Linux.

### Fixed

- Compatibilidad de USGS `application/geo+json` mediante parseo explícito con Jackson.
- Conservación de la última sincronización correcta cuando el intento más reciente de una fuente falla.
- Lanzador de Windows verificable con procesos titulados y parada limpia de sus árboles.

### Security

- Límites y validación de parámetros de consulta, CORS acotado y ausencia de endpoints públicos de escritura o sincronización.
- Auditoría de secretos y dependencias; `npm audit` no reportó vulnerabilidades.
