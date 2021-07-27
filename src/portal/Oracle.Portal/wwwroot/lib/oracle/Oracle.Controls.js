'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    const result = parent.Controls;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Renderers
    // ---------------------------------------------------------------------------------------------------------------- //
    const _renderers = {};

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Control
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Control = class {

        constructor(controlSettings) {
            this.isInitialized = false;
            this.name = controlSettings.name;
            this.id = Oracle.generateId(25);
            this.type = controlSettings.type;
            if (Oracle.isEmpty(controlSettings.target)) {
                this.element = $("<" + controlSettings.elementType + ">");
            }
            else {
                this.element = $(controlSettings.target);
            }
            this.element.addClass("oracle control " + this.type);
            this.element.attr("data-control-id", this.id);
            this.element.attr("data-control-type", this.type);
            if (!Oracle.isEmptyOrWhiteSpaces(this.name)) {
                this.element.attr("data-control-name", this.name);
            }
            this.element.attr("data-control-initialized", "false");
            this.onInitialize(controlSettings)
            this.isInitialized = true;
            this.element.attr("data-control-initialized", "true");
            Oracle.Logger.logDebug("Control[" + this.type + "] initialized: " + this.id, { grid: this, type: this.type });
        }

        onInitialize() {
        }

        onBuildUserSettings(userSettings) {
        }

        saveUserSettings() {
            if (!this.isInitialized) {
                const userSettings = {};
                this.onBuildUserSettings(userSettings);
            }
        }

    };

    return parent;
}(Oracle));
