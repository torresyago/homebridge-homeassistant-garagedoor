Features ✨
✅ Native Garage Door in Home app + Siri

✅ Config UI X form (no JSON editing)

✅ Bidirectional sync (Home app ↔ Home Assistant)

✅ Auto-close after OPEN (3s)

✅ Real-time polling (30s default)

✅ Error 400 fixed (no redundant requests)

📦 Installation
bash
npm install -g homebridge-homeassistant-garagedoor
⚙️ Configuration (Config UI X)
text
Plugins → HA Garage Door → ADD NEW (+)

✅ Name: Puerta1 HA
✅ HA URL: http://192.168.68.239:8123
✅ HA Token: eyJhbGciOiJIUzI1NiIs... (Long-Lived Access Token)
✅ Entity ID: switch.Puerta1
✅ Poll Interval: 30 (seconds)
     [SAVE] ✓
🔑 Home Assistant Long-Lived Access Token
HA → User Profile (👤 bottom-left)

Long-Lived Access Tokens → Create Token

Name: Homebridge Garage Door

Copy token → Paste in Config UI X

Token expires: Never (unless revoked)

📱 Home App Behavior
text
✅ Initial: CERRADA
✅ Tap → OPEN (3s) → Auto CLOSE
✅ Siri: "Open/close Puerta1 HA"
✅ Status: Real-time sync via polling
🛠️ Manual config.json
json
{
  "accessory": "HomeAssistantGarageDoor",
  "name": "Puerta1 HA",
  "haUrl": "http://192.168.68.239:8123",
  "haToken": "eyJhbGciOiJIUzI1NiIs...",
  "entityId": "switch.Puerta1",
  "pollInterval": 30
}
🔍 Logs
text
[Puerta1 HA] Initialized - HA: http://192.168.68.239:8123 (switch.Puerta1)
[Puerta1 HA] Target state: OPEN
[Puerta1 HA] HA turn_on → 200: []
[Puerta1 HA] Auto-close en 3s...
[Puerta1 HA] Target state: CLOSED
[Puerta1 HA] HA turn_off → 200: []
[Puerta1 HA] Poll: CLOSED (off)
🚀 Development
bash
cd ~/github/homebridge-homeassistant-garagedoor
npm version patch
git add .
git commit -m "vX.X.X: Update"
git push
npm publish --access public
ESPAÑOL
🚪 homebridge-homeassistant-garagedoor
Plugin Homebridge para controlar switches de Home Assistant como puertas de garaje nativas en HomeKit.

✨ Características
✅ Puerta de garaje nativa en app Home + Siri

✅ Config UI X con formulario automático

✅ Sincronización bidireccional (Home ↔ HA)

✅ Auto-cierre tras OPEN (3 segundos)

✅ Polling en tiempo real (30s por defecto)

✅ Error 400 solucionado (sin peticiones redundantes)

📦 Instalación
bash
npm install -g homebridge-homeassistant-garagedoor
⚙️ Configuración (Config UI X)
text
Plugins → HA Garage Door → NUEVO (+)

✅ Nombre: Puerta1 HA
✅ URL HA: http://192.168.68.239:8123
✅ Token HA: eyJhbGciOiJIUzI1NiIs... (Long-Lived Access Token)
✅ Entity ID: switch.Puerta1
✅ Intervalo Poll: 30 (segundos)
     [GUARDAR] ✓
🔑 Token Long-Lived Home Assistant
HA → Perfil Usuario (👤 abajo-izquierda)

Long-Lived Access Tokens → Crear Token

Nombre: Homebridge Puerta Garaje

Copiar token → Pegar en Config UI X

Token caduca: Nunca (salvo revocación manual)

📱 Comportamiento App Home
text
✅ Inicio: CERRADA
✅ Toca → ABRE (3s) → Auto CIERRA
✅ Siri: "Abre/cierra Puerta1 HA"
✅ Estado: Sincronización en tiempo real
🛠️ config.json manual
json
{
  "accessory": "HomeAssistantGarageDoor",
  "name": "Puerta1 HA",
  "haUrl": "http://192.168.68.239:8123",
  "haToken": "eyJhbGciOiJIUzI1NiIs...",
  "entityId": "switch.Puerta1",
  "pollInterval": 30
}
🔍 Logs esperados
text
[Puerta1 HA] Initialized - HA: http://192.168.68.239:8123 (switch.Puerta1)
[Puerta1 HA] Target state: OPEN
[Puerta1 HA] HA turn_on → 200: []
[Puerta1 HA] Auto-close en 3s...
[Puerta1 HA] Target state: CLOSED
[Puerta1 HA] HA turn_off → 200: []
[Puerta1 HA] Poll: CLOSED (off)
📈 Versiones
v1.1.3	Auto-close tras OPEN (3s)
v1.1.2	FIX "Cerrando" → CLOSED
v1.1.1	UI X alias alignment
v1.1.0	Config UI X schema inline
v1.0.9	Full config.schema.json
🤝 Contributing
bash
git clone https://github.com/torresyago/homebridge-homeassistant-garagedoor.git
cd homebridge-homeassistant-garagedoor
npm install
npm run build  # si existe
📄 License
MIT License - see LICENSE

⭐ Star this repo if useful!
¡Dale estrella si te sirve! 🚪✨
