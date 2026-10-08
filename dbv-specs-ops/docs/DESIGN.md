# 🎨 Sistema de Diseño: EarthPulse Live

> **Fase:** `/spec`
> **Estado:** Implementado; refinamiento visual aprobado
> **Última revisión:** 2026-10-08

```yaml
version: "1.0.0"
name: "EarthPulse Live"
description: "Centro de operaciones geoespacial oscuro, preciso y cinematográfico sin sacrificar legibilidad."

colors:
  primary:      "#69E6CB"
  secondary:    "#79A8FF"
  accent:       "#FFB454"
  neutral:      "#071018"
  surface:      "#0D1A24"
  surfaceRaised:"#122432"
  on-primary:   "#031510"
  on-surface:   "#F2F7F8"
  on-neutral:   "#91A6B2"
  error:        "#FF647C"
  success:      "#69E6CB"
  warning:      "#FFB454"
  info:         "#79A8FF"
  border:       "#1D3442"

typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 4.5rem)"
    fontWeight: 720
    lineHeight: 0.96
    letterSpacing: "-0.055em"
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 430
    lineHeight: 1.55
  data:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 520
    letterSpacing: "0.045em"

rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

motion:
  fast: "140ms"
  base: "220ms"
  slow: "420ms"
  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
```

## Visión general

EarthPulse Live debe sentirse como una herramienta científica contemporánea y no como una plantilla SaaS. La pantalla principal combina una cartografía dominante con paneles densos pero respirables, cifras de gran tamaño y pequeños detalles instrumentales. El efecto visual procede de la jerarquía, el contraste, el movimiento de datos y la composición; nunca de decoración gratuita.

## Dirección visual

- **Metáfora:** sala de situación geoespacial, precisa y serena.
- **Composición desktop:** encabezado compacto; franja de métricas; filtros a la izquierda; mapa como superficie principal; feed de actividad y detalle a la derecha.
- **Composición móvil:** mapa en primer plano, métricas horizontales y filtros/detalle como hojas inferiores accesibles.
- **Profundidad:** superficies tonales, bordes de baja intensidad y sombras ambientales. Evitar glassmorphism excesivo.
- **Marca:** símbolo orbital formado por un punto de evento y dos arcos; wordmark en caja mixta.

## Color

- **Mint `#69E6CB`:** estado activo, foco, datos recientes y acción principal.
- **Azul `#79A8FF`:** información neutral, USGS y vínculos.
- **Ámbar `#FFB454`:** atención y severidad alta.
- **Coral `#FF647C`:** criticidad y errores; nunca como decoración extensa.
- **Fondos:** azul petróleo casi negro, evitando negro puro para conservar profundidad.
- Cada categoría usa un color consistente en marcador, leyenda y gráfica. Nunca depender solo del color: acompañar con icono, forma o etiqueta.

## Tipografía y datos

- Inter/system para interfaz y títulos; monoespaciada del sistema para coordenadas, horas, magnitudes y estados.
- Números tabulares en métricas para evitar saltos al actualizarse.
- Titulares con tracking negativo; etiquetas técnicas en mayúsculas pequeñas y espaciadas.
- No usar texto por debajo de 12 px ni pesos finos sobre fondo oscuro.

## Componentes clave

### Mapa

- Ocupa la mayor superficie visual y mantiene controles de zoom accesibles.
- Marcadores con núcleo sólido, halo proporcional a severidad y estado de selección inequívoco.
- Clusters con número legible y expansión animada moderada.
- Atribución cartográfica siempre visible.
- Atlas local de fondo oceánico profundo, continentes tonales y retícula discreta; ninguna marca de error o muro de API puede ocupar el mapa.
- Conmutador Atlas/Calles y control para reencuadrar el mundo, visibles y accesibles.

### Métricas

- Cuatro tarjetas asimétricas: actividad total, últimas 24 h, críticos y frescura.
- Valor dominante, etiqueta breve y microtendencia o contexto; sin gráficas decorativas sin escala.

### Filtros

- Chips de categoría con contador, controles de tiempo y magnitud, más una acción clara para restablecer.
- Todos los controles muestran foco visible y área interactiva mínima de 44×44 px.

### Feed y detalle

- Lista ordenada por actualidad con categoría, ubicación, hora y severidad.
- La selección abre una ficha narrativa con coordenadas, procedencia, magnitud, actualización y enlace externo.
- Los datos ausentes se indican como “No disponible”; nunca se inventan.

### Estados

- Skeletons que reproducen la geometría final.
- Error parcial por proveedor dentro del contexto afectado, sin reemplazar toda la pantalla.
- Banner de datos antiguos cuando la última sincronización supere el umbral configurado.

## Movimiento e interacción

- Las entradas nuevas producen un pulso único y sutil, no una animación infinita.
- Hover/focus: 140 ms; paneles: 220 ms; cambio de selección de mapa: hasta 420 ms.
- Los contadores pueden interpolar solo la primera vez; actualizaciones posteriores cambian con discreción.
- Respetar `prefers-reduced-motion` y eliminar halos animados, desplazamientos y conteos progresivos.

## Accesibilidad y responsive

- Contraste WCAG AA, foco visible de 2 px y navegación completa con teclado fuera de las limitaciones propias del mapa.
- La información del mapa también existe en una lista semántica.
- Breakpoints orientativos: móvil `< 768`, tableta `768–1199`, escritorio `>= 1200`.
- Ningún panel crítico debe depender de hover.

## Criterios de revisión visual

- Jerarquía comprensible en cinco segundos a dos metros de distancia.
- Sin solapamientos a 360 px, 768 px, 1440 px y 1920 px.
- Mapa, métricas, feed y filtros muestran exactamente el mismo conjunto filtrado.
- Cero scroll horizontal y objetivos táctiles de al menos 44 px.
- Capturas finales comparadas visualmente en desktop y móvil antes de `/ship`.
