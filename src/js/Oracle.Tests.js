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

    const _testStatus = {
        Ready: 'Ready', // Test is registered and ready to be executed
        Success: 'Success',
        Skipped: 'Skipped',
        Failed: 'Failed',
        PartialSuccess: 'PartialSuccess'
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Test Execution
    // ---------------------------------------------------------------------------------------------------------------- //

    const _mockData = {};

    result.registerMockData = function (id, data) {
        _mockData[id] = data;
    }

    result.getMockData = function (id) {
        return Oracle.toNullableValue(_mockData[id]);
    }

    const _allModules = [];
    const _allTests = [];

    const _getOrCreateTestModule = function (moduleName) {
        let module = null;
        for (let i = 0; i < _allModules.length; i++) {
            if (_allModules[i].name.toLowerCase() === moduleName.toLowerCase()) {
                module = _allModules[i];
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
                name: moduleName,
                tests: [],
                sortString: sortString,
                status: _testStatus.Ready,
                successCount: 0,
                failedCount: 0,
                skippedCount: 0
            };
            _allModules.push(module);
            _allModules.sort((a, b) => a.sortString.localeCompare(b));
        }
        return module;
    }

    const _updateModuleStatus = function (moduleName) {
        const module = _getOrCreateTestModule(moduleName);
        let status = _testStatus.Ready;
        let successCount = 0;
        let failedCount = 0;
        let skippedCount = 0;
        for (let i = 0; i < module.tests.length; i++) {
            const test = module.tests[i];
            if (test.status === _testStatus.Success) {
                successCount++;
            }
            else if (test.status === _testStatus.Failed) {
                failedCount++;
            }
            else if (test.status === _testStatus.Skipped) {
                skippedCount++;
            }
        }
        if (failedCount > 0) {
            status = _testStatus.Failed;
        }
        else if (successCount === module.tests.length) {
            status = _testStatus.Success;
        }
        else if (skippedCount === module.tests.length) {
            status = _testStatus.Skipped;
        }
        else if (successCount > 0) {
            status = _testStatus.PartialSuccess;
        }
        module.successCount = successCount;
        module.failedCount = failedCount;
        module.skippedCount = skippedCount;
        module.status = status;
    }


    const _uncategorizedModuleName = 'Uncategorized';
    const _uncategorizedCategoryName = 'Uncategorized';
    const _adhocTestName = 'Adhoc test #';
    let _nextUnknownTestId = 0;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Test
    // ---------------------------------------------------------------------------------------------------------------- //
    const _testClass = class {

        constructor(settings) {
            this.module = Oracle.toNullableValue(settings?.module);
            this.category = Oracle.toNullableValue(settings?.category);
            this.test = Oracle.toNullableValue(settings?.test);
            this.name = Oracle.toNullableValue(settings?.name);
            this.status = _testStatus.Ready;
            this.resultError = null;
            this.resultMessage = null;
            this.logs = [];
            if (this.name === null) {
                _nextUnknownTestId++;
                this.name = _adhocTestName + _nextUnknownTestId;
            }
            if (this.module === null) {
                this.module = _uncategorizedModuleName;
            }
            if (this.category === null) {
                this.category = _uncategorizedCategoryName;
            }
        }

        execute() {
            const startTimestamp = Oracle.getTimestamp();
            try {
                if (Oracle.isFunction(this.test)) {
                    this.test(assert, Oracle.Logger);
                }
                this.duration = Oracle.getTimestamp() - startTimestamp;
                this.status = _testStatus.Success;
                Oracle.Logger.logInformation("TEST [" + this.status + "] | " + this.name);
            }
            catch (error) {
                this.duration = Oracle.getTimestamp() - startTimestamp;
                this.status = _testStatus.Failed;
                let message = 'An error occured while executing the test';
                const errorAsString = String(error);
                if (!Oracle.isEmpty(errorAsString)) {
                    message = errorAsString;
                }
                this.resultError = error;
                this.resultMessage = message;
                Oracle.Logger.logError("TEST [" + this.status + "] | " + this.name + " -> " + message);
            }
            _updateModuleStatus(this.module);
        }

    }

    result.registerTest = function (settings) {
        let test;
        if (Oracle.isObject(settings)) {
            test = new _testClass(settings);
        }
        else if (Oracle.isFunction(settings)) {
            test = new _testClass({ test: settings });
        }
        else {
            throw new Oracle.Errors.ValidationError("You need to provide settings for your test. (ie: { module: '[module name]', category: '[category name]', name: '[test name]', test: () => { [your test code]} }");
        }
        const module = _getOrCreateTestModule(test.module);
        module.tests.push(test);
        _allTests.push(test);
    }

    result.getStatusText = function (status) {
        switch (status) {
            case _testStatus.Success:
                return "Success";
            case _testStatus.Failed:
                return "Failed";
            case _testStatus.PartialSuccess:
                return "Partial Success";
            case _testStatus.Ready:
                return "Ready";
            default:
                return "Unknown";
        }
    }

    result.getAllTests = () => _allTests;
    result.getAllModules = () => _allModules;
    result.TestStatus = _testStatus;

    return parent;
}(Oracle));
