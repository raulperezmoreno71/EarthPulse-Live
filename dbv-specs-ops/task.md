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

## Context Snapshot

> **Última actualización:** 2026-09-23
> **Punto exacto:** ciclo Spec → Ship completado en `v0.1.0`; arranque y parada verificados de extremo a extremo.
> **Pendiente:** ninguno para la entrega inicial.
> **Próximo paso:** demostración local o publicación en un repositorio remoto cuando el autor lo decida.
