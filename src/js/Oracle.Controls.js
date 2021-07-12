'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    const result = parent.Controls;

    Oracle.HTML.addStyle(":root { --color-yellow: #ffeb3b;--color-success: #5cb85c;--color-warning: #f0ad4e;--color-danger: #d9534f; }");
    const _fontList = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
    $('body').css('font-family', _fontList);
    Oracle.HTML.addStyle('.oracle.control { width:100%; font-family: ' + _fontList + '; }');

    // Oracle Red Theme
    Oracle.HTML.addStyle(":root { --color-darken-4: #b71c1c; --color-darken-3: #c62828; --color-darken-2: #d32f2f; --color-darken-1: #e53935; --color-primary: #f44336; --color-lighten-1: #ef5350; --color-lighten-2: #e57373; --color-lighten-3: #ef9a9a; --color-lighten-4: #ffcdd2; --color-lighten-5: #ffebee; }");

    const theme = Oracle.Http.getQueryStringValue('theme');

    if (!Oracle.isEmpty(theme)) {
        switch (theme.toLowerCase()) {
            // Orange Zooktel Theme
            case 'zooktel', 'orange':
                Oracle.HTML.addStyle(":root { --text-color: black; --background-color: white;  --color-darken-4: #bf360c; --color-darken-3: #d84315; --color-darken-2: #e64a19; --color-darken-1: #f4511e; --color-primary: #ff5722; --color-lighten-1: #ff7043; --color-lighten-2: #ff8a65; --color-lighten-3: #ffab91; --color-lighten-4: #ffccbc; --color-lighten-5: #fbe9e7; }");
                break;
            case 'yellow':
                Oracle.HTML.addStyle(":root { --color-darken-4: #f57f17; --color-darken-3: #f9a825; --color-darken-2: #fbc02d;  --color-darken-1: #fdd835; --color-primary: #ffeb3b; --color-lighten-1: #ffee58; --color-lighten-2: #fff176; --color-lighten-3: #fff59d; --color-lighten-4: #fff9c4; --color-lighten-5: #fffde7; }");
                break;
            case 'purple':
                Oracle.HTML.addStyle(":root { --color-darken-4: #4a148c; --color-darken-3: #6a1b9a; --color-darken-2: #7b1fa2; --color-darken-1: #8e24aa; --color-primary: #9c27b0; --color-lighten-1: #ab47bc; --color-lighten-2: #ba68c8; --color-lighten-3: #ce93d8; --color-lighten-4: #e1bee7; --color-lighten-5: #f3e5f5; }");
                break;
            case 'blue':
                Oracle.HTML.addStyle(":root { --color-darken-4: #0d47a1; --color-darken-3: #1565c0; --color-darken-2: #1976d2; --color-darken-1: #1e88e5; --color-primary: #2196f3; --color-lighten-1: #42a5f5; --color-lighten-2: #64b5f6; --color-lighten-3: #90caf9; --color-lighten-4: #bbdefb; --color-lighten-5: #e3f2fd; }");
                break;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Renderers
    // ---------------------------------------------------------------------------------------------------------------- //
    const _renderers = {};

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Control
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Control = class {

        constructor(settings) {
            this.id = Oracle.generateId(25);
            if (Oracle.isEmpty(settings.target)) {
                this.element = $("<" + settings.elementType + " class='oracle control " + settings.type + "' data-control-id='" + this.id + "' data-control-type='" + settings.type + "'  >");
            }
            else {
                this.element = $(settings.target);
                this.element.addClass("oracle control " + settings.type);
                this.element.attr("data-control-id", this.id);
                this.element.attr("data-control-type", settings.type);
            }
        }

    };

    return parent;
}(Oracle));
