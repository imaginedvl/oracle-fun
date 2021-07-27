'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Settings
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Settings')) parent.Settings = {};
    const result = parent.Settings;

    let _rootPath = "Oracle";

    const _validPathChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const _normalizePath = function (path) {
        let isSpecialChars = false;
        let result = "";
        if (Oracle.isString(path)) {
            for (let i = 0; i < path.length; i++) {
                const c = path.charAt(i);
                if (_validPathChars.indexOf(c) > -1) {
                    isSpecialChars = false;
                    result += c;
                }
                else {
                    if (!isSpecialChars) {
                        isSpecialChars = true;
                        result += '-';
                    }
                }
            }
        }
        return result;
    }

    result.setCurrentUrlAsRootPath = function (includeParameters = true) {
        Oracle.Settings.setRootPath("URL-" + window.location.href);
    }

    result.setRootPath = function (rootPath) {
        _rootPath = _normalizePath(rootPath);
        Oracle.Logger.logDebug("Settings Root Path: " + _rootPath);
    }

    result.saveUserSettings = function (name, value) {
        Oracle.Storage.Local.writeValue(_rootPath, name, value);
        console.log("SAVE", value);
    }

    result.loadUserSettings = function (name, defaultValue) {
        const result = Oracle.Storage.Local.readValue(_rootPath, name, defaultValue);
        console.log("LOAD", result);
        return result;
    }

    result.normalizePath = _normalizePath;

    return parent;
}(Oracle));
