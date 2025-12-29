# Homebridge Home Assistant Garage Door

Control **Home Assistant switches** as **Garage Door accessories** in HomeKit.

## Quick Start

{
"accessory": "HomeAssistantGarageDoor",
"name": "Garage Door",
"haUrl": "http://192.168.68.239:8123",
"haToken": "your_long_lived_token",
"entityId": "switch.Puerta1"
}

text

## Features
- ✅ Converts HA `switch` → HomeKit `GarageDoorOpener`
- ✅ Always starts **CLOSED** (safe default)
- ✅ Uses HA REST API (`switch.turn_on/off`)
- ✅ Full Config UI X support
- ✅ Works with Docker/Homebridge

## Installation
npm install -g homebridge-homeassistant-garagedoor

text

[Full docs](https://github.com/yago/homebridge-homeassistant-garagedoor)

