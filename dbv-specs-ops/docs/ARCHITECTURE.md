# 🏗 Arquitectura Técnica: EarthPulse Live

> **Fase:** `/plan`
> **Estado:** Implementada; revisión cartográfica aprobada
> **Última revisión:** 2026-10-08

## Stack tecnológico

| Capa | Tecnología | Justificación |
| --- | --- | --- |
| Frontend | React 19.3 + TypeScript + Vite | Componentes modulares, tipado estricto y experiencia de desarrollo rápida |
| Datos remotos | TanStack Query + Zod | Caché, reintentos controlados y validación de respuestas en la frontera |
| Cartografía | Leaflet + Natural Earth local | Atlas vectorial sin clave ni dependencia cartográfica de red; clustering de eventos |
| Visualización | Recharts | Gráficas responsive integradas con React |
| Backend | Java 21 + Spring Boot 4.1 | Plataforma moderna, mantenible y preparada para producción |
| Persistencia | PostgreSQL + Spring Data JPA | Consistencia, consultas temporales e índices adecuados al dominio |
| Migraciones | Flyway | Esquema reproducible y versionado |
| Contrato | REST JSON + OpenAPI | Interfaz simple, demostrable y verificable |
| Pruebas | JUnit 5, Testcontainers, Vitest, Testing Library | Cobertura por capas con PostgreSQL real en integración |
| Operación local | Docker Compose + scripts multiplataforma | Arranque repetible y baja fricción de demostración |

La selección usa versiones estables actuales comprobadas en documentación oficial. Las versiones exactas quedarán fijadas en Maven y npm durante `/build`.

## Estructura de directorios

```text
/
├── backend/
│   ├── src/main/java/.../earthpulse/
│   │   ├── domain/          # Entidades y reglas puras
│   │   ├── application/     # Casos de uso e ingesta
│   │   ├── infrastructure/  # JPA, clientes USGS/EONET, configuración
│   │   └── interfaces/      # Controladores y DTOs REST
│   ├── src/main/resources/db/migration/
│   └── src/test/
├── frontend/
│   ├── src/
│   │   ├── api/             # Cliente HTTP y esquemas Zod
│   │   ├── components/      # Componentes reutilizables
│   │   ├── features/        # Mapa, filtros, eventos, analítica
│   │   ├── hooks/           # Estado y comportamiento compartido
│   │   ├── styles/          # Tokens y estilos globales
│   │   └── test/
│   └── public/              # Agent readiness y assets estáticos
├── docker-compose.yml
├── start.cmd / stop.cmd
├── start.sh / stop.sh
└── README.md
```

## Modelo de dominio

### `NaturalEvent`

- `id: UUID`
- `source: USGS | NASA_EONET`
- `externalId: String`
- `title: String`
- `category: EARTHQUAKE | WILDFIRE | SEVERE_STORM | VOLCANO | FLOOD | ICEBERG | OTHER`
- `status: OPEN | CLOSED | UNKNOWN`
- `occurredAt: Instant`
- `updatedAt: Instant?`
- `latitude`, `longitude: BigDecimal`
- `magnitudeValue: BigDecimal?`, `magnitudeUnit: String?`
- `severity: LOW | MODERATE | HIGH | CRITICAL`
- `sourceUrl: URI?`
- `rawFingerprint: String` para evitar escrituras innecesarias
- Restricción única: `(source, external_id)`

### `SyncRun`

Registra fuente, inicio, fin, estado, leídos, insertados, actualizados, rechazados y mensaje de error sanitizado. Permite mostrar frescura real y diagnosticar degradaciones.

## Flujo de datos

```text
USGS GeoJSON ─┐
              ├─> cliente tipado ─> normalizador ─> upsert PostgreSQL
NASA EONET ───┘                         │
                                       └─> registro SyncRun

React ─> API REST ─> consultas paginadas/agrupadas ─> mapa + métricas + gráficas
```

- Cada proveedor se sincroniza de forma independiente.
- Una sincronización fallida no elimina datos válidos anteriores.
- La API expone `dataFreshness` y estado por proveedor.
- El frontend hace polling moderado y conserva la última respuesta útil durante errores transitorios.

## API inicial

| Método | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/v1/events` | Eventos filtrados por fuente, categoría, fechas, magnitud, texto y viewport |
| `GET` | `/api/v1/events/{id}` | Detalle normalizado y enlace de procedencia |
| `GET` | `/api/v1/dashboard/summary` | Totales, severidades, categorías y frescura |
| `GET` | `/api/v1/dashboard/timeline` | Serie temporal agregada |
| `GET` | `/api/v1/sources/status` | Estado de USGS y EONET |
| `GET` | `/actuator/health` | Salud técnica mínima |

No se expondrá un endpoint público de sincronización manual en el MVP para evitar abuso de proveedores externos.

## Decisiones técnicas clave

### Backend

- Arquitectura por capacidades con separación dominio/aplicación/infraestructura/interfaces.
- `RestClient` con timeouts explícitos para fuentes externas.
- `@Scheduled` con bloqueo local suficiente para una sola instancia; el diseño permite incorporar un lock distribuido más adelante.
- Transacciones por lote, no por petición externa completa.
- Excepciones específicas traducidas a `ProblemDetail`; operaciones recuperables modeladas con un `Result` sellado.
- OpenAPI generado y CORS limitado al origen local configurado.

### Frontend

- TypeScript con `strict`, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`.
- Estado del servidor en TanStack Query; estado de filtros en reducer tipado y URL cuando sea útil.
- Sin store global adicional en el MVP.
- Componentes de mapa aislados del layout; paneles y gráficas no dependen directamente de Leaflet.
- La base del mapa es un recurso TopoJSON empaquetado con el frontend y convertido a GeoJSON en el cliente; una capa estándar de OpenStreetMap solo se carga al pedir detalle de calles.
- Respuestas HTTP validadas mediante Zod antes de entrar en la UI.

### Base de datos

- PostgreSQL como única base soportada para ejecución normal y pruebas de integración.
- Flyway es la única autoridad del esquema; JPA usa validación, no creación automática.
- Índices en `occurred_at`, `category`, `severity`, `source` y la clave natural.
- Coordenadas validadas en aplicación y mediante constraints SQL.

## Seguridad y privacidad

- La aplicación no recopila información personal ni requiere autenticación.
- URLs externas se construyen desde bases configuradas; no se acepta una URL arbitraria del cliente.
- Límites máximos de paginación y rangos temporales para prevenir consultas costosas.
- Contenido externo se trata como texto y React lo escapa; no se renderiza HTML de proveedores.
- Configuración sensible solo mediante variables de entorno; el proyecto no requiere API keys.

## Observabilidad y resiliencia

- Logs estructurados sin payloads completos.
- Health check para aplicación y PostgreSQL; estado funcional separado por proveedor.
- Timeouts, reintento acotado solo para errores transitorios y caché del último resultado válido.
- Métricas mínimas de duración/resultado de sincronización mediante Actuator/Micrometer.

## Agent Harness y Agent Readiness

- Contexto estático bajo `dbv-specs-ops/` y activadores en la raíz.
- No se requieren MCPs ni skills de runtime.
- `llms.txt`, `auth.md`, catálogo de API y Agent Plugin describen únicamente funciones existentes.
- Cabeceras `Link` apuntan al manifiesto y catálogo; no se publican descriptores ficticios de OAuth o firmas.
- Los archivos públicos usan rutas relativas o `${PLUGIN_ROOT}`/`${PLUGIN_DATA}` cuando corresponda.
