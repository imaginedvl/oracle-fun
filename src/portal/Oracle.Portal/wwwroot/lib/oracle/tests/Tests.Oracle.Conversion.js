'use strict';

//                      
Oracle.Tests.registerTest({
    module: 'Oracle.Conversion',
    category: 'Numbers',
    name: 'All cases',
    test: (assert, logger) => {
        assert.areEqual(150, Oracle.Conversion.toNumber(150));
        assert.areEqual(150, Oracle.Conversion.toNumber("150"));
        assert.isFalse(Oracle.Conversion.tryToNumber("tX150SDADS").success);
        assert.areEqual(37, Oracle.Conversion.defaultToNumber("tX150SDADS", 37));
        assert.areEqual(150, Oracle.Conversion.toNumber({ number: 150 }?.number));
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.Conversion',
    category: 'Booleans',
    name: 'All cases',
    test: (assert, logger) => {
        assert.isTrue(Oracle.Conversion.toBoolean("true"));
        assert.isFalse(Oracle.Conversion.toBoolean("false"));
        assert.isFalse(Oracle.Conversion.tryToBoolean("tX150SDADS").success);
        assert.isTrue(Oracle.Conversion.defaultToBoolean("tX150SDADS", true));
    }
});