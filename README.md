# EarthPulse Live

**Un observatorio visual de fenómenos naturales reales.** EarthPulse reúne terremotos publicados por USGS y eventos abiertos de NASA EONET en un mapa mundial interactivo. Permite explorar qué está ocurriendo, filtrar el conjunto, consultar su evolución y abrir el registro original de cada evento.

Creado por **Raúl Pérez Moreno** con el flujo de trabajo [dbv-specs-ops](https://github.com/davidbuenov/dbv-specs-ops). El proyecto prioriza una demostración rápida de enseñar, pero mantiene separación entre ingesta, persistencia, API y visualización.

## Qué se puede hacer

- Explorar eventos geolocalizados en un **atlas mundial incluido en el proyecto**, sin API key, facturación ni teselas externas para la vista predeterminada. Hay una capa de calles de OpenStreetMap opcional que se activa manualmente; si falla la red, vuelve el atlas local.
- Filtrar por fuente, categoría, prioridad visual, intervalo temporal y texto; restablecer la selección de un clic.
- Ver cuatro indicadores, una serie de actividad diaria y un desglose por fenómeno que responden a la selección actual.
- Ordenar el listado por recencia o prioridad, cargar más resultados y seleccionar un evento para centrar el mapa y abrir su ficha.
- Comprobar el estado de USGS y NASA EONET, la fecha de actualización y acceder a la página original de un evento.
- Seguir usando los últimos registros persistidos cuando una fuente tenga un fallo temporal de sincronización.

No hay transacciones ni eventos inventados: las señales proceden de los feeds públicos. La **prioridad visual sí es una clasificación derivada por esta aplicación**; no equivale a una alerta oficial. Los indicadores se calculan sobre los eventos devueltos a la vista, con un máximo de 1.200 en el cliente, y no representan un censo mundial exhaustivo.

## Arranque en local

Necesitas **Java 21+** y **Node.js 22+** con npm. El repositorio incluye Maven Wrapper; no necesitas instalar Maven. La primera ejecución necesita Internet para descargar dependencias y consultar los feeds. Después, la vista cartográfica base funciona sin conexión.

En Windows, desde la raíz del proyecto:

```bat
start.cmd
```

En macOS o Linux:

```bash
chmod +x start.sh stop.sh backend/mvnw
./start.sh
```

Abre **http://localhost:5173**. El backend escucha en **http://localhost:8080**. La primera sincronización de USGS y NASA EONET arranca unos segundos después del backend; espera a que las dos fuentes indiquen su estado. Para detener los procesos, ejecuta `stop.cmd` o `./stop.sh` según tu sistema.

Los lanzadores instalan las dependencias del frontend con `npm ci` si aún no existe `node_modules`. En Windows, API y UI se abren en ventanas minimizadas con sus registros visibles al restaurarlas; en macOS/Linux, los logs quedan en `.runtime/`.

El perfil predeterminado es `demo`: usa **H2 persistente** en `.data/` y no necesita Docker. Para usar **PostgreSQL**, que es el destino previsto de despliegue:

```bash
docker compose up -d postgres
SPRING_PROFILES_ACTIVE=postgres ./start.sh
```

En PowerShell, antes de ejecutar `start.cmd`:

```powershell
docker compose up -d postgres
$env:SPRING_PROFILES_ACTIVE = 'postgres'
.\start.cmd
```

El `docker-compose.yml` proporciona PostgreSQL 17 para desarrollo. El esquema se aplica con **Flyway** en los dos perfiles. Consulta `.env.example` para personalizar credenciales y puertos; sus valores no se cargan automáticamente en PowerShell.

## Tecnologías y papel de cada una

| Capa | Tecnologías | Para qué se usan |
| --- | --- | --- |
| Interfaz | React 19, TypeScript, Vite, CSS | Dashboard adaptable, estados de carga/error y experiencia visual. |
| Datos en cliente | TanStack Query, Zod | Refresco y caché de la API; validación de las respuestas antes de representarlas. |
| Mapa | Leaflet, MarkerCluster, TopoJSON, Natural Earth (`world-atlas`) | Atlas local vectorial, agrupación y navegación entre eventos. Calles OSM solo como opción. |
| Gráficas e iconos | Recharts, Lucide | Actividad temporal y lenguaje visual consistente. |
| API e ingesta | Java 21, Spring Boot 4, Spring Data JPA, RestClient | Descarga programada, normalización, consulta filtrada y estados de sincronización. |
| Persistencia | PostgreSQL 17, Flyway; H2 en `demo` | Conservación de eventos y migraciones versionadas. |
| Calidad | Vitest, Testing Library, JUnit, Maven, oxlint, TypeScript | Pruebas, análisis estático y compilación. |

## Cómo viajan los datos

```text
USGS GeoJSON ──────┐
                   ├─> clientes de ingesta ─> validación y normalización ─> base de datos
NASA EONET GeoJSON ┘                                                │
                                                                    v
React + TanStack Query <──── GET /api/v1/dashboard <──── Spring Boot
        │
        └─> métricas + filtros + serie temporal + mapa local + ficha de origen
```

El backend sincroniza USGS aproximadamente cada minuto y EONET cada diez minutos, salvo configuración distinta. Guarda fuente, ID externo, coordenadas, marca temporal, URL de origen y huella del evento. Se descartan registros con coordenadas inválidas y enlaces que no sean HTTP(S). Si una petición al proveedor falla, el estado de esa fuente lo indica y no se borra el último conjunto válido.

El frontend solicita un dashboard coherente con los filtros activos. La API devuelve eventos, resumen, serie temporal, estado de fuentes y hora de generación en una sola respuesta. El mapa y la gráfica se cargan en bundles diferidos. El atlas utiliza geografía Natural Earth empaquetada en el frontend; **no usa CARTO ni solicita una clave**. La capa opcional `Calles` pide teselas a OpenStreetMap y requiere conexión, sujeto a su política de uso.

## API y configuración

El endpoint principal es `GET /api/v1/dashboard`. Parámetros opcionales: `source` (`USGS` o `NASA_EONET`), `category`, `severity`, `hours`, `query` y `limit`. Ejemplo:

```bash
curl "http://localhost:8080/api/v1/dashboard?hours=168&source=USGS&limit=20"
```

También están disponibles `/actuator/health`, `/openapi.json`, `/robots.txt`, `/llms.txt` y `/.well-known/agent-plugin/plugin.json` en el backend.

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | `demo` | Cambia a `postgres` para PostgreSQL. |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/earthpulse` | URL JDBC del perfil PostgreSQL. |
| `DATABASE_USER` / `DATABASE_PASSWORD` | `earthpulse` / `earthpulse` | Credenciales locales; cámbialas fuera de desarrollo. |
| `SERVER_PORT` | `8080` | Puerto de la API. |
| `CORS_ORIGIN` | `http://localhost:5173` | Origen permitido para el frontend. |
| `USGS_SYNC_DELAY_MS` | `60000` | Intervalo de USGS, en milisegundos. |
| `EONET_SYNC_DELAY_MS` | `600000` | Intervalo de EONET, en milisegundos. |
| `USGS_URL` / `EONET_URL` | feeds públicos oficiales | Sobrescribe el origen, útil para pruebas. |

## Desarrollo y comprobaciones

Para trabajar con procesos visibles en dos terminales:

```bash
cd backend && ./mvnw spring-boot:run
cd frontend && npm install && npm run dev
```

En Windows usa `mvnw.cmd` y `npm.cmd` si PowerShell restringe scripts. Las comprobaciones habituales son:

```bash
cd backend && ./mvnw test
cd frontend && npm run typecheck && npm run lint && npm run test:run && npm run build
```

La raíz contiene código y documentación de producto; `dbv-specs-ops/` es el plano de control de especificaciones, arquitectura, diseño, decisiones y tareas.

## Si algo no aparece

- **La página abre pero no hay eventos:** comprueba `http://localhost:8080/actuator/health`, espera la primera ingesta y revisa el estado de las fuentes en la cabecera. El rango predeterminado es de 90 días.
- **No se ven calles:** el atlas local debería seguir visible. La capa `Calles` necesita conexión con OpenStreetMap, pero no es necesaria para usar el mapa.
- **El puerto está ocupado:** detén una instancia previa con el script de parada o cambia `SERVER_PORT` y ajusta el proxy de `frontend/vite.config.ts`.
- **PostgreSQL no conecta:** verifica `docker compose ps`, el perfil activo y las variables `DATABASE_*`.

## Fuentes, límites y licencia

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php): terremotos y metadatos publicados por USGS.
- [NASA EONET v3](https://eonet.gsfc.nasa.gov/docs/v3): eventos naturales abiertos y sus fuentes asociadas.
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/): geografía de dominio público del atlas local, distribuida mediante `world-atlas`.
- [OpenStreetMap Standard Tile Layer](https://operations.osmfoundation.org/policies/tiles/): capa opcional de calles, con atribución visible y sujeta a la política del servicio público.

La actualización es **cercana al tiempo real, no instantánea**: depende de la publicación de cada proveedor, de la periodicidad de sincronización y de la conexión. La aplicación es informativa; para seguridad personal utiliza las alertas de organismos oficiales. El código del proyecto está bajo licencia **MIT © 2026 Raúl Pérez Moreno**.
