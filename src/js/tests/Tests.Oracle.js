
Oracle.Tests.execute({ 
    category: 'Oracle',
    group: 'Distincts',
    name: 'Distincts tests (simple types)',
    test: (assert, logger) => 
    {
        const testDistinctNumber = [1, 1, 2, 2, 1, 2, 3, 2, 3, 2, 3, 2, 2, 2];
        const testDistinctStrings = ['a', 'b', 'c', 'a', 'A', 'c', 'b', 'B', 'd'];
        const testDistinctDates = [new Date(), new Date(), new Date(new Date().getDate() + 1)];
        assert.areEqual(3, testDistinctNumber.distinct().length);
        assert.areEqual(6, testDistinctStrings.distinct().length);
        assert.areEqual(4, testDistinctStrings.distinct((a, b) => a.toUpperCase().localeCompare(b.toUpperCase())).length);
        assert.areEqual(2, testDistinctDates.distinct().length);
    }
});

Oracle.Tests.execute({
    category: 'Oracle',
    group: 'Distincts',
    name: 'Distincts tests (objects using knowclasses)',
    test: (assert, logger) => {
        const MyObject = class { constructor(a, b, c) { this.a = a; this.b = b; this.c = c;}}
        const objects = [new MyObject('a', 'b', 'c'), new MyObject('x', 'y', 'z'), new MyObject('a', 'b', 'c'), new MyObject('1', '2', '3'), new MyObject('x', 'y', 'z'), ];
        Oracle.addKnownClass('MyObject', MyObject, (a, b) => Oracle.compare(a.a + a.b + a.c, b.a + b.b + b.c));
        assert.areEqual(3, objects.distinct().length);
    }
});

Oracle.Tests.execute({
    category: 'Oracle',
    group: 'Distincts',
    name: 'Distincts tests (objects with custom comparer)',
    test: (assert, logger) => {
        const MyObject = class { constructor(a, b, c) { this.a = a; this.b = b; this.c = c; } }
        const objects = [new MyObject('a', 'b', 'c'), new MyObject('x', 'y', 'z'), new MyObject('a', 'b', 'c'), new MyObject('1', '2', '3'), new MyObject('x', 'y', 'z'),];
        assert.areEqual(3, objects.distinct((a, b) => Oracle.compare(a.a + a.b + a.c, b.a + b.b + b.c)).length);
    }
});
