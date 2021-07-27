'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Extensions
// ---------------------------------------------------------------------------------------------------------------- //
$.extend($.expr[':'], { // Contains Case Insensitive
    'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
            .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

$.extend($.expr[':'], { // Equals
    'equals': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').trim() === match[3];
    }
});

$.extend($.expr[':'], { // Equals Case Insensitive
    'equalsi': function (elem, i, match, array) {
        const text = (elem.textContent || elem.innerText || '').toLowerCase().trim();
        const matchValue = match[3].toLowerCase();
        return text === matchValue;
    }
});

if (!$.prototype.setContent) {
    $.prototype.setContent = function (content) {
        if (!Oracle.isEmpty(content)) {
            if (Oracle.isString(content)) {
                this.text(content);
            }
            else {
                this.html(content);
            }
        }
    };
}


if (!$.prototype.closestExcludingSelf) {
    $.prototype.closestExcludingSelf = function (selector) {
        const _this = $(this);
        const parent = _this.parent();
        if (Oracle.isEmptyOrWhiteSpaces(selector)) {
            return $();
        }
        else if (parent.length > 0) {
            return parent.closest(selector);
        }
        else {
            return $();
        }
    };
}

