'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls.Themes
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    
    let _initialized = false;
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    if (!parent.Controls.hasOwnProperty('Themes')) parent.Controls.Themes = {};
    const result = parent.Controls.Themes;

    const _defaultTheme =
    {
        name: 'Default',
        variables:
        {
            bodyBackgroundColor: 'white',
            bodyTextColor: 'black',
    
            /* Controls */
            // Control background
            controlBackgroundColor: 'white',
            controlTextColor: 'black',
    
            controlTextColorLighten1: '#222',
            controlTextColorLighten2: '#444',
            controlTextColorLighten3: '#666',
            controlTextColorLighten4: '#888',
            controlTextColorLighten5: '#AAA',
            controlTextColorLighten6: '#CCC',

            controlBackgroundColorDarken1: '#EEE',
            controlBackgroundColorDarken2: '#CCC',
            controlBackgroundColorDarken3: '#AAA',
            controlBackgroundColorDarken4: '#888',
            controlBackgroundColorDarken5: '#666',

            // Control borders (like around the control)
            controlBorderColor: '#DEDEDE',
            controlBorderColorLigten1: '#EEEEEE',
            controlBorderColorLigten2: '#FEFEFE',
            // Control borders (inline, like row/cell borders)
            controlBorderBackgroundColor: 'white',
            controlBorderTextColor: 'black',
    
            // Emphasis should be used for stuff like the sorted column in a grid (not the header but the cell row)
            controlEmphasisBackgroundColor: '#FAFAFA',
            controlEmphasisTextColor: 'black',
            // Focus color
            controlFocusBackgroundColor: '#EFEFEF',
            controlFocusTextColor: 'black',
            
            // Danger
            errorBackgroundColor: '#d9534f',
            errorTextColor: 'white',
            errorInvertedBackgroundColor: 'white',
            errorInvertedTextColor: 'red',
    
            // Warning
            warningBackgroundColor: '#ffeb3b',
            warningTextColor: 'black',    

            // Info
            infoBackgroundColor: '#3ea6f0',
            infoTextColor: 'white',

            // Success
            successBackgroundColor: '#5cb85c',
            successTextColor: 'black',
    
            // Hyperlink
            hyperlinkTextColor: 'blue',

            // Primary color, which is the main color of the theme (red, orange, etc...)
            primaryBackgroundColor: '#ff5722',
            primaryTextColor: 'white',
            primaryInvertedBackgroundColor: 'white',
            primaryInvertedTextColor: '#ff5722',
    
            // For primary color, let's go with 5 light and 4 dark versions (just because...)
            primaryBackgroundColorDarken1: '#f4511e',
            primarytextColorDarken1: 'white',
            primaryBackgroundColorDarken2: '#e64a19',
            primaryTextColorDarken2: 'white',
            primaryBackgroundColorDarken3: '#d84315',
            primaryTextColorDarken3: 'white',
            primaryBackgroundColorDarken4: '##bf360c',
            primaryTextColorDarken4: 'black',       
            primaryBackgroundColorLighten1: '#ff7043',
            primaryTextColorLighten1: 'black',
            primaryBackgroundColorLighten2: '#ff8a65',
            primaryTextColorLighten2: 'black',
            primaryBackgroundColorLighten3: '#ffab91',
            primaryTextColorLighten3: 'black',
            primaryBackgroundColorLighten4: '#ffccbc',
            primaryTextColorLighten4: 'black',
            primaryBackgroundColorLighten5: '#fbe9e7',
            primaryTextColorLighten5: 'white'
        },
        css:
        [           
        ],
        dynamicCss:
        [            
        ]
    }

    const _darkTheme =
    {
        name: 'Dark',
        variables:
        {
            bodyBackgroundColor: 'black',
            bodyTextColor: 'white',

            primaryBackgroundColor: 'black',
            primaryTextColor: '#ff5722',

            // Danger
            errorBackgroundColor: '#333',
            errorTextColor: 'red',

            // Warning
            warningBackgroundColor: '#333',
            warningTextColor: 'yellow',
        }
    }

    const _allThemes =     { default: _defaultTheme, dark: _darkTheme }
    result.currentTheme = _defaultTheme;

    let _ruleNumber = 0;

    const _applyCSSRule = function(css)
    {
        const style = document.getElementById("OracleThemeRules") || (function() {
            const style = document.createElement('style');
            style.setAttribute("type", 'text/css');
            style.id = "OracleThemeRules";
            document.head.appendChild(style);
            return style;
        })();
        _ruleNumber++;
        const sheet = style.sheet;
        const index = (sheet.cssRules || sheet.rules || []).length;
        sheet.insertRule(css, index);
        Oracle.Logger.logDebug("CSS Rule Applied (#" + _ruleNumber + ").", { number: _ruleNumber, index: index, css: css } );
    }

    const _addCSSRule = function(css, themeName = null, dynamic = false) {
        let theme = _defaultTheme;
        if(!Oracle.isEmpty(themeName) && themeName !== 'default')
        {
            theme = _allThemes[themeName]
        }
        else{
            theme = _defaultTheme;
        }
        if(!Oracle.isEmpty(theme))
        {
            if(theme === Oracle.Controls.Themes.currentTheme && _initialized)
            {
                _applyCSSRule(css);
            }
            if(dynamic === true)
            {
                theme.dynamicCss.push(css);
            }
            else{
                theme.css.push(css);
            }
        }
        else{
            Oracle.Logger.logWarning("Cannot add CSS rule to theme '" + themeName + "'. Theme not found.");
        }
    }
    
    result.addStaticCSSRule = function(css, themeName = null) {
        _addCSSRule(css, themeName, false);
    }

    result.addDynamciCSSRule = function(css, themeName = null) {
        _addCSSRule(css, themeName, true);
    }

    const _fontList = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
    _addCSSRule('body { background-color: var(--bodyBackgroundColor); color: var(--bodyTextColor) width:100%; font-family: ' + _fontList + '; }');
    _addCSSRule('.oracle.control { width:100%; font-family: ' + _fontList + '; }');
    _addCSSRule('a { color: var(--hyperlinkTextColor); text-decoration: none');
    _addCSSRule('.oracle.control { background-color: var(--controlBackgroundColor); color: var(--controlTextColor); }');

    const _isReservedName = function(name)
    {
        switch(name)
        {
            case 'name', 'title':
                return true;
            default:
                return false;
        }
    }

    const _copyMembers = function(source, destination)
    {
        if(!Oracle.isEmpty(source) && !Oracle.isEmpty(destination))
        {
            for (const [key, value] of Object.entries(source)) {
                if(!_isReservedName(key))
                {
                    destination[key] = value;
                }
            }
        }
    }

    const _pushMembers = function(source, destination)
    {
        if(!Oracle.isEmpty(source) && !Oracle.isEmpty(destination))
        {
            for(let i = 0; i < source.length; i++)
            {
                destination.push(source[i]);
            }
        }
    }

    result.apply = function(themeName)
    {
        if(Oracle.isEmptyOrWhiteSpaces(themeName))
        {
            themeName = Oracle.Http.getQueryStringValue("theme");
        }
        // We clear the actual styles before to apply the new theme
        const rules = document.getElementById("OracleThemeRules");
        if(rules)
        {
            rules.remove();
        }
        _ruleNumber = 0;
        let selectedTheme = null;
        if(!Oracle.isEmpty(themeName) && themeName !== 'default')
        {
            const theme = _allThemes[themeName];
            if(!Oracle.isEmpty(theme))
            {
                selectedTheme = theme;
            }
            else{
                Oracle.Logger.logWarning("Theme '" + themeName + "' not found, fallbacking to default");
                themeName = 'default';
            }
        }
        else
        {
            themeName = 'default';
            selectedTheme = _defaultTheme;
        }

        const computedTheme = { variables: {}, css: [], dynamicCss: [] };

        _copyMembers(_defaultTheme.variables, computedTheme.variables);
        _pushMembers(_defaultTheme.css, computedTheme.css);
        _pushMembers(_defaultTheme.dynamicCss, computedTheme.dynamicCss);
        if(selectedTheme !== _defaultTheme)
        {
            _copyMembers(selectedTheme?.variables, computedTheme.variables);
            _pushMembers(selectedTheme?.css, computedTheme.css);
            _pushMembers(selectedTheme?.dynamicCss, computedTheme.dynamicCss);
        }

        // Now that we have a compute them, let's create the real cheese!
        let rootRule = ":root {";
        for (const [key, value] of Object.entries(computedTheme.variables)) {
            rootRule += ' --' + key + ": " + value + ";";
        }
        rootRule += "}";
        _applyCSSRule(rootRule);

        Oracle.Logger.logDebug("Applying Theme", {name: themeName, selectedTheme: selectedTheme, computedTheme: computedTheme, rootRule: rootRule } );

        // Then specific theme styles (before)
        for (const [key, value] of Object.entries(computedTheme.css)) {
            _applyCSSRule(value);
        }

        for (const [key, value] of Object.entries(computedTheme.dynamicCss)) {
            if(Oracle.isFunction(value))
            {
                _applyCSSRule(value());
            }
            else{
                _applyCSSRule(value);
            }
        }
        result.currentTheme = selectedTheme;
    }

    result.apply();
    _initialized = true;

    return parent;
}(Oracle));
