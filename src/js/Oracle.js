'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle
// ---------------------------------------------------------------------------------------------------------------- //
var Oracle = (function () {

    const result = {};

    result.debugMode = false;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Global Utility Methods
    // ---------------------------------------------------------------------------------------------------------------- //

    result.isEmpty = function(value)
    {
        if (value === null || value === undefined) return true;
        if (value === '') return true;
        if (value instanceof $) {
            return value.length === 0;
        }
        if(typeof(value) === 'string')
        {
            return value === '';
        }
        return false;
    };

    result.isEmptyOrWhiteSpaces = function(value)
    {
        if (value === null || value === undefined) return true;
        if (value === '') return true;
        if (value instanceof $) {
            return value.length === 0;
        }
        if(typeof(value) === 'string')
        {
            return Oracle.Strings.trim(value) === '';
        }
        return false;
    };

    result.toDefaultValue = function(value, defaultValue)
    {
        if (value === null || value === undefined) return defaultValue;
        return value;
    }

    result.toNullableValue = function(value)
    {
        return Oracle.toDefaultValue(value, null);
    }

    const _generatedIdPossibleFirstCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const _generatedIdPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    result.generateId = function (length) {
        if (Oracle.isEmpty(length) || length < 1) length = 10;
        let text = _generatedIdPossibleFirstCharacters.charAt(Math.floor(Math.random() * _generatedIdPossibleFirstCharacters.length));
        for (var i = 1; i < length; i++)
        {
            text += _generatedIdPossibleCharacters.charAt(Math.floor(Math.random() * _generatedIdPossibleCharacters.length));
        }
        return text;
    };

    // ------------------------------------------------------------------------------------------------
    // Known Classes
    // ------------------------------------------------------------------------------------------------

    const _knownClassSettings = 
    {
    }

    const _knownClasses = 
    {
        Date: 'Date',
        Array: 'Array'
    }

    const _addKnownClass = function(className, predicateCallback, compareCallback, generateHashCallback)
    {
        _knownClasses[className] = className;
        _knownClassSettings[className] = { className: className,  predicateCallback: predicateCallback, compareCallback: compareCallback, generateHashCallback: generateHashCallback };
    }
    
    const _getKnownClassSettings = function(value)
    {
        for (const [key, settings] of Object.entries(_knownClassSettings)) {
            if(settings.predicateCallback && settings.predicateCallback(value) === true)
            {
                return settings;
            }
        }
        return null;
    }

    const _getKnownClass = function(value)
    {
        const settings = _getKnownClassSettings(value);
        if(settings?.predicateCallback && settings.predicateCallback(value) === true)
        {
            return settings.className;
        }
        return null;
    }

    result.distinct = function(items)
    {
        const result = [];
        if(!Oracle.isEmpty(items))
        {
            for(let i = 0; i < items.length; i++)
            {
                //     
            }
        }
        return result;
    }

    result.compare = function(a, b)
    {
        if (a === null || a === undefined)
        {
            if(b !== null && b !== undefined)
            {
                return -1
            }
            else
            {
                return 0;
            }
        }
        else if (b === null || b === undefined)
        {
            if(a !== null && a !== undefined)
            {
                return 1
            }
            else
            {
                return 0;
            }
        }
        if(Oracle.isObject(a) && Oracle.isObject(b))
        {
            const settings =  _getKnownClassSettings(a);
            if(settings?.compareCallback)
            {
                return settings.compareCallback(a, b);
            }
        }
        if(a > b)
        {
            return 1;
        }
        else if(a < b)
        {
            return -1
        }
        else{
            return 0;
        }
    }
    
    result.addKnownClass = _addKnownClass;
    result.getKnownClass = _getKnownClass;
    result.KnownClasses = _knownClasses;

    _addKnownClass("Date", (value) => value instanceof Date);
    _addKnownClass("Array", (value) => value instanceof Array);

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
        if (!Oracle.isEmpty(target))
        {
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
            if (!result)
            {
                let members = path.split('.');
                for (let i = 0; i < members.length; i++)
                {
                    result = false;
                    if (Oracle.isEmpty(resultValue)) break;
                    let member = members[i];
                    const tokens = member.split('>');
                    for (let j = 0; j < tokens.length; j++)
                    {
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
            if (!result)
            {
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
        if (result.result) 
        {
            return result.value;
        }
        else
        {
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
            if(data === undefined)
            {
                super(message);
            }
            else{
                super(message + " | " + data);
            }
            this.data = data;
            this.name = errorType;
            if(logError && Oracle.debugMode === true)
            {
                Oracle.Logger.logError(message, data);
            }
        }
    };

    result.Errors.ValidationError = class extends result.Errors.BaseError {
        constructor(message, data, logError = true) {
            super("ValidationError", message, data, logError);
        }
    };

    result.Errors.RuntimeError = class extends result.Errors.BaseError {
        constructor( message, data, logError = true) {
            super("RuntimeError", message, data, logError);
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Logger
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Logger = {};
    
    result.Logger.logWarning = function(message, data)
    {
        if(data === undefined)
        {
            console.warn("ORACLE: " + message);
        }
        else{
            console.warn("ORACLE: " + message, data);
        }
    }

    result.Logger.logError = function(message, data)
    {
        if(data === undefined)
        {
            console.error("ORACLE: " + message);
        }
        else{
            console.error("ORACLE: " + message, data);
        }
    }

    result.Logger.logDebug = function(message, data)
    {
        if(data === undefined)
        {
            console.debug("ORACLE: " + message);
        }
        else{
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

    result.Strings.trim = function(value)
    {
        return value.replace(/[\s\n\r\t]*$/, '').replace(/^[\s\n\r\t]*/, '');
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Module: Oracle.Dates
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Dates = {};

    const _months = [ { n: 'January', a: 'Jan' }, { n: 'January', a: 'Jan' }, { n: 'February', a: 'Feb' }, { n: 'March', a: 'Mar' }, { n: 'April', a: 'Apr' }, { n: 'May', a: 'May' }, { n: 'June', a: 'Jun' },
    { n: 'July', a: 'Jul' }, { n: 'August', a: 'Aug' }, { n: 'September', a: 'Sep' }, { n: 'October', a: 'Oct' }, { n: 'November', a: 'Nov' }, { n: 'December', a: 'Dev' } ];

    result.Dates.getMonthName = function(monthIndex){
        return _months[monthIndex].n;
    }

    result.Dates.getMonthAbbreviation = function(monthIndex){
        return _months[monthIndex].a;
    }
    return result;
}());

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

