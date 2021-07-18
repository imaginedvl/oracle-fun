'use strict';

Oracle.Tests.registerModule({
    name: 'Oracle.Storage',
    testInitialization: () => {
        Oracle.Storage.useMemory = true;
        Oracle.Storage.setLocalStorageContext("Tests.Oracle.Storage");
    }
})

Oracle.Tests.registerTest({
    module: 'Oracle.Storage',
    category: 'Local Values',
    name: 'Long Length Values',
    test: (assert, logger) => {
        Oracle.Storage.useMemory = true;
        const c_10 = "0123456789";
        const c_100 = c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10 + c_10;
        const c_1000 = c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100 + c_100;
        Oracle.Storage.setLocalStorageContext("Tests.Oracle.Storage");
        Oracle.Storage.writeLocalValue("TestData", c_10);
        assert.areEqual(c_10, Oracle.Storage.readLocalValue("TestData", null));
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.Storage',
    category: 'Local Values',
    name: 'Basic Typed Values',
    test: (assert, logger) => {
        const valueName = "BasicTypedValues"
        const currentDate = new Date();
        Oracle.Storage.writeLocalValue(valueName, "This is a string");
        assert.areStrictlyEqual("This is a string", Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, true);
        assert.areStrictlyEqual(true, Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, 125.20);
        assert.areStrictlyEqual(125.20, Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, currentDate);
        assert.areComparable(currentDate, Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, null);
        assert.isNull(Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, undefined);
        assert.isUndefined(Oracle.Storage.readLocalValue(valueName))
        Oracle.Storage.writeLocalValue(valueName, "");
        assert.areStrictlyEqual("", Oracle.Storage.readLocalValue(valueName))
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.Storage',
    category: 'Local Values',
    name: 'Conversions',
    test: (assert, logger) => {
        Oracle.Storage.useMemory = true;

        Oracle.Storage.read

    }
});