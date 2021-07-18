'use strict';

Oracle.Tests.registerTest({
    module: 'Oracle.Storage',
    category: 'Local Values',
    name: 'Boolean values',
    test: (assert, logger) => {
        Oracle.Storage.useMemory = true;
    }
});