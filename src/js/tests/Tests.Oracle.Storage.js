'use strict';

(function () {

    // Module registration if we want to execute something before each test...
    Oracle.Tests.registerModule({
        name: 'Oracle.Storage',
        testInitialization: () => {
        }
    })


    // We are going to test every storage (Local, Session, ...) using shared tests

    const _longLengthStringsTest = function (storage, assert, logger) {
        const valueName = "LongLengthValues"
        const c_10 = "0123456789";
        const c_100 = c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10;
        const c_1000 = c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100;
        const c_10000 = c_1000 + c_1000 + c_1000 + c_1000 + c_1000 + c_1000 + c_1000 + c_1000 + c_1000 + c_1000;
        storage.writeValue("Test.Oracle.Storage", valueName, c_10000);
        assert.areEqual(c_10000, storage.readValue("Test.Oracle.Storage", valueName, null));
    }

    const _basicTypedValuesTest = function (storage, assert, logger) {
        const valueName = "BasicTypedValues"
        const currentDate = new Date();
        storage.writeValue("Test.Oracle.Storage", valueName, "This is a string");
        assert.areStrictlyEqual("This is a string", storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, true);
        assert.areStrictlyEqual(true, storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, 125.20);
        assert.areStrictlyEqual(125.20, storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, currentDate);
        assert.areComparable(currentDate, storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, null);
        assert.isNull(storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, undefined);
        assert.isUndefined(storage.readValue("Test.Oracle.Storage", valueName))
        storage.writeValue("Test.Oracle.Storage", valueName, "");
        assert.areStrictlyEqual("", storage.readValue("Test.Oracle.Storage", valueName))
    }

    const _complexValuesTest = function (storage, assert, logger) {
        const valueName = "ComplexTypedValues"
        const a = {
            value: 'value',
            bool: true,
            number: 125.10,
            date: new Date(),
            sub:
            {
                id: 1,
                name: 'Joel'
            }
        }
        storage.writeValue("Test.Oracle.Storage", valueName, a);
    }

    const _clearValuesTest = function (storage, assert, logger) {
        storage.writeValue("Test.Oracle.Storage", "TestValue", "TEST");
        assert.areEqual("TEST", storage.readValue("Test.Oracle.Storage", "TestValue", null));
        storage.clear();
        assert.isNull(storage.readValue("Test.Oracle.Storage", "TestValue", null));
    }

    const _removeValueTest = function (storage, assert, logger) {
        storage.writeValue("Test.Oracle.Storage", "TestValue", "TEST");
        assert.areEqual("TEST", storage.readValue("Test.Oracle.Storage", "TestValue", null));
        storage.removeValue("Test.Oracle.Storage", "TestValue");
        assert.isNull(storage.readValue("Test.Oracle.Storage", "TestValue", null));
    }

    const _listValuesTest = function (storage, assert, logger) {
        storage.clear();
        storage.writeValue("Test.Oracle.Storage", "TestValueA", "TEST");
        storage.writeValue("Test.Oracle.Storage", "TestValueB", 125.20);
        storage.writeValue("Test.Oracle.Storage", "TestValueC", false);
        const keys = storage.getValueNamesByPath("Test.Oracle.Storage");
        assert.areStrictlyEqual(3, keys.length);
        logger.logDebug(keys);
        assert.isTrue(Oracle.includes(keys, "TestValueA"));
        assert.isTrue(Oracle.includes(keys, "TestValueB"));
        assert.isTrue(Oracle.includes(keys, "TestValueC"));
    }

    // -----------------------------------------------------
    // Local Storage 
    // -----------------------------------------------------
    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'List all keys',
        test: (assert, logger) => {
            _listValuesTest(Oracle.Storage.Local, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'Removing value',
        test: (assert, logger) => {
            _removeValueTest(Oracle.Storage.Local, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'Clearing all values',
        test: (assert, logger) => {
            _clearValuesTest(Oracle.Storage.Local, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'Long Length Strings (10000 chars)',
        test: (assert, logger) => {
            _longLengthStringsTest(Oracle.Storage.Local, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'Basic Typed Values',
        test: (assert, logger) => {
            _basicTypedValuesTest(Oracle.Storage.Local, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Local Storage',
        name: 'Complex Values',
        test: (assert, logger) => {
            _complexValuesTest(Oracle.Storage.Local, assert, logger);
        }
    });

    // -----------------------------------------------------
    // Session Storage 
    // -----------------------------------------------------
    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'List all keys',
        test: (assert, logger) => {
            _listValuesTest(Oracle.Storage.Session, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'Removing value',
        test: (assert, logger) => {
            _removeValueTest(Oracle.Storage.Session, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'Clearing all values',
        test: (assert, logger) => {
            _clearValuesTest(Oracle.Storage.Session, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'Long Length Strings (10000 chars)',
        test: (assert, logger) => {
            _longLengthStringsTest(Oracle.Storage.Session, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'Basic Typed Values',
        test: (assert, logger) => {
            _basicTypedValuesTest(Oracle.Storage.Session, assert, logger);
        }
    });

    Oracle.Tests.registerTest({
        module: 'Oracle.Storage',
        category: 'Session Storage',
        name: 'Complex Values',
        test: (assert, logger) => {
            _complexValuesTest(Oracle.Storage.Session, assert, logger);
        }
    });

})();
