'use strict';

//                      
Oracle.Tests.registerTest({
    module: 'Oracle.Controls',
    category: 'Utilities',
    name: 'ComputeSettingsPathForElement',
    test: (assert, logger) => {
        const a = $("<div data-control-path='A'>")
        const b = $("<div>")
        const c = $("<div data-control-path='C'>")
        const d = $("<div data-control-path='D'>")
        const e = $("<div>")
        a.append(b);
        b.append(c);
        c.append(d);
        d.append(e);
        assert.areEqual("A-TEST", Oracle.Controls.computeSettingsPathForElement(a, "TEST"));
        assert.areEqual("A-TEST", Oracle.Controls.computeSettingsPathForElement(b, "TEST"));
        assert.areEqual("A-C-TEST", Oracle.Controls.computeSettingsPathForElement(c, "TEST"));
        assert.areEqual("A-C-D-TEST", Oracle.Controls.computeSettingsPathForElement(d, "TEST"));
        assert.areEqual("A-C-D-TEST", Oracle.Controls.computeSettingsPathForElement(e, "TEST"));
    }
});