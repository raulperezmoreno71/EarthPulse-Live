# Backlog — EarthPulse Live

## Contexto del proyecto

- **Objetivo:** Panel geoespacial visual con eventos naturales reales de USGS y NASA EONET.
- **Estado actual:** Completado y publicado localmente como `v0.1.0`.
- **Stack:** React + TypeScript + Vite; Java 21 + Spring Boot; PostgreSQL + Flyway.
- **Prioridad:** Calidad arquitectónica y visual por encima del límite inicial de 90 minutos.

## Checklist

- [x] Instalar dbv-specs-ops de forma aislada.
- [x] Completar identidad, especificaciones, arquitectura y diseño.
- [x] Ejecutar revisión adversarial del plan.
- [x] Crear `implementation_plan.md` con riesgos y rollback.
- [x] Obtener aprobación explícita del plan y de `git init`.
- [x] Verificar toolchain local y fijar dependencias.
- [x] Crear PostgreSQL, migraciones y dominio backend.
- [x] Integrar USGS y NASA EONET con tolerancia a fallos.
- [x] Exponer API REST, métricas y estado de fuentes.
- [x] Construir el sistema visual React y sus estados.
- [x] Implementar mapa, filtros, detalle y gráficas.
- [x] Añadir Agent Readiness y scripts multiplataforma.
- [x] Ejecutar pruebas, build, revisión estática visual y auditoría de seguridad.
- [x] Seleccionar versión, cerrar CHANGELOG, commit y tag de entrega.

## Deuda técnica

- Evaluar PostGIS solo si se incorporan consultas espaciales avanzadas; no añadirlo por anticipación.
- Considerar bloqueo distribuido de tareas si se despliega más de una instancia.

## Ciclo activo — mejora visual y mapa sin clave (2026-10-08)

- [x] Confirmar causa del error cartográfico y revisar especificación y arquitectura.
- [x] Integrar atlas local Natural Earth y retirar CARTO.
- [x] Añadir capa opcional de calles, controles de mapa y estados robustos.
- [x] Mejorar composición visual, legibilidad, frescura, filtros y exploración de eventos.
- [x] Auditar fronteras backend y seguridad de enlaces de origen.
- [x] Ejecutar pruebas, build, auditoría de dependencias y comprobación HTTP con datos reales.
- [ ] Completar inspección visual interactiva en escritorio y móvil cuando haya navegador conectado.
- [x] Actualizar README de uso, memoria, changelog y walkthrough.

## Context Snapshot

> **Última actualización:** 2026-10-08
> **Punto exacto:** atlas local, rediseño, mejoras de exploración, seguridad de feeds y README implementados; comprobaciones automáticas y HTTP correctas.
> **Pendiente:** inspección visual interactiva en navegador y decisión de versión para la siguiente entrega.
> **Próximo paso:** revisar en escritorio/móvil, cerrar los retoques derivados y seleccionar versión (recomendación: minor).
