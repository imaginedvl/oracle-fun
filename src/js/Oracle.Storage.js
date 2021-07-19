'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Storage')) parent.Storage = {};

    const _result = parent.Storage;

    if (typeof (Storage) !== "undefined") {
        _result.onReadStringValueFromLocalStorage = function (name) {
            return window.localStorage.getItem(name);
        }
        _result.onWriteStringValueToLocalStorage = function (name, value) {
            window.localStorage.setItem(name, value);
        }
        _result.onClearLocalStorage = function (name) {
            window.localStorage.clear();
        }
        _result.onRemoveStringValueFromLocalStorage = function (name) {
            window.localStorage.removeItem(name);
        }
        _result.onListStringValueNameByPathFromLocalStorage = function (path) {
            const result = [];
            for (var i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key.startsWith(path)) {
                    result.push(key.substring(path.length + 1));
                }
            }
            return result;
        }
    }
    else {
        Oracle.Logger.logWarning("Local Storage not supported by this browser/environment.");
    }

    const _localValueNameValidChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.|';
    const _normalizeName = function (name) {
        return name;
    }

    const _normalizeLocalValueName = function (path, name) {
        if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
            // TODO: LD: normalize the string with the valid chars only and replace invalid chars with "_"
            if (Oracle.isString(name) && !Oracle.isEmptyOrWhiteSpaces(name)) {
                return _normalizeName(path) + "|" + _normalizeName(name);
            }
            else {
                return _normalizeName(name);
            }
        }
        else {
            throw new Oracle.Errors.ValidationError("Local value name is either empty or invalid: '" + name + "'");
        }
    }

    const _listStringValueNameByPathFromLocalStorage = function (path) {
        if (_result.onListStringValueNameByPathFromLocalStorage) {
            return _result.onListStringValueNameByPathFromLocalStorage(path);
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage list function not set.");
        }
    }

    const _clearAllStringValuesFromLocalStorage = function (name) {
        if (_result.onClearLocalStorage) {
            _result.onClearLocalStorage();
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage clear function not set.");
        }
    }

    const _removeStringValueFromLocalStorage = function (name) {
        if (_result.onRemoveStringValueFromLocalStorage) {
            _result.onRemoveStringValueFromLocalStorage(name);
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage remove function not set.");
        }
    }

    const _readStringValueFromLocalStorage = function (name) {
        if (_result.onReadStringValueFromLocalStorage) {
            const resultValue = _result.onReadStringValueFromLocalStorage(name);
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

    const _writeStringValueToLocalStorage = function (name, value) {
        value = Oracle.toNullableValue(value);
        if (_result.onWriteStringValueToLocalStorage) {
            _result.onWriteStringValueToLocalStorage(name, value);
        }
        else {
            throw new Oracle.Errors.RuntimeError("Local storage read function not set.");
        }
    }

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

    // ---------------------------------------------------------------------------------------------------------------- //
    // Base Read/Write class
    // ---------------------------------------------------------------------------------------------------------------- //
    const _baseStorageClass = class {

        constructor(settings) {
            this.readCallback = settings.readCallback;
            this.writeCallback = settings.writeCallback;
            this.clearAllCallback = settings.clearAllCallback;
            this.removeCallback = settings.removeCallback;
            this.listCallback = settings.listCallback;
        }

        getValueNamesByPath(path) {
            return this.listCallback(path);
        }

        clear() {
            this.clearAllCallback();
        }

        removeValue(path, name) {
            name = _normalizeLocalValueName(path, name);
            this.removeCallback(name);
        }

        readValue(path, name, defaultValue = null) {
            name = _normalizeLocalValueName(path, name);
            const storedValue = this.readCallback(name);
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
            name = _normalizeLocalValueName(path, name);
            this.writeCallback(name, storedValue);
        }
    }

    _result.Local = new _baseStorageClass(
        {
            readCallback: _readStringValueFromLocalStorage,
            writeCallback: _writeStringValueToLocalStorage,
            clearAllCallback: _clearAllStringValuesFromLocalStorage,
            removeCallback: _removeStringValueFromLocalStorage,
            listCallback: _listStringValueNameByPathFromLocalStorage
        });

    _result.Session = new _baseStorageClass(
        {
            readCallback: (name) => { return window.sessionStorage[name] },
            writeCallback: (name, value) => { window.sessionStorage[name] = value; },
            clearAllCallback: () => {
                var n = window.sessionStorage.length;
                while (n--) {
                    var key = window.sessionStorage.key(n);
                    window.sessionStorage.removeItem(key);
                }
            },
            removeCallback: (name) => { window.sessionStorage.removeItem(name); },
            listCallback: (path) => {
                const result = [];
                for (var i = 0; i < window.sessionStorage.length; i++) {
                    const key = window.sessionStorage.key(i);
                    if (key.startsWith(path)) {
                        result.push(key.substring(path.length + 1));
                    }
                }
                return result;
            }

        });

    return parent;
}(Oracle));
