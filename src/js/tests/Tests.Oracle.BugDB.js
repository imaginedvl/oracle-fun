'use strict';

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug',
    name: 'Bug.match',
    test: (assert, logger) => {
        const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');
        assert.isTrue(bugs[1].match("Zooktel"));
        assert.isFalse(bugs[2].match("Zooktel"));
        assert.isTrue(bugs[1].match("Laurent"));
        assert.isTrue(bugs[1].match("  Laurent  "));
        assert.isTrue(bugs[4].match("VER"));
    }
});