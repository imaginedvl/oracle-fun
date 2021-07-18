'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.HTML
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('HTML')) parent.HTML = {};

    const result = parent.HTML;

    result.addStyle = function (css) {
        if (!Oracle.isEmpty(css)) {
            const style = document.getElementById("OracleStyles") || (function () {
                const style = document.createElement('style');
                style.setAttribute("type", 'text/css');
                style.id = "OracleStyles";
                document.head.appendChild(style);
                return style;
            })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        }
    }

    result.htmlEncode = function (value) {
        return document.createElement('a').appendChild(
            document.createTextNode(value)).parentNode.innerHTML;
    }

    result.htmlDecode = function (value) {
        var a = document.createElement('a');
        a.innerHTML = value;
        return a.textContent;
    }

    Oracle.Formating.addFormaterCollection('html', 'default');

    const _addFormater = function (ids, types, knownClasses, callback) {
        return Oracle.Formating.addFormater(ids, types, knownClasses, callback, 'html');
    }

    result.formatValue = function (value, settings) {
        return Oracle.Formating.formatValue(value, settings, 'html');
    }


    result.addFormater = _addFormater;

    return parent;
}(Oracle));
