'use strict';

const axios = require('axios');

class HomeAssistantGarageDoor {
  constructor(log, config, api) {
    this.log = log;
    this.name = config.name;
    this.haUrl = config.haUrl;
    this.haToken = config.haToken;
    this.entityId = config.entityId;
    this.pollInterval = config.pollInterval || 30;
    this.currentState = 'CLOSED';
    this.targetState = 'CLOSED';
    this.polling = null;

    // ✅ FIX: API params para Service/Characteristic
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;

    this.log(`[${this.name}] Initializing HomeAssistantGarageDoor accessory...`);
    
    this.service = new this.Service.GarageDoorOpener(this.name);
    this.service.setCharacteristic(this.Characteristic.TargetDoorState, this.Characteristic.TargetDoorState.CLOSED);
    
    this.initHA();
  }

  initHA() {
    this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
    this.startPolling();
  }

  async sendHACommand(state) {
    if (this.currentState === state) {
      this.log(`[${this.name}] State matches target (${state}) → Skipping HA request`);
      return;
    }

    const service = state === 'OPEN' ? 'turn_on' : 'turn_off';
    try {
      const response = await axios.post(
        `${this.haUrl}/api/services/switch/${service}`,
        { entity_id: this.entityId },
        {
          headers: {
            'Authorization': `Bearer ${this.haToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      this.log(`[${this.name}] HA ${service} → ${response.status}: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.log(`[${this.name}] HA Error: ${error.message}`);
    }
  }

  async pollHA() {
    try {
      const response = await axios.get(
        `${this.haUrl}/api/states/${this.entityId}`,
        {
          headers: { 'Authorization': `Bearer ${this.haToken}` },
          timeout: 5000
        }
      );
      
      const haState = response.data.state;
      const doorState = haState === 'on' ? 'OPEN' : 'CLOSED';
      
      if (this.currentState !== doorState) {
        this.currentState = doorState;
        this.service.setCharacteristic(this.Characteristic.CurrentDoorState, 
          doorState === 'OPEN' ? 
            this.Characteristic.CurrentDoorState.OPEN : 
            this.Characteristic.CurrentDoorState.CLOSED
        );
        this.log(`[${this.name}] Poll: ${doorState} (${haState})`);
      }
    } catch (error) {
      this.log(`[${this.name}] Poll error: ${error.message}`);
    }
  }

  startPolling() {
    if (this.pollInterval > 0) {
      this.polling = setInterval(() => this.pollHA(), this.pollInterval * 1000);
      this.log(`[${this.name}] Polling started (${this.pollInterval}s)`);
    }
  }

  getServices() {
    this.service.getCharacteristic(this.Characteristic.TargetDoorState)
      .on('set', (value, callback) => {
        const newState = value === this.Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED';
        this.log(`[${this.name}] Target state: ${newState}`);
        this.targetState = newState;
        this.sendHACommand(newState);
        this.service.setCharacteristic(this.Characteristic.CurrentDoorState, 
          newState === 'OPEN' ? 
            this.Characteristic.CurrentDoorState.OPEN : 
            this.Characteristic.CurrentDoorState.CLOSED);
        callback();
      });

    this.service.getCharacteristic(this.Characteristic.CurrentDoorState)
      .updateValue(this.Characteristic.CurrentDoorState.CLOSED);

    return [this.service];
  }
}

module.exports = (homebridge) => {
  homebridge.registerAccessory("homebridge-homeassistant-garagedoor", "HomeAssistantGarageDoor", HomeAssistantGarageDoor);
};

