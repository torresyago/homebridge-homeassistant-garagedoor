var Service, Characteristic;
const axios = require('axios');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-homeassistant-garagedoor", "HomeAssistantGarageDoor", HomeAssistantGarageDoor);
};

function HomeAssistantGarageDoor(log, config) {
    this.log = log;
    this.name = config.name || "Garage Door";
    this.haUrl = config.haUrl || "http://192.168.68.239:8123";
    this.haToken = config.haToken;
    this.entityId = config.entityId || "switch.Puerta1";
    
    // Estado inicial SIEMPRE CERRADO
    this.currentState = Characteristic.CurrentDoorState.CLOSED;
    
    this.service = new Service.GarageDoorOpener(this.name);
    this.informationService = new Service.AccessoryInformation();
    
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, "Home Assistant")
        .setCharacteristic(Characteristic.Model, "Garage Door")
        .setCharacteristic(Characteristic.SerialNumber, this.entityId);
    
    this.service.getCharacteristic(Characteristic.TargetDoorState)
        .on('set', this.setTargetState.bind(this));
    
    this.service.getCharacteristic(Characteristic.CurrentDoorState)
        .on('get', this.getCurrentState.bind(this))
        .setValue(this.currentState);
    
    this.service.getCharacteristic(Characteristic.TargetDoorState)
        .setValue(Characteristic.CurrentDoorState.CLOSED);
    
    this.log("[%s] Initialized - HA: %s (%s)", this.name, this.haUrl, this.entityId);
}

HomeAssistantGarageDoor.prototype = {
    getServices: function() {
        return [this.informationService, this.service];
    },

    setTargetState: function(targetState, callback) {
        this.log("[%s] Target state: %s", this.name, targetState === 0 ? "OPEN" : "CLOSED");
        
        const service = targetState === 0 ? "switch.turn_on" : "switch.turn_off";
        
        axios.post(`${this.haUrl}/api/services/switch/${service}`, 
            { entity_id: this.entityId },
            {
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        )
        .then(() => {
            this.log("[%s] Command sent to HA: %s", this.name, service);
            callback(null);
        })
        .catch(err => {
            this.log("[%s] HA Error: %s", this.name, err.message);
            callback(err);
        });
    },

    getCurrentState: function(callback) {
        // SIEMPRE devuelve CERRADO (como tu plugin anterior)
        callback(null, this.currentState);
    }
};

