'use strict';

const fetch = require('node-fetch');

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
      this.isUpdating = false; // ✅ ANTI-LOOP
      
      this.service = new Service.GarageDoorOpener(this.name);
      this.service.getCharacteristic(Characteristic.TargetDoorState)
        .on('set', this.setTargetState.bind(this));
      
      // SIEMPRE CLOSED al inicio
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
      
      this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
      this.startPolling();
    }
    
    async setTargetState(newState, callback) {
      if (this.isUpdating) {
        this.log(`[${this.name}] Skip (updating)`);
        return callback();
      }
      
      this.log(`[${this.name}] Target state: ${newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED'}`);
      
      if (newState === Characteristic.TargetDoorState.OPEN) {
        await this.sendHACommand('turn_on');
        
        // ✅ AUTO-CLOSED (sin loop)
        setTimeout(() => {
          this.log(`[${this.name}] ✅ AUTO-CLOSED después OPEN`);
          this.forceClosed();
        }, 1500);
      }
      
      callback();
    }
    
    forceClosed() {
      if (this.isUpdating) return;
      
      this.isUpdating = true;
      this.log(`[${this.name}] ✅ Fuerza CLOSED`);
      
      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.targetState = Characteristic.TargetDoorState.CLOSED;
      
      // ✅ SIN setCharacteristic(TargetDoorState) = NO loop
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      
      setTimeout(() => {
        this.isUpdating = false;
      }, 100);
    }
    
    async sendHACommand(command) {
      try {
        const response = await fetch(`${this.haUrl}/api/services/switch/${command}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.haToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ entity_id: this.entityId })
        });
        
        if (response.ok) {
          this.log(`[${this.name}] HA ${command} → 200 OK`);
        }
      } catch (error) {
        this.log(`[${this.name}] HA ERROR:`, error.message);
      }
    }
    
    pollHA() {
      this.log(`[${this.name}] Poll: ALWAYS CLOSED`);
      this.forceClosed();
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
