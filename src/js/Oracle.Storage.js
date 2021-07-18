'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Storage')) parent.Storage = {};

    const _result = parent.Storage;

    let _localStorage = null;
    if (typeof (Storage) !== "undefined") {
        _localStorage = window.localStorage;
    }
    else {
        Oracle.Logger.logWarning("Local Storage not supported by this browser/environment, using memory instead");
    }
    _result.useMemory = _localStorage === null;

    // To make this compatible with everything, we will use "string" to store the data (cookie, storage, memory)
    // Then this module will have typed method
    // For now, we will assume 2 things:
    // 1 - We are limited by a simple key, value (where both are strings)
    // 2 - The value has a limit in size

    _result.onReadLocalStringValueFromStorage = function (name) {
        return _localStorage.getItem(name);
    }

    _result.onWriteLocalStringValueToStorage = function (name, value) {
        _localStorage.setItem(name, value);
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

    const _normalizeLocalValueName = function (context, name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
            // TODO: LD: normalize the string with the valid chars only and replace invalid chars with "_"
            return context + "|" + name;
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    const _memoryData = {};
    const _readLocalStringValueFromStorage = function (context, name) {
        name = _normalizeLocalValueName(context, name);
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

    const _writeLocalStringValueToStorage = function (context, name, value) {
        name = _normalizeLocalValueName(context, name);
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
    // Base Read/Write class
    // ---------------------------------------------------------------------------------------------------------------- //
    const _baseStorageClass = class {

        constructor(settings) {
            this.readCallback = settings.readCallback;
            this.writeCallback = settings.writeCallback;
        }

        readValue(path, name, defaultValue = null) {
            const storedValue = this.readCallback(path, name);
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
                    case _localPrefixes.JSON:
                        return JSON.parse(storedValue.substring(1));
                }
            }
            else {
                return defaultValue;
            }
        }

        writeValue(path, name, value) {
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
            else if (typeof (value) === 'object') {
                storedValue = _localPrefixes.JSON + JSON.stringify(value);
            }
            else {
                throw new Oracle.Errors.RuntimeError("Cannot store value because it is not supported.");
            }
            Oracle.Logger.logDebug("Storing local value.", { name: name, storedValue: storedValue });
            this.writeCallback(path, name, storedValue);
        }
    }

    _result.Local = new _baseStorageClass(
        {
            readCallback: _readLocalStringValueFromStorage,
            writeCallback: _writeLocalStringValueToStorage
        });

    _result.Session = new _baseStorageClass(
        {
            readCallback: (path, name) => { return sessionStorage[_normalizeLocalValueName(path, name)] },
            writeCallback: (path, name, value) => { sessionStorage[_normalizeLocalValueName(path, name)] = value; }
        });

    return parent;
}(Oracle));
