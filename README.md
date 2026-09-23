# EarthPulse Live

> Centro de observación geoespacial para explorar eventos naturales reales y cercanos al tiempo real.

EarthPulse Live combina el feed GeoJSON de terremotos de USGS con NASA EONET en una interfaz de operaciones visual: mapa agrupado, métricas, filtros, actividad temporal y fichas enlazadas a la fuente oficial. Los datos no son simulados; cada evento conserva su origen, identificador externo, instante y URL de procedencia.

## Arranque rápido

Requisitos: Java 21 o superior y Node.js 22 o superior. Maven no es necesario porque se incluye Maven Wrapper.

En Windows:

```bat
start.cmd
```

En macOS o Linux:

```bash
chmod +x start.sh stop.sh
./start.sh
```

Después abre <http://localhost:5173>. El primer arranque tarda unos segundos mientras se consultan USGS y NASA EONET. Para detener ambos procesos usa `stop.cmd` o `./stop.sh`.

El perfil predeterminado `demo` utiliza una base H2 persistente en `.data/`, por lo que funciona sin Docker. Para ejecutar con PostgreSQL:

```bash
docker compose up -d postgres
SPRING_PROFILES_ACTIVE=postgres ./start.sh
```

En PowerShell puedes establecer `$env:SPRING_PROFILES_ACTIVE = "postgres"` antes de ejecutar `start.cmd`.

## Arquitectura

- **Frontend:** React 19, TypeScript estricto, Vite, Leaflet, MarkerCluster, Recharts, TanStack Query y Zod.
- **Backend:** Java 21, Spring Boot 4.1, JPA, Flyway, Actuator y clientes HTTP resilientes.
- **Datos:** PostgreSQL como objetivo de producción; H2 como perfil local sin instalación.
- **API:** `GET /api/v1/dashboard`, con filtros `source`, `category`, `severity`, `hours`, `query` y `limit`.

Los artefactos de descubrimiento están disponibles en `/robots.txt`, `/llms.txt`, `/openapi.json` y `/.well-known/agent-plugin/plugin.json`.

## Comandos de calidad

```bash
cd backend && ./mvnw test
cd frontend && npm run lint && npm run test:run && npm run build
```

## Fuentes y alcance

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
- [NASA EONET v3](https://eonet.gsfc.nasa.gov/docs/v3)
- Cartografía de OpenStreetMap y teselas CARTO, con atribución visible en el mapa.

La aplicación es informativa y no sustituye alertas oficiales ni servicios de emergencia. La frescura depende de la publicación de cada proveedor y se muestra en la interfaz.

## Autor y licencia

Creado por Raúl Pérez Moreno. MIT © 2026.
