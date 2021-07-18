'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Storage')) parent.Storage = {};

    const _result = parent.Storage;

    _result.useMemory = typeof (Storage) === "undefined";

    // To make this compatible with everything, we will use "string" to store the data (cookie, storage, memory)
    // Then this module will have typed method

    // Those 2 methods can be overriden later
    _result.onReadLocalStringValueFromStorage = function (name) {
        // To be overriden for now
        return defaultValue;
    }

    _result.onWriteLocalStringValueToStorage = function (name, value) {
    }

    const _localValueNameValidChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.|';
    const _localPrefixes =
    {
        Null: 'n',
        Undefined: 'u',
        String: 'S',
        Number: 'N',
        Boolean: 'B',
        Date: 'D',
        JSON: 'J'
    }

    const _normalizeLocalValueName = function (name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
            // TODO: LD: normalize the string with the valid chars only and replace invalid chars with "_"
            return name;
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    const _memoryData = {};
    const _readLocalStringValueFromStorage = function (name) {
        name = _normalizeLocalValueName(name);
        if (_result.useMemory) {
            if (_memoryData.hasOwnProperty(name)) {
                return _memoryData[name];
            }
            else {
                return null;
            }
        }
        else if (_result.onReadLocalStringValueFromStorage) {
            const resultValue = _result.onReadLocalStringValueFromStorage(name);
            if (Oracle.isEmptyOrWhiteSpaces(resultValue)) {
                return null;
            }
            else {
                return resultValue;
            }
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage write function not set.");
        }
    }

    const _writeLocalStringValueToStorage = function (name, value) {
        name = _normalizeLocalValueName(name);
        value = Oracle.toNullableValue(value);
        if (_result.useMemory) {
            _memoryData[name] = value;
        }
        else if (_result.onWriteLocalStringValueToStorage) {
            _result.onWriteLocalStringValueToStorage(name, value);
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage read function not set.");
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Read / Write method for each supported type 
    // ---------------------------------------------------------------------------------------------------------------- //

    /* String */
    _result.readLocalValue = function (name, defaultValue = null) {
        return "X";
    }

    _result.writeLocalValue = function (name, value) {
        let storedValue;
        if (value === undefined) {
            storedValue = _localPrefixes.Undefined;
        }
        else if (value === null) {
            storedValue = _localPrefixes.Null;
        }
        else if (typeof (value) === 'boolean') {
            storedValue = _localPrefixes.Boolean + value;
        }
        else {

        }
        Oracle.Logger.logDebug("Storing local value.", { name: name, storedValue: storedValue });
        _writeLocalStringValueToStorage(name, storedValue);
    }

    return parent;
}(Oracle));
