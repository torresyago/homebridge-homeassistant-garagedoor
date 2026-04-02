# homebridge-homeassistant-garagedoor

Homebridge plugin to control Home Assistant switches as native Garage Doors in HomeKit.

[![npm version](https://img.shields.io/npm/v/homebridge-homeassistant-garagedoor)](https://www.npmjs.com/package/homebridge-homeassistant-garagedoor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Homebridge Verified](https://img.shields.io/badge/homebridge-verification%20pending-yellow)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

> **EN** This plugin has been submitted for **official Homebridge verification**. Once approved, it will appear as a verified plugin in the Homebridge plugin catalogue.
>
> **ES** Este plugin ha sido enviado para **verificación oficial de Homebridge**. Una vez aprobado, aparecerá como plugin verificado en el catálogo de plugins de Homebridge.

---

## Migrating from v1.3.x / Migración desde v1.3.x

From v1.4.0 the plugin is a **dynamic platform**. You need to move your config from the `accessories` block to `platforms`.

Desde v1.4.0 el plugin es una **dynamic platform**. Debes mover la config del bloque `accessories` a `platforms`.

**Before / Antes:**
```json
"accessories": [
  {
    "accessory": "HomeAssistantGarageDoor",
    "name": "Garage Door 1",
    "haUrl": "http://homeassistant.local:8123",
    "haToken": "YOUR_TOKEN",
    "entityId": "switch.garage_relay_1",
    "pollInterval": 30
  },
  {
    "accessory": "HomeAssistantGarageDoor",
    "name": "Garage Door 2",
    "haUrl": "http://homeassistant.local:8123",
    "haToken": "YOUR_TOKEN",
    "entityId": "switch.garage_relay_2",
    "pollInterval": 30
  }
]
```

**After / Después:**
```json
"platforms": [
  {
    "platform": "HomeAssistantGarageDoor",
    "name": "HA Garage Door",
    "devices": [
      {
        "name": "Garage Door 1",
        "haUrl": "http://homeassistant.local:8123",
        "haToken": "YOUR_TOKEN",
        "entityId": "switch.garage_relay_1",
        "pollInterval": 30
      },
      {
        "name": "Garage Door 2",
        "haUrl": "http://homeassistant.local:8123",
        "haToken": "YOUR_TOKEN",
        "entityId": "switch.garage_relay_2",
        "pollInterval": 30
      }
    ]
  }
]
```

> **Note:** If you update the plugin without changing your config, it will continue to work and log a warning asking you to migrate.
>
> **Nota:** Si actualizas el plugin sin cambiar la config, seguirá funcionando y mostrará un aviso en el log pidiendo que migres.

---

## English

### Features

- Native Garage Door accessory in the Home app and Siri
- Config UI X form (no manual JSON editing required)
- Pulse logic: sends `turn_on` then `turn_off` after 2 seconds (relay-style)
- Always reports door as CLOSED after each operation
- Configurable polling interval (default 30s)

### Installation

```bash
npm install -g homebridge-homeassistant-garagedoor
```

### Configuration via Config UI X

1. Go to **Plugins → HA Garage Door → Add (+)**
2. Fill in the fields:
   - **Name**: e.g. `Garage Door`
   - **Home Assistant URL**: e.g. `http://homeassistant.local:8123`
   - **Long-Lived Access Token**: your HA token
   - **Entity ID**: e.g. `switch.garage_relay`
   - **Poll Interval**: seconds between status checks (default `30`)
3. Click **Save**

### Manual config.json

```json
{
  "accessory": "HomeAssistantGarageDoor",
  "name": "Garage Door",
  "haUrl": "http://homeassistant.local:8123",
  "haToken": "eyJhbGciOiJIUzI1NiIs...",
  "entityId": "switch.garage_relay",
  "pollInterval": 30
}
```

### Getting a Home Assistant Long-Lived Access Token

1. In Home Assistant, click your user avatar (bottom-left)
2. Scroll to **Long-Lived Access Tokens**
3. Click **Create Token**, give it a name (e.g. `Homebridge`)
4. Copy the token and paste it in the plugin config

### How it works

When you tap **Open** in the Home app or ask Siri:

1. Sends `turn_on` to the HA switch entity
2. Waits 2 seconds
3. Sends `turn_off` (simulates a momentary relay pulse)
4. Reports the door as CLOSED again automatically

### Expected logs

```
[Garage Door] Initialized - HA: http://homeassistant.local:8123 (switch.garage_relay)
[Garage Door] Target state: OPEN
[Garage Door] Pulso 2s: turn_off
[Garage Door] AUTO-CLOSED después pulso
```

---

## Español

### Características

- Puerta de garaje nativa en la app Home y Siri
- Formulario automático en Config UI X (sin editar JSON manualmente)
- Lógica de pulso: envía `turn_on` y luego `turn_off` a los 2 segundos (estilo relé)
- Siempre informa la puerta como CERRADA tras cada operación
- Intervalo de polling configurable (30s por defecto)

### Instalación

```bash
npm install -g homebridge-homeassistant-garagedoor
```

### Configuración con Config UI X

1. Ve a **Plugins → HA Garage Door → Nuevo (+)**
2. Rellena los campos:
   - **Nombre**: p. ej. `Puerta Garaje`
   - **URL Home Assistant**: p. ej. `http://homeassistant.local:8123`
   - **Long-Lived Access Token**: tu token de HA
   - **Entity ID**: p. ej. `switch.rele_garaje`
   - **Intervalo Poll**: segundos entre comprobaciones (por defecto `30`)
3. Haz clic en **Guardar**

### config.json manual

```json
{
  "accessory": "HomeAssistantGarageDoor",
  "name": "Puerta Garaje",
  "haUrl": "http://homeassistant.local:8123",
  "haToken": "eyJhbGciOiJIUzI1NiIs...",
  "entityId": "switch.rele_garaje",
  "pollInterval": 30
}
```

### Cómo obtener un Long-Lived Access Token en Home Assistant

1. En Home Assistant, haz clic en tu avatar de usuario (abajo a la izquierda)
2. Baja hasta **Long-Lived Access Tokens**
3. Haz clic en **Crear Token**, dale un nombre (p. ej. `Homebridge`)
4. Copia el token y pégalo en la configuración del plugin

### Cómo funciona

Al pulsar **Abrir** en la app Home o decírselo a Siri:

1. Envía `turn_on` al switch de Home Assistant
2. Espera 2 segundos
3. Envía `turn_off` (simula un pulso momentáneo de relé)
4. Informa automáticamente la puerta como CERRADA

### Logs esperados

```
[Puerta Garaje] Initialized - HA: http://homeassistant.local:8123 (switch.rele_garaje)
[Puerta Garaje] Target state: OPEN
[Puerta Garaje] Pulso 2s: turn_off
[Puerta Garaje] AUTO-CLOSED después pulso
```

---

## Troubleshooting — after upgrading to v1.4.0 or later

From v1.4.0 this plugin changed from `accessory` to `platform`. If Config UI X still generates `"accessory"` instead of `"platform"` after updating, follow these steps:

1. **Uninstall the plugin** from Config UI X → Plugins → `homebridge-homeassistant-garagedoor` → Uninstall
2. **Clear the Homebridge accessory cache**: Config UI X → Settings → scroll down → **Remove All Cached Accessories**
3. **Restart the Homebridge container/service** completely:
   - Docker: `docker restart homebridge`
   - systemd: `sudo systemctl restart homebridge`
4. **Reinstall the plugin** from Config UI X → search `homebridge-homeassistant-garagedoor` → Install
5. **Add the plugin again** from the Config UI X assistant — it will now generate the correct `"platform"` config

> This is necessary because Config UI X caches the plugin schema. A full restart forces it to reload the schema from the newly installed version.

---

## Solución de problemas — tras actualizar a v1.4.0 o superior

Desde v1.4.0 este plugin cambió de `accessory` a `platform`. Si Config UI X sigue generando `"accessory"` en lugar de `"platform"` tras actualizar, sigue estos pasos:

1. **Desinstala el plugin** desde Config UI X → Plugins → `homebridge-homeassistant-garagedoor` → Desinstalar
2. **Limpia la caché de accesorios**: Config UI X → Ajustes → baja hasta **Eliminar todos los accesorios en caché**
3. **Reinicia completamente el contenedor/servicio de Homebridge**:
   - Docker: `docker restart homebridge`
   - systemd: `sudo systemctl restart homebridge`
4. **Vuelve a instalar el plugin** desde Config UI X → busca `homebridge-homeassistant-garagedoor` → Instalar
5. **Añade el plugin de nuevo** desde el asistente de Config UI X — ahora generará la config correcta con `"platform"`

> Esto es necesario porque Config UI X cachea el schema del plugin. Un reinicio completo fuerza la recarga del schema desde la versión recién instalada.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License — see [LICENSE](LICENSE)

---

⭐ Star this repo if it's useful! / ¡Dale estrella si te sirve!
