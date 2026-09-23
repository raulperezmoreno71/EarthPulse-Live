# Changelog

Todos los cambios relevantes de EarthPulse Live se documentan aquí siguiendo versionado semántico.

## [Sin publicar]

Sin cambios todavía.

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
