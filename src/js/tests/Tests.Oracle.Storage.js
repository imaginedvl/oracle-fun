'use strict';

Oracle.Tests.registerTest({
    module: 'Oracle.Storage',
    category: 'Local Values',
    name: 'Typed Values',
    test: (assert, logger) => {
        Oracle.Storage.useMemory = true;
        Oracle.Storage.setLocalStorageContext("Tests.Oracle.Storage");
        Oracle.Storage.writeLocalValue("TestData", true);

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