'use strict';

const PLUGIN_NAME   = 'homebridge-homeassistant-garagedoor';
const PLATFORM_NAME = 'HomeAssistantGarageDoor';

module.exports = (api) => {
  api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, HomeAssistantGarageDoorPlatform);
};

class HomeAssistantGarageDoorPlatform {
  constructor(log, config, api) {
    this.log         = log;
    this.config      = config;
    this.api         = api;
    this.accessories = new Map(); // uuid → PlatformAccessory

    if (!config) return;

    api.on('didFinishLaunching', () => {
      this._discoverDevices();
    });
  }

  // Called by Homebridge for every cached accessory on startup
  configureAccessory(accessory) {
    this.accessories.set(accessory.UUID, accessory);
  }

  _discoverDevices() {
    let devices = this.config.devices || [];

    // Legacy compatibility: if no devices array but old accessory-style fields exist at platform level
    if (devices.length === 0 && this.config.haUrl && this.config.entityId && this.config.haToken) {
      this.log.warn(`[${PLATFORM_NAME}] Legacy config detected. Please migrate to the new format with a "devices" array. See README for instructions.`);
      devices = [{
        name:         this.config.name || 'Garage Door',
        haUrl:        this.config.haUrl,
        entityId:     this.config.entityId,
        haToken:      this.config.haToken,
        pollInterval: this.config.pollInterval,
      }];
    }

    const configuredUUIDs = new Set();

    for (const deviceConfig of devices) {
      if (!deviceConfig.name || !deviceConfig.haUrl || !deviceConfig.entityId || !deviceConfig.haToken) {
        this.log.warn(`[${PLATFORM_NAME}] Skipping device with missing required fields:`, deviceConfig.name || '(unnamed)');
        continue;
      }

      const uuid = this.api.hap.uuid.generate(deviceConfig.name + deviceConfig.entityId);
      configuredUUIDs.add(uuid);

      let accessory = this.accessories.get(uuid);
      if (accessory) {
        this.log.info(`[${deviceConfig.name}] Restoring cached accessory`);
      } else {
        this.log.info(`[${deviceConfig.name}] Adding new accessory`);
        accessory = new this.api.platformAccessory(deviceConfig.name, uuid);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        this.accessories.set(uuid, accessory);
      }

      new GarageDoorHandler(this.log, deviceConfig, accessory, this.api.hap);
    }

    // Remove accessories no longer in config
    for (const [uuid, accessory] of this.accessories) {
      if (!configuredUUIDs.has(uuid)) {
        this.log.info(`[${accessory.displayName}] Removing stale accessory`);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        this.accessories.delete(uuid);
      }
    }
  }
}

class GarageDoorHandler {
  constructor(log, config, accessory, hap) {
    this.log         = log;
    this.config      = config;
    this.accessory   = accessory;
    this.hap         = hap;
    this.name        = config.name;
    this.haUrl       = config.haUrl;
    this.entityId    = config.entityId;
    this.haToken     = config.haToken;
    this.pollInterval = config.pollInterval || 30;
    this.isUpdating  = false;

    const { Service, Characteristic } = hap;

    // AccessoryInformation
    accessory.getService(Service.AccessoryInformation)
      .setCharacteristic(Characteristic.Manufacturer, 'Home Assistant')
      .setCharacteristic(Characteristic.Model,        'Garage Door')
      .setCharacteristic(Characteristic.SerialNumber,  config.entityId);

    // GarageDoorOpener service
    this.service = accessory.getService(Service.GarageDoorOpener)
      || accessory.addService(Service.GarageDoorOpener, this.name);

    this.service.getCharacteristic(Characteristic.TargetDoorState)
      .onSet((value) => this._setTargetState(value));

    this._forceClosedHard();

    this.log.info(`[${this.name}] Initialized — HA: ${this.haUrl} (${this.entityId})`);
    this._startPolling();
  }

  _setTargetState(newState) {
    const { Characteristic } = this.hap;

    if (this.isUpdating) {
      this.log.debug(`[${this.name}] Skip (updating)`);
      return;
    }

    const label = newState === Characteristic.TargetDoorState.OPEN ? 'OPEN' : 'CLOSED';
    this.log.info(`[${this.name}] Target state: ${label}`);

    if (newState === Characteristic.TargetDoorState.OPEN) {
      this.isUpdating = true;
      this._sendHACommand('turn_on');

      setTimeout(() => {
        this.log.info(`[${this.name}] Pulse 2s: turn_off`);
        this._sendHACommand('turn_off');

        setTimeout(() => {
          this.log.info(`[${this.name}] AUTO-CLOSED after pulse`);
          this._forceClosedHard();
          this.isUpdating = false;
        }, 500);
      }, 2000);
    }
  }

  _forceClosedHard() {
    const { Characteristic } = this.hap;
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.service.updateCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
    this.service.updateCharacteristic(Characteristic.TargetDoorState,  Characteristic.TargetDoorState.CLOSED);
    setTimeout(() => { this.isUpdating = false; }, 500);
  }

  async _sendHACommand(command) {
    try {
      const res = await fetch(`${this.haUrl}/api/services/switch/${command}`, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${this.haToken}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ entity_id: this.entityId }),
      });
      this.log.info(`[${this.name}] HA ${command} → ${res.ok ? 'OK' : res.status}`);
    } catch (e) {
      this.log.error(`[${this.name}] HA ${command} → ERROR: ${e.message}`);
    }
  }

  _startPolling() {
    setInterval(() => {
      this.log.debug(`[${this.name}] Poll: forcing CLOSED`);
      this._forceClosedHard();
    }, this.pollInterval * 1000);
    this.log.info(`[${this.name}] Polling started (${this.pollInterval}s)`);
  }
}
