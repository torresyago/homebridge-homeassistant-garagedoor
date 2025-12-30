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
      this.pollInterval = config.pollInterval || 30;
      
      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.targetState = Characteristic.TargetDoorState.CLOSED;
      
      this.service = new Service.GarageDoorOpener(this.name);
      this.service.getCharacteristic(Characteristic.TargetDoorState)
        .on('set', this.setTargetState.bind(this));
      
      // SIEMPRE FUERZA CLOSED al inicio
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
      
      this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
      this.startPolling();
    }
    
    setTargetState(newState, callback) {
      this.log(`[${this.name}] Target state: ${newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED'}`);
      
      if (newState === Characteristic.TargetDoorState.OPEN) {
        this.sendHACommand('turn_on');
        
        // ✅ AUTO-CLOSED INMEDIATO (1.5s)
        setTimeout(() => {
          this.log(`[${this.name}] ✅ AUTO-CLOSED después OPEN (1.5s)`);
          this.currentState = Characteristic.CurrentDoorState.CLOSED;
          this.targetState = Characteristic.TargetDoorState.CLOSED;
          this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
          this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
        }, 1500);
      }
      
      // ✅ SIEMPRE fuerza CLOSED en TargetState
      this.log(`[${this.name}] ✅ TargetState → Fuerza CurrentState CLOSED`);
      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      
      callback();
    }
    
    async sendHACommand(command) {
      const url = `${this.haUrl}/api/services/switch/${command}`;
      request.post({
        url,
        headers: { 'Authorization': `Bearer ${process.env.HA_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: this.entityId })
      }, (err, res) => {
        if (res && res.statusCode === 200) {
          this.log(`[${this.name}] HA ${command} → 200: []`);
        }
      });
    }
    
    async pollHA() {
      this.log(`[${this.name}] Poll: ALWAYS CLOSED (forced)`);
      this.currentState = Characteristic.CurrentDoorState.CLOSED;
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
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
