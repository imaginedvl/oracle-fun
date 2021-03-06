'use strict';

if (OracleSettings === undefined) {
    var OracleSettings = {};
}

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle
// ---------------------------------------------------------------------------------------------------------------- //
var Oracle = (function () {

    const result = {};

    result.debugMode = false;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Global Utility Methods
    // ---------------------------------------------------------------------------------------------------------------- //

    result.isEmpty = function (value) {
        if (value === null || value === undefined) return true;
        if (value === '') return true;
        if (value instanceof $) {
            return value.length === 0;
        }
        if (typeof (value) === 'string') {
            return value === '';
        }
        return false;
    };

    result.isEmptyOrWhiteSpaces = function (value) {
        if (value === null || value === undefined) return true;
        if (value === '') return true;
        if (value instanceof $) {
            return value.length === 0;
        }
        if (typeof (value) === 'string') {
            const trimvalue = Oracle.Strings.trim(value);
            return trimvalue === '';
        }
        return false;
    };

    result.toDefaultValue = function (value, defaultValue) {
        if (value === null || value === undefined) return defaultValue;
        return value;
    }

    result.toNullableValue = function (value) {
        return Oracle.toDefaultValue(value, null);
    }

    const _generatedIdPossibleFirstCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const _generatedIdPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    result.generateId = function (length) {
        if (Oracle.isEmpty(length) || length < 1) length = 10;
        let text = _generatedIdPossibleFirstCharacters.charAt(Math.floor(Math.random() * _generatedIdPossibleFirstCharacters.length));
        for (var i = 1; i < length; i++) {
            text += _generatedIdPossibleCharacters.charAt(Math.floor(Math.random() * _generatedIdPossibleCharacters.length));
        }
        return text;
    };

    if (window.performance.now) {
        result.getTimestamp = function () { return window.performance.now(); };
    } else {
        if (window.performance.webkitNow) {
            result.getTimestamp = function () { return window.performance.webkitNow(); };
        } else {
            result.getTimestamp = function () { return new Date().getTime(); };
        }
    }


    // ------------------------------------------------------------------------------------------------
    // Known Classes
    // ------------------------------------------------------------------------------------------------

    const _knownClassSettings =
    {
    }

    const _knownClasses =
    {
    }

    const _addKnownClass = function (className, actualClass, compareCallback, toNeutralStringCallback) {
        _knownClasses[className] = className;
        _knownClassSettings[className] = { className: className, class: actualClass, compareCallback: compareCallback, toNeutralStringCallback: toNeutralStringCallback };
    }

    const _getKnownClassSettings = function (value) {
        for (const [key, settings] of Object.entries(_knownClassSettings)) {
            if (settings?.class && value instanceof settings.class) {
                return settings;
            }
        }
        return null;
    }

    const _getKnownClass = function (value) {
        const settings = _getKnownClassSettings(value);
        if (settings?.class && value instanceof settings.class) {
            return settings.className;
        }
        return null;
    }

    result.distinct = function (items, comparer = null) {
        let item;
        let exists = false;
        const result = [];
        if (!Oracle.isEmpty(items) && Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                item = items[i];
                exists = false;
                if (Oracle.isFunction(comparer)) {
                    for (let j = 0; j < result.length; j++) {
                        if (comparer(item, result[j]) === 0) {
                            exists = true;
                            break;
                        }
                    }
                }
                else {
                    for (let j = 0; j < result.length; j++) {
                        if (Oracle.compare(item, result[j]) === 0) {
                            exists = true;
                            break;
                        }
                    }
                }
                if (!exists) {
                    result.push(item);
                }
            }
        }
        return result;
    }

    result.includes = function (a, b, comparer = null) {
        if (a === null || a === undefined) {
            return false;
        }
        else if (b === null || b === undefined) {
            return true;
        }
        if (Oracle.isFunction(comparer)) {
            if (Array.isArray(a)) {
                for (let i = 0; i < a.length; i++) {
                    const result = comparer(a[i], b);
                    if (result === 0 || result === true) {
                        return true;
                    }
                }
                return false;
            }
            else {
                const result = comparer(a, b);
                return result === 0 || result === true;
            }
        }
        else {
            if (Array.isArray(a)) {
                return a.includes(b);
            }
            else {
                return Oracle.compare(a, b) === 0;
            }
        }
    }

    result.compare = function (a, b) {
        if (a === null || a === undefined) {
            if (b !== null && b !== undefined) {
                return -1
            }
            else {
                return 0;
            }
        }
        else if (b === null || b === undefined) {
            if (a !== null && a !== undefined) {
                return 1
            }
            else {
                return 0;
            }
        }
        if (Oracle.isObject(a) && Oracle.isObject(b)) {
            const settings = _getKnownClassSettings(a);
            if (settings?.compareCallback) {
                return settings.compareCallback(a, b);
            }
        }
        if (a > b) {
            return 1;
        }
        else if (a < b) {
            return -1
        }
        else {
            return 0;
        }
    }

    result.toNeutralString = function (item) {
        if (Oracle.isObject(item)) {
            const settings = _getKnownClassSettings(item);
            if (settings?.toNeutralStringCallback) {
                return settings.toNeutralStringCallback(item);
            }
        }
        return String(item);
    }

    result.addKnownClass = _addKnownClass;
    result.getKnownClass = _getKnownClass;
    result.KnownClasses = _knownClasses;

    _addKnownClass("Date", Date, (a, b) => {
        const aValue = a.getTime();
        const bValue = b.getTime();
        if (aValue > bValue) {
            return 1;
        }
        else if (aValue < bValue) {
            return -1
        }
        else {
            return 0;
        }
    },
        (value) => {
            return String(value.getUTCFullYear()) + "-" + String(value.getUTCMonth()).padStart(2, '0') + "-" + String(value.getUTCDate()).padStart(2, '0') +
                "T" + String(value.getUTCHours()).padStart(2, '0') + ":" + + String(value.getUTCMinutes()).padStart(2, '0') + ":" + + String(value.getUTCSeconds()).padStart(2, '0') +
                "." + + String(value.getUTCMilliseconds()).padStart(3, '0') + "Z";
        });
    _addKnownClass("Array", Array);

    // ------------------------------------------------------------------------------------------------
    // Type checks
    // ------------------------------------------------------------------------------------------------

    result.isJQuery = function (value) {
        return value !== null && value instanceof jQuery || 'jquery' in Object(value);
    };

    result.isTimeSpan = function (value) {
        return value !== null && value instanceof Oracle.TimeSpan || 'timespan' in Object(value);
    };

    result.isObject = function (value) {
        return value !== null && typeof value === 'object';
    };

    result.isDate = function (value) {
        return value !== null && (value instanceof Date || typeof value === 'date');
    };

    result.isString = function (value) {
        return value !== null && (value instanceof String || typeof value === 'string');
    };

    result.isFunction = function (value) {
        return value !== null && typeof value === 'function';
    };

    result.isNumber = function (value) {
        return value !== null && typeof value === 'number';
    };

    result.isBoolean = function (value) {
        return value !== null && typeof value === 'boolean';
    };

    const _validMacAddressChars = "0123456789ABCDEFabcdef";

    result.isMacAddress = function (value, isStrict = false) {
        if (Oracle.Conversion.isString(value)) {
            if (isStrict || value.indexOf(':') > -1) {
                const regex = new RegExp("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$");
                return regex.test(value);
            }
            else {
                if (value.length === 12) {
                    for (var i = 0; i < value.length; i++) {
                        let c = value.charAt(i);
                        if (_validMacAddressChars.indexOf(c) === -1) {
                            return false;
                        }
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    // ------------------------------------------------------------------------------------------------
    // Instance values 
    // ------------------------------------------------------------------------------------------------

    const _tryGetMemberValueByPath = function (target, path) {
        let resultValue = target;
        let result = false;
        if (!Oracle.isEmpty(target)) {
            if (path === null) throw "Token name is null or empty (Oracle.tryGetMemberValueByPath)";
            path = path.toLowerCase();
            const tokens = path.split('>');
            for (let j = 0; j < tokens.length; j++) {
                const token = tokens[j];
                for (const [key, value] of Object.entries(resultValue)) {
                    if ((key + "").toLowerCase() === token) {
                        result = true;
                        resultValue = value;
                        break;
                    }
                }
            }
            if (!result) {
                let members = path.split('.');
                for (let i = 0; i < members.length; i++) {
                    result = false;
                    if (Oracle.isEmpty(resultValue)) break;
                    let member = members[i];
                    const tokens = member.split('>');
                    for (let j = 0; j < tokens.length; j++) {
                        const token = tokens[j];
                        for (const [key, value] of Object.entries(resultValue)) {
                            if ((key + "").toLowerCase() === token) {
                                result = true;
                                resultValue = value;
                                break;
                            }
                        }
                    }
                    if (!result) {
                        break;
                    }
                }
            }
            if (!result) {
                resultValue = null;
            }
        }
        const resultObject = {
            result: result,
            value: resultValue
        };
        return resultObject;
    };

    const _getMemberValueByPath = function (target, path, defaultValue = null) {
        if (!target) return null;
        if (!path) return null;
        const result = _tryGetMemberValueByPath(target, path);
        if (result.result) {
            return result.value;
        }
        else {
            return defaultValue;
        }
    };

    result.getMemberValueByPath = _getMemberValueByPath;
    result.tryGetMemberValueByPath = _tryGetMemberValueByPath;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Errors
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Errors = {};
    result.Errors.BaseError = class extends Error {
        constructor(errorType, message, data, logError = true) {
            if (Oracle.isObject(data) || Oracle.isEmpty(data)) {
                super(message);
            }
            else {
                super(message + ". " + data);
            }
            this.data = data;
            this.name = errorType;
            Oracle.Logger.logError(message, data);
        }
    };

    result.Errors.ValidationError = class extends result.Errors.BaseError {
        constructor(message, data, logError = true) {
            super("ValidationError", message, data, logError);
        }
    };

    result.Errors.RuntimeError = class extends result.Errors.BaseError {
        constructor(message, data, logError = true) {
            super("RuntimeError", message, data, logError);
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Logger
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Logger = {};

    result.Logger.Level =
    {
        Critical: 0,
        Error: 1,
        Warning: 2,
        Information: 3,
        Debug: 4,
        Trace: 5,
        None: 6
    }


    result.Logger.logWarning = function (message, data) {
        if (data === undefined) {
            console.warn("ORACLE: " + message);
        }
        else {
            console.warn("ORACLE: " + message, data);
        }
    }

    result.Logger.logError = function (message, data) {
        if (data === undefined) {
            console.error("ORACLE: " + message);
        }
        else {
            console.error("ORACLE: " + message, data);
        }
    }

    result.Logger.logInformation = function (message, data) {
        if (data === undefined) {
            console.log("ORACLE: " + message);
        }
        else {
            console.log("ORACLE: " + message, data);
        }
    }

    result.Logger.logDebug = function (message, data) {
        if (data === undefined) {
            console.debug("ORACLE: " + message);
        }
        else {
            console.debug("ORACLE: " + message, data);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Http
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Http = {};

    result.Http.getQueryStringValue = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Numbers
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Numbers = {};

    result.Numbers.getDecimalPartLength = function (n) {
        var s = "" + (+n);
        var match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
        if (!match) { return 0; }
        return Math.max(
            0,  // lower limit.
            (match[1] === '0' ? 0 : (match[1] || '').length)  // fraction length
            - (match[2] || 0));  // exponent
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Strings
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Strings = {};

    const _defaultTrimCharacters = [' ', '\t', '\n', '\r', String.fromCharCode(160)];

    const _isTrimableChar = function (char, characters) {
        for (let j = 0; j < characters.length; j++) {
            if (characters[j] == char) {
                return false;
            }
        }
        return true;
    }

    result.Strings.trimEnd = function (value, characters, extraCharacters) {
        if (value === null || value === undefined || !Oracle.isString(value)) {
            return null;
        }
        if (characters === null || characters === undefined || !Array.isArray(characters)) {
            characters = _defaultTrimCharacters
        }
        let endIndex = value.length;
        for (let i = value.length - 1; i > -1; i--) {
            if (_isTrimableChar(value.charAt(i), characters)) {
                endIndex = i;
                break;
            }
        }
        if (endIndex > value.length - 1) {
            return "";
        }
        else {
            return value.substring(0, endIndex + 1);
        }
    }

    result.Strings.trimStart = function (value, characters) {
        if (value === null || value === undefined || !Oracle.isString(value)) {
            return null;
        }
        if (characters === null || characters === undefined || !Array.isArray(characters)) {
            characters = _defaultTrimCharacters
        }
        let startIndex = -1;
        for (let i = 0; i < value.length; i++) {
            if (_isTrimableChar(value.charAt(i), characters)) {
                startIndex = i;
                break;
            }
        }
        if (startIndex === -1) {
            return "";
        }
        else {
            return value.substring(startIndex);
        }
    }

    result.Strings.trim = function (value, characters) {
        if (value === null || value === undefined || !Oracle.isString(value)) {
            return null;
        }
        if (characters === null || characters === undefined || !Array.isArray(characters)) {
            characters = _defaultTrimCharacters
        }
        const trimStart = Oracle.Strings.trimStart(value, characters);
        const trimEnd = Oracle.Strings.trimEnd(trimStart, characters);
        return trimEnd;
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Dates
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Dates = {};

    const _months =
    {
        0: { n: 'January', a: 'Jan' },
        1: { n: 'February', a: 'Feb' },
        2: { n: 'March', a: 'Mar' },
        3: { n: 'April', a: 'Apr' },
        4: { n: 'May', a: 'May' },
        5: { n: 'June', a: 'Jun' },
        6: { n: 'July', a: 'Jul' },
        7: { n: 'August', a: 'Aug' },
        8: { n: 'September', a: 'Sep' },
        9: { n: 'October', a: 'Oct' },
        10: { n: 'November', a: 'Nov' },
        11: { n: 'December', a: 'Dec' }
    };

    result.Dates.getMonthName = function (monthIndex) {
        return _months[monthIndex]?.n;
    }

    result.Dates.getMonthAbbreviation = function (monthIndex) {
        return _months[monthIndex]?.a;
    }

    return result;
}());

if (!Array.prototype.distinct) {
    Array.prototype.distinct = function (comparer = null) {
        return Oracle.distinct(this, comparer);
    };
}

if (!Array.prototype.pushRange) {
    Array.prototype.pushRange = function (range) {
        if (Array.isArray(range)) {
            for (let i = 0; i < range.length; i++) {
                this.push(range[i]);
            }
        }
        else {
            this.push(range);
        }
    };
}

if (!String.prototype.caseInsensitiveEquals) {
    String.prototype.caseInsensitiveEquals = function (value) {
        if (Oracle.isEmpty(this) && Oracle.isEmpty(value)) {
            return true;
        }
        else if (Oracle.isEmpty(this) || Oracle.isEmpty(value)) {
            return false;
        }
        else {
            return this.toUpperCase() === value.toUpperCase()
        }
    }
}

String.prototype.trim = function (characters = null) {
    return Oracle.Strings.trim(this, characters);
};

String.prototype.trimStart = function (characters = null) {
    return Oracle.Strings.trimStart(this, characters);
};

String.prototype.trimEnd = function (characters = null) {
    return Oracle.Strings.trimEnd(this, characters);
};


if (!String.prototype.toUpperCaseFirstLetter) {
    String.prototype.toUpperCaseFirstLetter = function () {
        if (Oracle.isEmpty(this)) {
            return this;
        }
        else {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    };
}

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};

Date.prototype.getMonthAbbreviation = function () {
    return Oracle.Dates.getMonthAbbreviation(this.getMonth());
};

Date.prototype.getMonthName = function () {
    return Oracle.Dates.getMonthName(this.getMonth());
};

String.prototype.getHashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};