'use strict';

//                      
Oracle.Tests.registerTest({
    module: 'Oracle.Users',
    category: 'Knownclass',
    name: 'All cases',
    test: (assert, logger) => {
        const user = Oracle.Users.getOrCreateUser({ globalId: 'LDEVIGNE' });
        assert.areEqual("LDEVIGNE", Oracle.toNeutralString(user));
    }
});