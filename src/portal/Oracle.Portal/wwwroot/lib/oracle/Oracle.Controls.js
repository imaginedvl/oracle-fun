'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    const result = parent.Controls;

    const _computeSettingsPathForElement = function (element) {
        const path = "";
        let data = null;
        if (!Oracle.isEmptyOrWhiteSpaces(element)) {
            element = $(element);
            data = element.attr("data-settings-path")
            if (!Oracle.isEmptyOrWhiteSpaces(data)) {
                path = data;
            }
            element = element.parent('[data-settings-path!=""][data-settings-path]');
            while (element.length > 0) {
                data = element.attr("data-settings-path")
                if (!Oracle.isEmptyOrWhiteSpaces(data)) {
                    path = path + "-" + data;
                }
                element = element.parent('[data-settings-path!=""][data-settings-path]');
            }
        }
        return path;
    }

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
                this.settingsName = Oracle.Settings.normalizePath(this.name);
            }
            else {
                this.settingsName = null;
            }
            this.element.attr("data-control-initialized", "false");
            this.onInitialize(controlSettings)
            this.isInitialized = true;
            this.element.attr("data-control-initialized", "true");
            Oracle.Logger.logDebug("Control[" + this.type + "] initialized: " + this.id, { control: this });
        }

        onInitialize() {
        }

        onBuildUserSettings(userSettings) {
        }

        saveUserSettings() {
            if (!this.isInitialized && !Oracle.isEmptyOrWhiteSpaces(this.settingsName)) {
                const userSettings = {};
                this.onBuildUserSettings(userSettings);
            }
        }

    };

    result.computeSettingsPathForElement = _computeSettingsPathForElement;

    return parent;
}(Oracle));
