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
    // For now, we will assume 2 things:
    // 1 - We are limited by a simple key, value (where both are strings)
    // 2 - The value has a limit in size

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
        EmptyString: 's',
        String: 'S',
        Number: 'N',
        Boolean: 'B',
        Date: 'D',
        JSON: 'J'
    }

    const _normalizeLocalValueName = function (name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
            // TODO: LD: normalize the string with the valid chars only and replace invalid chars with "_"
            return _localStorageContext + "|" + name;
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    const _memoryData = {};
    let _localStorageContext = "Oracle";

    _result.setLocalStorageContext = function (context) {
        if (Oracle.isString(context) && !Oracle.isEmptyOrWhiteSpaces(context)) {

        }
        else {
            _localStorageContext = "Oracle";
        }
    }
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

    /* Object */
    _result.readLocalValue = function (name, defaultValue = null) {
        const storedValue = _readLocalStringValueFromStorage(name);
        if (Oracle.isString(storedValue) && !Oracle.isEmptyOrWhiteSpaces(storedValue)) {
            const char = storedValue.charAt(storedValue);
            switch (char) {
                case _localPrefixes.Undefined:
                    return undefined;
                case _localPrefixes.Null:
                    return null;
                case _localPrefixes.EmptyString:
                    return "";
                case _localPrefixes.String:
                    return storedValue.substring(1);
                case _localPrefixes.Number:
                    return Number(storedValue.substring(1));
                case _localPrefixes.Boolean:
                    return Boolean(storedValue.substring(1));
                case _localPrefixes.Date:
                    return new Date(storedValue.substring(1));
            }
        }
        else {
            return defaultValue;
        }
    }

    _result.writeLocalValue = function (name, value) {
        let storedValue;
        if (value === undefined) {
            storedValue = _localPrefixes.Undefined;
        }
        else if (value === null) {
            storedValue = _localPrefixes.Null;
        }
        else if (typeof (value) === 'number') {
            storedValue = _localPrefixes.Number + value;
        }
        else if (typeof (value) === 'boolean') {
            storedValue = _localPrefixes.Boolean + value;
        }
        else if (typeof (value) === 'string' || value instanceof String) {
            if (value === '') {
                storedValue = _localPrefixes.EmptyString;
            }
            else {
                storedValue = _localPrefixes.String + value;
            }
        }
        else if (value instanceof Date) {
            storedValue = _localPrefixes.Date + value.toISOString();
        }
        else {
            throw new Oracle.Errors.RuntimeError("Cannot store value because it is not supported.");
        }
        Oracle.Logger.logDebug("Storing local value.", { name: name, storedValue: storedValue });
        _writeLocalStringValueToStorage(name, storedValue);
    }

    _result.setLocalStorageContext();
    return parent;
}(Oracle));
