'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Storage')) parent.Storage = {};

    const result = parent.Storage;

    // Those 2 methods can be overriden later
    result.onReadLocalStringValue = function (name, defaultValue = null) {
        // To be overriden for now
        return defaultValue;
    }

    result.onSetLocalStringValue = function (name, value) {
    }

    result.onListStringValues = function () {
        return [];
    }

    // If the browser supports local storage, let's use it. If not I will have everything in memory (and then not really stored)
    if (typeof (Storage) !== "undefined" && true) {
    }
    else {
        const _memoryData = {};
        result.onReadLocalStringValue = function (name, defaultValue = null) {
            if (_memoryData.hasOwnProperty(name)) {
                return _memoryData[name];
            }
            else {
                return defaultValue;
            }
        }

        result.onSetLocalStringValue = function (name, value) {
            _memoryData[name] = value;
        }

        result


    }



    const _normalizeLocalName = function (name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    result.readLocalStringValue = function (name, defaultValue = null) {
        name = _normalizeLocalName(name);
        return defaultValue;
    }

    result.setLocalStringValue = function (name, value) {
        name = _normalizeLocalName(name);
    }

    return parent;
}(Oracle));
