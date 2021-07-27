// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.conversion
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {

    if (!parent.hasOwnProperty('Conversion')) parent.Conversion = {};

    const result = parent.Conversion;

    // ------------------------------------------------------------------------------------------------
    // Converters
    // ------------------------------------------------------------------------------------------------

    const _failedResult = { success: false };

    const _returnSuccess = function (value) {
        return { success: true, value: value };
    }


    const _tryToBoolean = function (value) {
        if (!Oracle.isEmptyOrWhiteSpaces(value)) {
            if (value == 1) {
                return _returnSuccess(true);
            }
            else if (value === true) {
                return _returnSuccess(true);
            }
            else if (value === false) {
                return _returnSuccess(false);
            }
            else if (typeof value === 'string' || value instanceof String) {
                value = value.toLowerCase();
                if (value == 'true' || value == 'yes' || value == 'enabled' || value == 'enable' || value == 'on') {
                    return _returnSuccess(true);
                }
                else if (value == 'false' || value == 'no' || value == 'disabled' || value == 'disable' || value == 'off') {
                    return _returnSuccess(false);
                }
            }
        }
        return _failedResult;
    }


    const _defaultToBoolean = function (value, defaultValue = false) {
        const result = _tryToBoolean(value);
        if (result.success) {
            return result.value;
        }
        else {
            return defaultValue;
        }
    }

    const _toBoolean = function (value, throwsException = true) {
        const result = _tryToBoolean(value);
        if (result.success) {
            return result.value;
        }
        else {
            if (throwsException) {
                throw new Oracle.Errors.ValidationError("Cannot convert value to boolean", { value: value, result: result });
            }
            else {
                return null;
            }

        }
    };

    const _tryToNumber = function (value) {
        if (Oracle.isEmpty(value)) return _failedResult;
        if (Oracle.isNumber(value)) return value;
        if (Oracle.isString(value)) {
            let exit = false;
            let finalValue = "";
            let decimalSeparator = '.';
            let decimalSeparatorFound = false;
            let comaCount = 0;
            let decimalPointCount = 0;
            for (let i = 0; i < value.length; i++) {
                let c = value.charAt(i);
                switch (c) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        break;
                    case '-':
                    case '+':
                        if (i !== 0) {
                            exit = true;
                        }
                        break;
                    case '.':
                        decimalPointCount++;
                        break;
                    case ',':
                        if (comaCount === 0 && decimalPointCount > 0) {
                            return _failedResult;
                        }
                        comaCount++;
                        break;
                    default:
                        exit = true;
                        break;
                }
                if (exit) break;
            }
            if (comaCount > 0 && decimalPointCount === 0) {
                decimalSeparator = ',';
            }
            exit = false;
            for (let i = 0; i < value.length; i++) {
                let c = value.charAt(i);
                switch (c) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        finalValue += c;
                        break;
                    case '-':
                    case '+':
                        if (i !== 0) {
                            exit = true;
                        }
                        else if (c === '-') {
                            finalValue = "-";
                        }
                        break;
                    case decimalSeparator:
                        if (decimalSeparatorFound) {
                            return _failedResult;
                        }
                        finalValue += '.';
                        decimalSeparatorFound = true;
                        break;
                    default:
                        exit = true;
                        break;
                }
                if (exit) break;
            }
            if (Oracle.isEmptyOrWhiteSpaces(finalValue)) {
                return _failedResult;
            }
            else {
                return { success: true, value: parseFloat(finalValue) };
            }
        }
        else {
            return _failedResult;
        }
    }

    const _defaultToNumber = function (value, defaultValue = 0) {
        const result = _tryToNumber(value);
        if (result.success) {
            return result.value;
        }
        else {
            return defaultValue;
        }
    }

    const _toNumber = function (value, throwsException = true) {
        const result = _tryToNumber(value);
        if (result.success) {
            return result.value;

        }
        else {
            if (throwsException) {
                throw new Oracle.Errors.ValidationError("Cannot convert value to number", { value: value });

            }
            else {
                return null;
            }

        }
    };


    const _toTimeSpan = function (duration) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        if (Oracle.isNumber(duration)) {
            hours = Math.floor(duration / (60 * 60));
            durationInSeconds = duration - (hours * 3600);
            minutes = Math.floor(duration / 60);
            durationInSeconds = duration - (minutes * 60);
            seconds = durationInSeconds;
        }
        else if (Oralce.isTimeSpan(duration)) {
            return duration;
        }
        return {
            minutes: minutes,
            hours: hours,
            seconds: seconds
        };
    }

    const _toDate = function (value) {
        const result = moment(value).toDate();
        console.log(result);
        return result;
    };


    const _removeAccentsAndDiacritics = function (value) {
        if (!Oracle.isString(value)) {
            return null;
        }
        else {
            return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
    }
    // ------------------------------------------------------------------------------------------------
    // Namespace assignments
    // ------------------------------------------------------------------------------------------------

    result.toNumber = _toNumber;
    result.tryToNumber = _tryToNumber;
    result.defaultToNumber = _defaultToNumber;

    result.toBoolean = _toBoolean;
    result.tryToBoolean = _tryToBoolean;
    result.defaultToBoolean = _defaultToBoolean;

    result.toDate = _toDate;
    result.toTimeSpan = _toTimeSpan;
    result.removeAccentsAndDiacritics = _removeAccentsAndDiacritics;

    return parent;

}(Oracle));

if (!String.prototype.removeAccentsAndDiacritics) {
    String.prototype.removeAccentsAndDiacritics = function () {
        if (Oracle.isEmpty(this)) {
            return this;
        }
        else {
            return Oracle.Conversion.removeAccentsAndDiacritics(this);
        }
    };
}
