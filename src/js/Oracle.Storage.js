'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Storage')) parent.Storage = {};

    const _result = parent.Storage;

    // Those 2 methods can be overriden later
    _result.onReadLocalStringValue = function (name) {
        // To be overriden for now
        return defaultValue;
    }

    _result.onWriteLocalStringValue = function (name, value) {
    }

    _result.onListStringValues = function () {
        return [];
    }

    // If the browser supports local storage, let's use it. If not I will have everything in memory (and then not really stored)
    if (typeof (Storage) !== "undefined" && false) {
    }
    else {
        const _memoryData = {};
        _result.onReadLocalStringValue = function (name) {
            if (_memoryData.hasOwnProperty(name)) {
                return _memoryData[name];
            }
            else {
                return defaultValue;
            }
        }

        _result.onWriteLocalStringValue = function (name, value) {
            _memoryData[name] = value;
        }
    }



    const _normalizeLocalName = function (name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
            return name;
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    _result.readLocalStringValue = function (name, defaultValue = null) {
        name = _normalizeLocalName(name);
        if (_result.onReadLocalStringValue) {
            const resultValue = _result.onReadLocalStringValue(name);
            if (resultValue === undefined) {
                return defaultValue;
            }
            else {
                return resultValue;
            }
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage read/write function not set.");
        }
    }

    _result.writeLocalStringValue = function (name, value) {
        name = _normalizeLocalName(name);
        value = Oracle.toNullableValue(value);
        if (_result.onWriteLocalStringValue) {
            _result.onWriteLocalStringValue(name, value);
        }
    }

    return parent;
}(Oracle));
