'use strict';

//                      
Oracle.Tests.registerTest({
    module: 'Oracle.Controls',
    category: 'Utilities',
    name: 'ComputeSettingsPathForElement',
    test: (assert, logger) => {
        const a = $("<div data-path-settings='A'>")
        const b = $("<div>")
        const c = $("<div data-path-settings='C'>")
        const d = $("<div data-path-settings='D'>")
        const e = $("<div>")
        a.append(b);
        b.append(c);
        c.append(d);
        d.append(e);
        assert.areEqual("A", Oracle.Controls.computeSettingsPathForElement(a));
        assert.areEqual("A", Oracle.Controls.computeSettingsPathForElement(b));
        assert.areEqual("A-C", Oracle.Controls.computeSettingsPathForElement(c));
        assert.areEqual("A-C-D", Oracle.Controls.computeSettingsPathForElement(d));
        assert.areEqual("A-C-D", Oracle.Controls.computeSettingsPathForElement(e));
    }
});