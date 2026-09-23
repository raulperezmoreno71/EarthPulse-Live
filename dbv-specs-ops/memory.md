# Memoria del proyecto — EarthPulse Live

## Contexto activo

- Producto: panel geoespacial de eventos naturales reales, pensado para una demostración muy visual.
- Autor: Raúl Pérez Moreno.
- Preferencias: React + TypeScript, Java + Spring Boot y PostgreSQL; se prioriza calidad sobre rapidez.
- Fuentes: USGS Earthquake GeoJSON y NASA EONET v3.

## 🏗️ Log de decisiones técnicas

- **2026-09-23 — Stack full-stack tipado:** React/TypeScript y Spring Boot/Java mantienen las tecnologías cómodas para el usuario y permiten una arquitectura profesional sin introducir un stack ajeno por una optimización prematura de tiempo.
- **2026-09-23 — PostgreSQL sin PostGIS inicial:** El MVP necesita coordenadas e índices, pero no consultas geométricas complejas. Se evita PostGIS hasta que exista un requisito espacial que lo justifique.
- **2026-09-23 — Normalización con trazabilidad:** Los eventos se almacenan en un modelo común, conservando fuente, identificador externo, URL y frescura para no presentar inferencias como hechos oficiales.
- **2026-09-23 — Consistencia eventual aceptada:** “Cercano al tiempo real” depende de la frecuencia y curación de USGS/NASA EONET. La interfaz mostrará la última sincronización y conservará el último snapshot válido ante fallos.
- **2026-09-23 — Sin sincronización pública manual:** La ingesta se programa en backend; se evita un endpoint público que pueda amplificar tráfico hacia proveedores externos.

## ⚠️ Lecciones aprendidas

- Ninguna todavía; la implementación no ha comenzado.

## 🗺️ Mapa de relaciones

- `SourceClient` obtiene y valida datos externos.
- `EventNormalizer` traduce cada proveedor al dominio común.
- `SyncService` coordina upserts y registra `SyncRun`.
- `EventQueryService` alimenta una API coherente para mapa, métricas, feed y gráficas.
- React Query mantiene la frescura y Zod impide que respuestas inválidas alcancen los componentes.
