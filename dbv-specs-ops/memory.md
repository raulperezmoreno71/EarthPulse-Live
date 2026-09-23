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
- **2026-09-23 — Perfil demo sin Docker:** PostgreSQL sigue siendo el objetivo de despliegue, pero el perfil predeterminado usa H2 persistente para que la demo funcione inmediatamente en equipos sin Docker. Flyway mantiene el mismo esquema en ambos perfiles.
- **2026-09-23 — Dashboard atómico:** El MVP sirve eventos, métricas, timeline y salud de fuentes en una sola respuesta filtrada. Esto evita estados visuales incoherentes y reduce coordinación en el frontend.
- **2026-09-23 — Separación de bundles visuales:** Leaflet y Recharts se cargan de forma diferida para que el shell inicial no dependa de los paquetes visuales más pesados.

## ⚠️ Lecciones aprendidas

- Spring `RestClient` no deserializó directamente el `application/geo+json` de USGS con la configuración inicial. Leer el cuerpo como texto y normalizarlo con Jackson conserva validación explícita y compatibilidad con ambos proveedores.
- El estado de una fuente debe separar “último intento” de “último éxito”. Un fallo temporal no debe borrar la frescura del último snapshot válido.
- En Windows, un lanzador opaco en segundo plano dificulta diagnosticar Maven y npm. Ventanas minimizadas con títulos estables permiten observar logs y detener exactamente sus árboles con `stop.cmd`.

## 🗺️ Mapa de relaciones

- `SourceClient` obtiene y valida datos externos.
- `EventNormalizer` traduce cada proveedor al dominio común.
- `SyncService` coordina upserts y registra `SyncRun`.
- `EventQueryService` alimenta una API coherente para mapa, métricas, feed y gráficas.
- React Query mantiene la frescura y Zod impide que respuestas inválidas alcancen los componentes.
- `AgentDiscoveryFilter` enlaza manifiesto y catálogo servidos desde el mismo origen del API.
