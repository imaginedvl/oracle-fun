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

    assert.areEqual = function(expected, actual, message)
    {
        if (expected != actual)
        {
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

    result.TestResult = {
        Unknown: 0,
        Success: 1,
        Skipped: 5,
        Failed: 10
    }

    const _results = [];
    const _mockData = {};

    result.addMockData = function(id, data)
    {
        _mockData[id] = data;
    }

    result.getMockData = function(id)
    {
        return Oracle.toNullableValue(_mockData[id]);
    }

    result.execute = function(settings)
    {
        if(Oracle.isEmpty(settings))
        {
            throw new Oracle.Errors.ValidationError("You need to provide settings for your test. (ie: { name: 'my test', test: () => {} }");
        }
        else{
            if(Oracle.isEmpty(settings.name))
            {
                settings.name = 'Unknown test';
            }
            try
            {
                if(Oracle.isFunction(settings.test))
                {
                    settings.test(assert, Oracle.Logger);
                }
                Oracle.Logger.logInformation("TEST [SUCCESS]: " + settings.name);
                _results.push(
                    {
                        settings: settings,
                        result: result.TestResult.Success
                    }
                );
            }
            catch(error)
            {
                let message = 'An error occured while executing the test';
                const errorAsString = String(error);
                if (!Oracle.isEmpty(errorAsString))
                {
                    message = errorAsString;
                }
                Oracle.Logger.logError("TEST [FAILED] | " + settings.name + " | " + message, { error: error });
                _results.push(
                    {
                        settings: settings,
                        result: result.TestResult.Failed,
                        error: error,
                        errorMessage: message
                    }
                );
            }
        }
    }

    result.displayResults = function(target)
    {
        target =$(target);

    }

    return parent;
}(Oracle));
