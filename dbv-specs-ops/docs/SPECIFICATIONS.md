# 📋 Especificaciones: EarthPulse Live

> **Fase:** `/spec`
> **Estado:** En evolución; ampliación visual y cartográfica aprobada por el autor
> **Última revisión:** 2026-10-08

## 1. Contexto y objetivos

- **Problema:** Los datos de fenómenos naturales están repartidos entre fuentes técnicas y resultan difíciles de explorar de forma rápida, visual y comprensible.
- **Objetivo:** Crear un centro de control geoespacial atractivo que agregue eventos reales de USGS y NASA EONET, permita entender qué está ocurriendo ahora y conserve un historial consultable en PostgreSQL.
- **Éxito demostrable:** Al abrir la aplicación se presenta un mapa mundial con datos actuales, métricas, filtros, tendencias y fichas verificables enlazadas a la fuente oficial.

## 2. Usuarios y escenarios

- **Perfil principal:** Persona interesada en actualidad geográfica, docente, estudiante o evaluador de una demostración técnica.
- **Escenario A:** Explorar los terremotos más recientes y distinguir visualmente su magnitud.
- **Escenario B:** Filtrar incendios, tormentas, volcanes, inundaciones y otros eventos abiertos de NASA EONET.
- **Escenario C:** Seleccionar un evento y consultar ubicación, fecha, severidad, procedencia y enlace original.
- **Escenario D:** Mostrar en una presentación que los datos proceden de servicios públicos reales y cuándo se sincronizaron.

## 3. Funcionalidades principales

- [x] **Mapa mundial interactivo:** representar eventos normalizados con marcadores agrupados y color por prioridad visual.
- [x] **Resumen operativo:** mostrar total visible, prioridad alta, actividad de 24 horas, fuentes y última actualización.
- [x] **Filtros combinables:** categoría, fuente, rango temporal, prioridad visual y búsqueda textual.
- [x] **Detalle contextual:** abrir un panel con datos disponibles, explicación de prioridad y vínculo verificable a la fuente.
- [x] **Actividad temporal:** visualizar la distribución por día y por categoría con un resumen legible para lectores de pantalla.
- [x] **Ingesta real:** sincronizar USGS GeoJSON y NASA EONET v3, validar la respuesta, normalizarla y realizar upsert idempotente.
- [x] **Persistencia:** almacenar eventos y ejecuciones de sincronización en PostgreSQL mediante migraciones versionadas.
- [x] **Estados robustos:** comunicar carga, ausencia de datos, fuente degradada y errores parciales sin dejar la interfaz inutilizable.
- [x] **Actualización periódica:** refrescar datos desde el backend y actualizar el panel sin recargar la página.
- [ ] **Diseño responsive y accesible:** experiencia cuidada en escritorio, tableta y móvil, con teclado, contraste AA y reducción de movimiento; pendiente auditoría visual y de contraste en navegador.
- [x] **Cartografía sin clave:** el mapa mundial y los marcadores deben mostrarse sin un proveedor de teselas, conexión cartográfica ni pagos.
- [x] **Detalle cartográfico optativo:** el usuario puede activar calles de OpenStreetMap para explorar una región, sin comprometer el atlas local si las teselas fallan.
- [x] **Lectura mejorada:** indicadores de frescura, distribución por categorías, búsqueda cómoda y ordenación del feed con cifras siempre derivadas de eventos reales.

## 4. Propuesta de solución técnica

- **Frontend:** React 19 + TypeScript estricto + Vite; TanStack Query para estado remoto; Zod para validar bordes; Leaflet para cartografía; Recharts para métricas.
- **Backend:** Java 21 + Spring Boot 4.1; REST, Bean Validation, Spring Data JPA, Flyway y Actuator.
- **Persistencia:** PostgreSQL con claves naturales por fuente, índices para tiempo/categoría/severidad y registro de sincronizaciones.
- **Fuentes externas:** USGS Earthquake GeoJSON Feed y NASA EONET API v3.
- **Estrategia de actualización:** tareas programadas independientes por fuente, transacciones cortas, upsert idempotente y tolerancia a fallo parcial.
- **Skills/MCP:** No se necesita un servidor MCP para el MVP. El producto expone documentación de descubrimiento web legible por agentes.

### 4.1. Agent Readiness

- [x] Publicar `robots.txt`, `llms.txt` y `auth.md`.
- [x] Publicar catálogo de API y metadatos aplicables bajo `.well-known/`.
- [x] Incluir un Agent Plugin mínimo y válido que describa la API pública de lectura.
- [x] Añadir cabeceras `Link` desde Spring Boot y documentación Markdown de endpoints.
- [x] No anunciar OAuth ni firma HTTP como disponibles mientras no exista autenticación real.

## 5. Fuera de alcance de la primera entrega

- Autenticación, cuentas de usuario y preferencias persistentes.
- Alertas por correo, SMS o notificaciones push.
- Predicción de desastres o recomendaciones de emergencia.
- Datos bancarios, privados o de sensores propios.
- Edición humana de los eventos obtenidos de las fuentes.
- Garantía de tiempo real estricto o uso como servicio oficial de emergencias.

## 6. Riesgos y mitigación

- **Fuente externa lenta o indisponible:** conservar el último snapshot válido, mostrar su antigüedad y aislar fallos por proveedor.
- **Duplicados o cambios retroactivos:** clave única `(source, external_id)` y upsert idempotente.
- **Campos incompletos o geometrías inesperadas:** DTOs de frontera, validación, valores opcionales explícitos y rechazo controlado por registro.
- **Sobrecarga visual:** clustering, filtros progresivos, jerarquía clara y panel de detalle bajo demanda.
- **Interpretación incorrecta:** etiquetar el producto como informativo, enlazar la fuente y no presentar una puntuación propia como alerta oficial.
- **Dependencias o secretos:** paquetes verificados, versiones fijadas, variables de entorno y escaneo durante `/code-simplify`.
- **Cambios en proveedores de mapas:** atlas local versionado a partir de Natural Earth; la capa remota de calles es optativa y nunca necesaria para mostrar eventos.

## 7. Decisiones resueltas

- Datos reales y públicos, no simulados.
- Calidad y acabado visual prioritarios frente a completar en 90 minutos.
- React + TypeScript y Java + Spring Boot como tecnologías preferidas.
- PostgreSQL como base de datos objetivo, ejecutable localmente con Docker Compose.
- Interfaz dark-first, profesional y especialmente preparada para una demostración en pantalla grande.

## 8. Criterios de aceptación

- La aplicación arranca mediante scripts documentados en Windows, macOS y Linux.
- Una instalación limpia crea el esquema con Flyway y carga datos reales sin intervención manual.
- Un fallo de NASA EONET no impide mostrar datos vigentes de USGS, y viceversa.
- Los filtros afectan de forma coherente al mapa, métricas, listado y gráficas.
- Cada evento muestra fuente y enlace original cuando estén disponibles.
- Frontend y backend cuentan con pruebas automáticas relevantes y builds reproducibles.
- No existen secretos incluidos, dependencias ficticias ni errores críticos de accesibilidad conocidos.
- El atlas y los eventos funcionan sin API key y sin teselas remotas; ningún error de la capa opcional tapa el mapa.

## 9. Evals no deterministas

No aplican al MVP: no se integran modelos generativos ni componentes probabilísticos propios. La calidad se valida con pruebas deterministas, accesibilidad y revisión visual.
