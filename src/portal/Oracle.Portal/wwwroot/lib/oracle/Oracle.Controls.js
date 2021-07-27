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
            this.id = Oracle.generateId(25);
            this.type = controlSettings.type;
            if (Oracle.isEmpty(controlSettings.target)) {
                this.element = $("<" + controlSettings.elementType + " class='" + this.type + " oracle control' data-control-id='" + this.id + "' data-control-type='" + this.type + "'  >");
            }
            else {
                this.element = $(controlSettings.target);
                this.element.addClass("oracle control " + this.type);
                this.element.attr("data-control-id", this.id);
                this.element.attr("data-control-type", this.typee);
            }
            this.element.attr("data-control-is-initialized", "false");
            this.onInitialize(controlSettings)
            this.isInitialized = true;
            this.element.attr("data-control-is-initialized", "true");
            Oracle.Logger.logDebug("Control[" + this.type + "] initialized: " + this.id, { grid: this, type: this.type });
        }

        onInitialize() {
        }

        onBuildUserSettings(userSettings) {
        }

        saveUserSettings() {
            const userSettings = {};
            this.onBuildUserSettings(userSettings);
        }

    };

    return parent;
}(Oracle));
