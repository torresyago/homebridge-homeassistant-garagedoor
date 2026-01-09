'use strict';

const request = require('request');

module.exports = (homebridge) => {
  const { Service, Characteristic } = homebridge.hap;

  class HomeAssistantGarageDoor {
    constructor(log, config) {
      this.log = log;
      this.name = config.name;
      this.haUrl = config.haUrl;
      this.entityId = config.entityId;
      this.haToken = config.haToken;
      this.pollInterval = config.pollInterval || 30;

      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.targetState = Characteristic.TargetDoorState.CLOSED;
      this.isUpdating = false;

      this.service = new Service.GarageDoorOpener(this.name);
      this.service.getCharacteristic(Characteristic.TargetDoorState)
        .on('set', this.setTargetState.bind(this));

      // FUERZA TOTAL CLOSED al inicio
      this.forceClosedHard();

      this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
      this.startPolling();
    }

    setTargetState(newState, callback) {
      if (this.isUpdating) {
        this.log(`[${this.name}] Skip (updating)`);
        return callback();
      }

      this.log(`[${this.name}] Target state: ${newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED'}`);

      if (newState === Characteristic.TargetDoorState.OPEN) {
        this.isUpdating = true;
        
        // PULSO: turn_on → 2s → turn_off
        this.sendHACommand('turn_on');
        
        setTimeout(() => {
          this.log(`[${this.name}] 🔄 Pulso 2s: turn_off`);
          this.sendHACommand('turn_off');
          
          // Auto-reset a CLOSED después del pulso completo
          setTimeout(() => {
            this.log(`[${this.name}] ✅ AUTO-CLOSED después pulso`);
            this.forceClosedHard();
            this.isUpdating = false;
          }, 500);  // 0.5s extra después del turn_off
        }, 2000);  // 2 segundos después del turn_on
      } else {
        // Si piden cerrar, ignorar (puerta siempre "cerrada")
        callback();
      }
      
      callback();
    }

    forceClosedHard() {
      if (this.isUpdating) return;

      this.isUpdating = true;
      this.log(`[${this.name}] 🔥 FUERZA TOTAL CLOSED (Home app)`);

      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.targetState = Characteristic.TargetDoorState.CLOSED;

      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);

      setTimeout(() => {
        this.isUpdating = false;
      }, 500);
    }

    sendHACommand(command) {
      const url = `${this.haUrl}/api/services/switch/${command}`;
      request.post({
        url,
        headers: {
          'Authorization': `Bearer ${this.haToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entity_id: this.entityId })
      }, (err, res) => {
        if (res && res.statusCode === 200) {
          this.log(`[${this.name}] HA ${command} → 200 OK`);
        } else {
          this.log(`[${this.name}] HA ${command} → ${res ? res.statusCode : 'ERROR'} ${err ? err.message : ''}`);
        }
      });
    }

    pollHA() {
      this.log(`[${this.name}] Poll: ALWAYS CLOSED`);
      this.forceClosedHard();
    }

    startPolling() {
      setInterval(() => this.pollHA(), this.pollInterval * 1000);
      this.log(`[${this.name}] Polling started (${this.pollInterval}s)`);
    }

    getServices() {
      return [this.service];
    }
  }

  homebridge.registerAccessory('homebridge-homeassistant-garagedoor', 'HomeAssistantGarageDoor', HomeAssistantGarageDoor);
};

