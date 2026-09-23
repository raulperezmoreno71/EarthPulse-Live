# Backlog — EarthPulse Live

## Contexto del proyecto

- **Objetivo:** Panel geoespacial visual con eventos naturales reales de USGS y NASA EONET.
- **Estado actual:** Especificación y plan preparados; implementación bloqueada por el gate de aprobación.
- **Stack:** React + TypeScript + Vite; Java 21 + Spring Boot; PostgreSQL + Flyway.
- **Prioridad:** Calidad arquitectónica y visual por encima del límite inicial de 90 minutos.

## Checklist

- [x] Instalar dbv-specs-ops de forma aislada.
- [x] Completar identidad, especificaciones, arquitectura y diseño.
- [x] Ejecutar revisión adversarial del plan.
- [x] Crear `implementation_plan.md` con riesgos y rollback.
- [ ] Obtener aprobación explícita del plan y de `git init`.
- [ ] Verificar toolchain local y fijar dependencias.
- [ ] Crear PostgreSQL, migraciones y dominio backend.
- [ ] Integrar USGS y NASA EONET con tolerancia a fallos.
- [ ] Exponer API REST, métricas y estado de fuentes.
- [ ] Construir el sistema visual React y sus estados.
- [ ] Implementar mapa, filtros, detalle y gráficas.
- [ ] Añadir Agent Readiness y scripts multiplataforma.
- [ ] Ejecutar pruebas, revisión visual y auditoría de seguridad.
- [ ] Completar entrega y documentación.

## Deuda técnica

- Evaluar PostGIS solo si se incorporan consultas espaciales avanzadas; no añadirlo por anticipación.
- Considerar bloqueo distribuido de tareas si se despliega más de una instancia.

## Context Snapshot

> **Última actualización:** 2026-09-23
> **Punto exacto:** `/spec` y `/plan` completados documentalmente.
> **Pendiente:** aprobación explícita del plan complejo y permiso para ejecutar `git init`.
> **Próximo paso:** realizar preflight, crear el esqueleto ejecutable y comenzar el corte vertical PostgreSQL → Spring Boot → React.
