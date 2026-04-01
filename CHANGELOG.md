# Changelog — homebridge-homeassistant-garagedoor

**Author / Autor:** Yago Torres  
**Repository / Repositorio:** https://github.com/torresyago/homebridge-homeassistant-garagedoor

---

All notable changes to this project will be documented in this file.  
Todos los cambios relevantes de este proyecto se documentan aquí.

---

## [1.4.0] - 2026-04-01

### Changed / Cambios

- **EN** Converted to **dynamic platform** (`pluginType: platform`) — required for Homebridge plugin verification.
- **EN** Config changes: devices are now declared under a `devices` array inside the platform block. Each device keeps the same fields (`name`, `haUrl`, `entityId`, `haToken`, `pollInterval`).
- **EN** Added Node.js 24 to supported engines.
- **EN** Improved error logging: HTTP errors use `log.error`, debug messages use `log.debug`.
- **ES** Convertido a **dynamic platform** (`pluginType: platform`) — requisito para la verificación oficial del plugin de Homebridge.
- **ES** Cambio de configuración: los dispositivos se declaran ahora bajo un array `devices` dentro del bloque de plataforma. Cada dispositivo mantiene los mismos campos (`name`, `haUrl`, `entityId`, `haToken`, `pollInterval`).
- **ES** Añadido Node.js 24 a los engines soportados.
- **ES** Mejoras en el log de errores: los errores HTTP usan `log.error`, los mensajes de debug usan `log.debug`.

---

## [1.3.2] - 2026-04-01

### Fixed / Corregido
- **EN** Republish to ensure README and CHANGELOG are correctly included in the npm package.
- **ES** Republicación para asegurar que README y CHANGELOG se incluyen correctamente en el paquete npm.

---

## [1.3.1] - 2026-04-01

### Changed / Cambios
- **EN** Changelog rewritten in English and Spanish. Author and repository link added to the header.
- **ES** Changelog reescrito en inglés y castellano. Añadidos autor y enlace al repositorio en la cabecera.

---

## [1.3.0] - 2026-04-01

### Changed / Cambios
- **EN** Homebridge v2 compatible: replaced `.on('set', callback)` with `.onSet()` API.
- **EN** Replaced deprecated `request` library with native `fetch` (Node.js 18+ built-in) — no external dependencies.
- **EN** Updated `engines` to `^1.6.0 || ^2.0.0-beta.0` with Node.js 18/20/22 requirement.
- **EN** Added `repository`, `bugs` and `homepage` fields so Config UI X shows changelog and release notes correctly.
- **ES** Compatible con Homebridge v2: reemplazado `.on('set', callback)` por la nueva API `.onSet()`.
- **ES** Eliminada la librería deprecated `request`, reemplazada por `fetch` nativo (integrado en Node.js 18+) — sin dependencias externas.
- **ES** `engines` actualizado a `^1.6.0 || ^2.0.0-beta.0` con requisito de Node.js 18/20/22.
- **ES** Añadidos campos `repository`, `bugs` y `homepage` para que Config UI X muestre el changelog y release notes.

---

## [1.2.6] - 2026-03-28

### Fixed / Corregido
- **EN** Added `config.schema.json` to fix "plugin alias could not be determined" error in Homebridge Config UI X.
- **ES** Añadido `config.schema.json` para corregir el error "plugin alias could not be determined" en Homebridge Config UI X.

---

## [1.2.5] - 2025

### Changed / Cambios
- **EN** Universal status adjustment and stability improvements.
- **ES** Ajuste de estado universal y mejoras de estabilidad.

---

## [1.1.3] - 2025

### Added / Añadido
- **EN** Auto-close after OPEN (3 seconds).
- **ES** Cierre automático tras ABIERTA (3 segundos).

---

## [1.1.2] - 2025

### Fixed / Corregido
- **EN** Fixed "Closing" stuck state → forced CLOSED.
- **ES** Corregido estado "Cerrando" bloqueado → forzado a CERRADA.

---

## [1.1.1] - 2025

### Fixed / Corregido
- **EN** Plugin alias alignment for Config UI X.
- **ES** Corrección del alias del plugin para Config UI X.

---

## [1.1.0] - 2025

### Added / Añadido
- **EN** Inline Config UI X schema support.
- **ES** Soporte de schema inline para Config UI X.

---

## [1.0.9] - 2025

### Added / Añadido
- **EN** Full `config.schema.json` support.
- **ES** Soporte completo de `config.schema.json`.
