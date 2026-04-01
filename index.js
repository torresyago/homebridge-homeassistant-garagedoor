'use strict';

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

      this.isUpdating = false;

      this.service = new Service.GarageDoorOpener(this.name);
      this.service.getCharacteristic(Characteristic.TargetDoorState)
        .onSet((value) => this._setTargetState(value));

      this._forceClosedHard();

      this.log(`[${this.name}] Initialized - HA: ${this.haUrl} (${this.entityId})`);
      this.startPolling();
    }

    _setTargetState(newState) {
      if (this.isUpdating) {
        this.log(`[${this.name}] Skip (updating)`);
        return;
      }

      this.log(`[${this.name}] Target state: ${newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED'}`);

      if (newState === Characteristic.TargetDoorState.OPEN) {
        this.isUpdating = true;

        this._sendHACommand('turn_on');

        setTimeout(() => {
          this.log(`[${this.name}] Pulso 2s: turn_off`);
          this._sendHACommand('turn_off');

          setTimeout(() => {
            this.log(`[${this.name}] AUTO-CLOSED after pulse`);
            this._forceClosedHard();
            this.isUpdating = false;
          }, 500);
        }, 2000);
      }
    }

    _forceClosedHard() {
      if (this.isUpdating) return;

      this.isUpdating = true;
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
      this.service.setCharacteristic(Characteristic.TargetDoorState,  Characteristic.TargetDoorState.CLOSED);

      setTimeout(() => { this.isUpdating = false; }, 500);
    }

    async _sendHACommand(command) {
      try {
        const res = await fetch(`${this.haUrl}/api/services/switch/${command}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.haToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ entity_id: this.entityId }),
        });
        this.log(`[${this.name}] HA ${command} → ${res.ok ? 'OK' : res.status}`);
      } catch (e) {
        this.log(`[${this.name}] HA ${command} → ERROR ${e.message}`);
      }
    }

    pollHA() {
      this.log(`[${this.name}] Poll: ALWAYS CLOSED`);
      this._forceClosedHard();
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
