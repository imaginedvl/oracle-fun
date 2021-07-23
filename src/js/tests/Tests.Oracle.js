'use strict';

//                      
Oracle.Tests.registerTest({
    module: 'Oracle.Strings',
    category: 'Utilities',
    name: 'IsEmpty / isEmptyOrWhiteSpaces',
    test: (assert, logger) => {

        assert.isTrue(Oracle.isEmpty(null), "Null = isEmpty");
        assert.isTrue(Oracle.isEmpty(undefined), "Undefined = isEmpty");
        assert.isTrue(Oracle.isEmpty(""), "'' = isEmpty");
        assert.isTrue(Oracle.isEmpty($('#DoNotExists'), "Empty jQuery = isEmpty"));
        assert.isFalse(Oracle.isEmpty("\t"), "'\tt' != isEmpty");
        assert.isFalse(Oracle.isEmpty("     "), "'     ' != isEmpty");
        assert.isFalse(Oracle.isEmpty("x"), "'x' != isEmpty");
        assert.isFalse(Oracle.isEmpty([]), "[] != isEmpty");
        assert.isFalse(Oracle.isEmpty($('<div>')), "$<div> != isEmpty");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces("\n                             \n                 "), "'\\n                             \\n                 '= isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces(null), "Null = isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces(undefined), "Undefined = isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces(""), "'' = isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces($('#DoNotExists')), "Empty jQuery = isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces("     "), "'     ' = isEmptyOrWhiteSpaces");
        assert.isTrue(Oracle.isEmptyOrWhiteSpaces("\t"), "'\\t' = isEmptyOrWhiteSpaces");
        assert.isFalse(Oracle.isEmptyOrWhiteSpaces("x"), "'x' != isEmptyOrWhiteSpaces");
        assert.isFalse(Oracle.isEmptyOrWhiteSpaces([]), "[] != isEmptyOrWhiteSpaces");
        assert.isFalse(Oracle.isEmptyOrWhiteSpaces($('<div>')), "$<div> != isEmptyOrWhiteSpaces");

    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.Strings',
    category: 'Utilities',
    name: 'Trim',
    test: (assert, logger) => {
        assert.areEqual("", Oracle.Strings.trim("\n                             \n                 "), "trim('\\n                             \\n                 ')");
        assert.areEqual("", "   ".trim(), "trim('   ')");
        assert.areEqual("", "  ".trim(), "trim('  ')");
        assert.areEqual("", " ".trim(), "trim(' ')");
        assert.areEqual("", "   ".trimStart(), "trimStart('   ')");
        assert.areEqual("", "  ".trimStart(), "trimStart('  ')");
        assert.areEqual("", " ".trimStart(), "trimStart(' ')");
        assert.areEqual("", "   ".trimEnd(), "trimEnd('   ')");
        assert.areEqual("", "  ".trimEnd(), "trimEnd('  ')");
        assert.areEqual("", " ".trimEnd(), "trimEnd(' ')");
        assert.areEqual(" X", " X ".trimEnd());
        assert.areEqual("X ", " X ".trimStart());
        assert.areEqual("X", " X ".trim());
        assert.areEqual("X", Oracle.Strings.trim(" X "));
        assert.areEqual("X", Oracle.Strings.trim("\r\nX "));
        assert.areEqual("X", Oracle.Strings.trim(" X "));
        assert.areEqual("X", Oracle.Strings.trim(" X\t\t"));
        assert.areEqual("X", Oracle.Strings.trim(" X "));
        assert.areEqual("X", Oracle.Strings.trim(" - X - ", [' ', '\r', '\n', '-']));
        assert.areEqual(null, Oracle.Strings.trim(null));
        assert.areEqual("", Oracle.Strings.trim(""));
        assert.areEqual(null, Oracle.Strings.trim(undefined));
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle',
    category: 'Utilities',
    name: 'Compare Dates',
    test: (assert, logger) => {
        const currentDate = new Date();
        const fromStringDate = new Date(currentDate.toISOString());
        assert.areStrictlyEqual(currentDate.getTime(), fromStringDate.getTime());
        assert.areNotEqual(currentDate, fromStringDate);
        assert.areComparable(currentDate, fromStringDate);
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle',
    category: 'Utilities',
    name: 'Check Months Names and Abbreviation',
    test: (assert, logger) => {
        const valueDate = new Date('December 25, 1995');
        const month = valueDate.getMonth() + 1;
        assert.areEqual('DEV', Oracle.Dates.getMonthAbbreviation(month).toUpperCase());
        assert.areEqual('12', month);
        assert.areEqual('DECEMBER', Oracle.Dates.getMonthName(month).toUpperCase());
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle',
    category: 'Utilities',
    name: 'Distinct',
    test: (assert, logger) => {

        // simple types
        const testDistinctNumber = [1, 1, 2, 2, 1, 2, 3, 2, 3, 2, 3, 2, 2, 2];
        const testDistinctStrings = ['a', 'b', 'c', 'a', 'A', 'c', 'b', 'B', 'd'];
        const testDistinctDates = [new Date(), new Date(), new Date(new Date().getDate() + 1)];
        assert.areEqual(3, testDistinctNumber.distinct().length);
        assert.areEqual(6, testDistinctStrings.distinct().length);
        assert.areEqual(4, testDistinctStrings.distinct((a, b) => a.toUpperCase().localeCompare(b.toUpperCase())).length);
        assert.areEqual(2, testDistinctDates.distinct().length);

        // objects using knowclasses
        let MyObject = class { constructor(a, b, c) { this.a = a; this.b = b; this.c = c; } }
        let objects = [new MyObject('a', 'b', 'c'), new MyObject('x', 'y', 'z'), new MyObject('a', 'b', 'c'), new MyObject('1', '2', '3'), new MyObject('x', 'y', 'z'),];
        Oracle.addKnownClass('MyObject', MyObject, (a, b) => Oracle.compare(a.a + a.b + a.c, b.a + b.b + b.c));
        assert.areEqual(3, objects.distinct().length);

        // objects with custom comparer
        MyObject = class { constructor(a, b, c) { this.a = a; this.b = b; this.c = c; } }
        objects = [new MyObject('a', 'b', 'c'), new MyObject('x', 'y', 'z'), new MyObject('a', 'b', 'c'), new MyObject('1', '2', '3'), new MyObject('x', 'y', 'z'),];
        assert.areEqual(3, objects.distinct((a, b) => Oracle.compare(a.a + a.b + a.c, b.a + b.b + b.c)).length);

    }
});


Oracle.Tests.registerTest({
    module: 'Oracle',
    category: 'Utilities',
    name: 'Array.pushRange',
    test: (assert, logger) => {
        const a = ['X', 'Y', 'Z'];
        const b = ['A', 'B', 'C'];
        a.pushRange(b);
        assert.areEqual(6, a.length);
        const x = ['X', 'Y', 'Z'];
        const y = 'A';
        x.pushRange(y);
        assert.areEqual(4, x.length);
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle',
    category: 'Utilities',
    name: 'Array.includes',
    test: (assert, logger) => {
        const a = ['X', 'Y', 'Z'];
        const b = 'Y';
        const c = 'A';
        const d = 'Y';
        assert.isTrue(Oracle.includes(a, b));
        assert.isFalse(Oracle.includes(a, c));
        assert.isFalse(Oracle.includes(null, c));
        assert.isTrue(Oracle.includes(b, d));
        assert.isFalse(Oracle.includes(b, c));
    }
});
