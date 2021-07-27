'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    const result = parent.Controls;

    const _computeSettingsPathForElement = function (element, name) {
        let path = "";
        let data = null;
        if (!Oracle.isEmptyOrWhiteSpaces(element)) {
            element = $(element);
            data = element.attr("data-control-path")
            if (!Oracle.isEmptyOrWhiteSpaces(data)) {
                path = data;
            }
            element = element.closestExcludingSelf('[data-control-path!=""][data-control-path]');
            while (element.length > 0) {
                data = element.attr("data-control-path")
                if (!Oracle.isEmptyOrWhiteSpaces(data)) {
                    if (path !== '') {
                        path = data + "-" + path;
                    }
                    else {
                        path = data;
                    }
                }
                element = element.closestExcludingSelf('[data-control-path!=""][data-control-path]');
            }
        }
        if (Oracle.isEmptyOrWhiteSpaces(name)) {
            if (path === '') {
                return null;
            }
            else {
                return Oracle.Settings.normalizePath(path);
            }
        }
        else {
            if (path === '') {
                return Oracle.Settings.normalizePath(name);
            }
            else {
                return Oracle.Settings.normalizePath(path + "-" + name);
            }
        }
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
                if (controlSettings.parent) {
                    const parent = $(controlSettings.parent);
                    parent.append(this.element);
                }
            }
            else {
                this.element = $(controlSettings.target);
            }
            this.element.addClass("oracle control " + this.type);
            this.element.attr("data-control-id", this.id);
            this.element.attr("data-control-type", this.type);
            if (!Oracle.isEmptyOrWhiteSpaces(this.name)) {
                this.element.attr("data-control-name", this.name);
                this.settingsName = _computeSettingsPathForElement(this.element, Oracle.Settings.normalizePath(this.name));
            }
            else {
                this.settingsName = null;
            }
            let userSettings = null;
            if (this.settingsName !== null) {
                userSettings = Oracle.Settings.loadUserSettings(this.settingsName, null);
            }
            this.element.attr("data-control-initialized", "false");
            this.onInitialize(controlSettings, userSettings)
            this.isInitialized = true;
            this.element.attr("data-control-initialized", "true");
            Oracle.Logger.logDebug("Control[" + this.type + "] initialized: " + this.id, { control: this });
        }

        onInitialize() {
            // To be overriden 
        }

        onBuildUserSettings(userSettings) {
            // To be overriden 
        }

        saveUserSettings() {
            if (this.isInitialized && !Oracle.isEmptyOrWhiteSpaces(this.settingsName)) {
                const userSettings = {};
                this.onBuildUserSettings(userSettings);
                Oracle.Settings.saveUserSettings(this.settingsName, userSettings);
            }
        }

    };

    result.computeSettingsPathForElement = _computeSettingsPathForElement;

    return parent;
}(Oracle));
