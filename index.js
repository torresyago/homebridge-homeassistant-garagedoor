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
      
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
      
      this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
      this.startPolling();
    }
    
    setTargetState(newState, callback) {
      if (this.isUpdating) {
        return callback();
      }
      
      this.log(`[${this.name}] Target state: ${newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED'}`);
      
      if (newState === Characteristic.TargetDoorState.OPEN) {
        this.sendHACommand('turn_on');
        setTimeout(() => {
          this.log(`[${this.name}] ✅ AUTO-CLOSED después OPEN`);
          this.forceClosedHard();
        }, 1500);
      }
      
      callback();
    }
    
    forceClosedHard() {
        this.service.setCharacteristic(this.Characteristic.TargetDoorState, this.Characteristic.TargetDoorState.CLOSED);
      if (this.isUpdating) return;
      this.isUpdating = true;
      this.log(`[${this.name}] ✅ Fuerza CLOSED`);
      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      setTimeout(() => { this.isUpdating = false; }, 100);
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
          this.log(`[${this.name}] HA ${command} → ${res ? res.statusCode : 'ERROR'}`);
        }
      });
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
