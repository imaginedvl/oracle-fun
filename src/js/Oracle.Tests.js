'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Tests
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Tests')) parent.Tests = {};
    if (!parent.Tests.hasOwnProperty('Assert')) parent.Tests.Assert = {};
    const result = parent.Tests;
    const assert = parent.Tests.Assert

    // ---------------------------------------------------------------------------------------------------------------- //
    // Assert
    // ---------------------------------------------------------------------------------------------------------------- //
    Oracle.Errors.AssertionError = class extends Oracle.Errors.BaseError {
        constructor(message, data, logError = true) {
            super("AssertionError", message, data, logError);
        }
    };

    assert.isTrue = function (actual, message) {
        if (actual !== true) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isTrue failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isFalse = function (actual, message) {
        if (actual !== false) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isFalse failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isUndefined = function (actual, message) {
        if (actual !== isUndefined) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isUndefined failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isNotNull = function (actual, message) {
        if (actual === null) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isNotNull failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isNotUndefined = function (actual, message) {
        if (actual === isUndefined) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isNotUndefined failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isNotEmpty = function (actual, message) {
        if (Oracle.isEmpty(actual)) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isNotEmpty failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isNull = function (actual, message) {
        if (actual !== null) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isNull failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.isEmpty = function (actual, message) {
        if (!Oracle.isEmpty(actual)) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.isEmpty failed. Actual:<" + actual + ">. ", { actual: actual }, false);
        }
    }

    assert.areEqual = function (expected, actual, message) {
        if (expected != actual) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areEqual failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    assert.areStrictlyEqual = function (expected, actual, message) {
        if (expected !== actual) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areStrictlyEqual failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    assert.areComparable = function (expected, actual, message) {
        if (Oracle.compare(expected, actual) === 0) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areComprable failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    assert.areNotEqual = function (expected, actual, message) {
        if (expected == actual) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areNotEqual failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    assert.areNotStrictlyEqual = function (expected, actual, message) {
        if (expected === actual) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areNotStrictlyEqual failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    assert.areNotComparable = function (expected, actual, message) {
        if (Oracle.compare(expected, actual) !== 0) {
            throw new Oracle.Errors.AssertionError(message ? message : "Assert.areNotComprable failed. Expected:<" + expected + ">. Actual:<" + actual + ">. ", { expected: expected, actual: actual }, false);
        }
    }

    let _element = Oracle.toNullableValue($('#oracle-unit-test'));

    // ---------------------------------------------------------------------------------------------------------------- //
    // Test Execution
    // ---------------------------------------------------------------------------------------------------------------- //

    const _mockData = {};

    result.addMockData = function (id, data) {
        _mockData[id] = data;
    }

    result.getMockData = function (id) {
        return Oracle.toNullableValue(_mockData[id]);
    }

    result.TestResult = {
        Unknown: 'Unknown',
        Success: 'Success',
        Skipped: 'Skipped',
        Failed: 'Failed'
    }

    const _testResults = [];
    const _uncategorizedModuleName = 'Uncategorized';

    const _getTestResultModule = function (moduleName) {
        if (moduleName === null) {
            moduleName = _uncategorizedModuleName;
        }
        let module = null;
        for (let i = 0; i < _testResults.length; i++) {
            if (_testResults[i].moduleName.toLowerCase() === moduleName.toLowerCase()) {
                module = _testResults[i];
                break;
            }
        }
        if (module === null) {
            let sortString = moduleName.toLowerCase();
            if (moduleName === _uncategorizedModuleName) {
                sortString = 'Z' + sortString;
            }
            else {
                sortString = 'A' + sortString;
            }
            module =
            {
                moduleName: moduleName,
                results: [],
                sortString: sortString
            };
            _testResults.push(module);
            _testResults.sort((a, b) => a.sortString.localeCompare(b));
        }

        return module;
    }



    const _addTestResult = function (startTimestamp, settings, testResultType, error, errorMessage) {
        const duration = Oracle.getTimestamp() - startTimestamp;
        const testResult =
        {
            settings: settings,
            result: testResultType,
            duration: duration
        };
        const module = _getTestResultModule(testResult.settings?.module);
        module.results.push(testResult);
        if (testResultType === result.TestResult.Failed) {
            testResult.error = error;
            testResult.errorMessage = errorMessage;
            Oracle.Logger.logError("TEST [" + testResultType.toUpperCase() + "] | " + settings.name + " -> " + errorMessage);
        }
        else {
            Oracle.Logger.logInformation("TEST [" + testResultType.toUpperCase() + "] | " + settings.name);
        }
    }

    result.execute = function (settings) {
        if (Oracle.isEmpty(settings)) {
            throw new Oracle.Errors.ValidationError("You need to provide settings for your test. (ie: { name: 'my test', test: () => {} }");
        }
        else {
            const startTimestamp = Oracle.getTimestamp();
            if (Oracle.isEmpty(settings.name)) {
                settings.name = 'Unknown test';
            }
            try {
                if (Oracle.isFunction(settings.test)) {
                    settings.test(assert, Oracle.Logger);
                }
                _addTestResult(startTimestamp, settings, result.TestResult.Success);
            }
            catch (error) {
                let message = 'An error occured while executing the test';
                const errorAsString = String(error);
                if (!Oracle.isEmpty(errorAsString)) {
                    message = errorAsString;
                }
                _addTestResult(startTimestamp, settings, result.TestResult.Failed, error, message);
            }
        }
    }

    /* To avoid dependencies on anything else but Oracle.js, let's deal with styles locally */
    const _addStyle = function (css) {
        if (!Oracle.isEmpty(css)) {
            const style = document.getElementById("OracleUnitTestStyles") || (function () {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.id = "OracleUnitTestStyles";
                document.head.appendChild(style);
                return style;
            })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        }
    }

    _addStyle('.oracle.unit-test-section { width: 100%; display:block} ');
    _addStyle('.oracle.unit-test-section table { width: 100%; } ');
    _addStyle('.oracle.unit-test-section table { border-spacing:0px; border-collapse: collapse  } ');
    _addStyle('.oracle.unit-test-section tr td { border:1px solid gray; padding: 4px; } ');
    _addStyle('.oracle.unit-test-section table tbody tr.module-section-header { padding-bottom: 8px;padding-top: 8px; font-size:120%  } ');

    result.displayResults = function (target) {
        target = $(target);
        target.addClass("oracle unit-test-section");
        const table = $("<table style=''>");
        const thead = $('<thead>');
        table.append(thead);
        const tbody = $('<tbody>');
        table.append(tbody);
        let td;
        let tr;
        for (let i = 0; i < _testResults.length; i++) {
            const modeuleResults = _testResults[i];
            tr = $("<tr class='module-section-header'>");
            td = $("<td colspan='4'>");
            td.text(modeuleResults.moduleName);
            tr.append(td);
            tbody.append(tr);
            for (let j = 0; j < modeuleResults.results.length; j++) {
                const testResult = modeuleResults.results[j];
                tr = $("<tr class='module-section-header'>");
                td = $("<td colspan='4'>");
                td.text(modeuleResults.moduleName);
                tr.append(td);
                tbody.append(tr);
            }
        }
        target.append(table);
        Oracle.Logger.logDebug("All test results", _testResults);
    }

    return parent;
}(Oracle));
