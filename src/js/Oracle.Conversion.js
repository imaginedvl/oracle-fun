// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.conversion
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {

    if (!parent.hasOwnProperty('Conversion')) parent.Conversion = {};

    const result = parent.Conversion;

    // ------------------------------------------------------------------------------------------------
    // Converters
    // ------------------------------------------------------------------------------------------------

    const _toTimeSpan = function (duration) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        if (Oracle.Conversion.isNumber(duration)) {
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

    const _toNumber = function (value, throwsException = true) {
        if (Oracle.isEmpty(value)) return null;
        if (Oracle.Conversion.isNumber(value)) return value;
        if (Oracle.Conversion.isString(value)) {
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
                            if (throwsException) {
                                throw new Oracle.Exception("Invalid number format: " + value);
                            }
                            else {
                                return null;
                            }
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
                            if (throwsException) {
                                throw new Oracle.Exception("Cannot parse value into float (more than one decimal point or coma found): " + value);
                            }
                            else {
                                return null;
                            }
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
            return parseFloat(finalValue);
        }
        else {
            if (throwsException) {
                throw new Oracle.Exception("Cannot parse value into float: " + value);
            }
            else {
                return null;
            }
        }
    };

    const _toBoolean = function (value) {
        if (Oracle.isEmpty(value)) {
            return false;
        }
        else {
            if (value == 1) {
                return true;
            }
            else if (value === true) {
                return true;
            }
            else if (typeof value === 'string' || value instanceof String) {
                if (value.caseInsensitiveEquals('true')) {
                    return true;
                }
                else if (value.caseInsensitiveEquals('yes')) {
                    return true;
                }
                else if (value.caseInsensitiveEquals('enabled')) {
                    return true;
                }
                else if (value.caseInsensitiveEquals('oui')) {
                    return true;
                }
                else if (value.caseInsensitiveEquals('enable')) {
                    return true;
                }
                else if (value.caseInsensitiveEquals('on')) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }

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

    result.toDate = _toDate;
    result.toNumber = _toNumber;
    result.toBoolean = _toBoolean
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
