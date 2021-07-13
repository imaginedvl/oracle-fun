'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls.Themes
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    let _themeApplied = false;
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    if (!parent.Controls.hasOwnProperty('Themes')) parent.Controls.Themes = {};
    const result = parent.Controls.Themes;

    const _themeUpdaters = [];

    result.addCSSRule = function(css) {
        const style = document.getElementById("OracleThemeRules") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "OracleThemeRules";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    result.addUpdater = function(callback)
    {
        _themeUpdaters.push(callback);
        callback();
    }

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
            controlBackgroundColor: 'white',
            controlTextColor: 'black',
    
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

            // Cleanup
            cleanupBackgroundColor: '#3ea6f0',
            cleanupTextColor: 'white',

            // Success
            successBackgroundColor: '#5cb85c',
            successTextColor: 'black',
    
            // Success
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
        {            
        },
        cssOverrides:
        {

        }
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

    result.currentTheme = null;

    const _copyMembers = function(source, destination)
    {
        if(!Oracle.isEmpty(source) && !Oracle.isEmpty(destination))
        {
            for (const [key, value] of Object.entries(source)) {
                if(!_isReservedName(key) && !destination.hasOwnProperty(key))
                {
                    destination[key] = value;
                }
            }
        }
    }

    result.apply = function(themeName)
    {
        _themeApplied = true;
        if(Oracle.isEmptyOrWhiteSpaces(themeName))
        {
            themeName = Oracle.Http.getQueryStringValue("theme");
        }
        // We clear the actual styles before to apply the new theme
        const css = document.getElementById("OracleThemeRules") ;
        if(css)
        {
            css.innerHTML = "";
        }
        let selectedTheme = null;
        if(!Oracle.isEmpty(themeName) && themeName !== 'default')
        {
            const theme = _allThemes[themeName];
            if(!Oracle.isEmpty(theme))
            {
                Oracle.Logger.logDebug("Apply Theme: " + themeName);
                selectedTheme = theme;
            }
            else{
                Oracle.Logger.logWarning("Theme '" + themeName + "' not found, fallbacking to default");
            }
        }
        else
        {
            selectedTheme = _defaultTheme;
            Oracle.Logger.logDebug("Apply default theme");
        }
        const computedTheme = { variables: {}, css: {}, cssOverrides: {} };
        _copyMembers(selectedTheme?.variables, computedTheme?.variables);
        _copyMembers(selectedTheme?.css, computedTheme?.css);
        _copyMembers(selectedTheme?.cssOverrides, computedTheme?.cssOverrides);
        _copyMembers(_defaultTheme?.variables, computedTheme?.variables);
        _copyMembers(_defaultTheme?.css, computedTheme?.css);
        _copyMembers(_defaultTheme?.cssOverrides, computedTheme?.cssOverrides);

        // Now that we have a compute them, let's create the real cheese!
        let rootRule = ":root {";
        for (const [key, value] of Object.entries(computedTheme.variables)) {
            rootRule += ' --' + key + ": " + value + ";";
        }
        rootRule += "}";
        Oracle.Controls.Themes.addCSSRule(rootRule);

        // Global Styles
        const _fontList = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
        Oracle.Controls.Themes.addCSSRule('body { background-color: var(--bodyBackgroundColor); color: var(--bodyTextColor) width:100%; font-family: ' + _fontList + '; }');
        Oracle.Controls.Themes.addCSSRule('.oracle.control { width:100%; font-family: ' + _fontList + '; }');
        Oracle.Controls.Themes.addCSSRule('a { color: var(--hyperlinkTextColor); text-decoration: none');

        // Then specific theme styles (before)
        for (const [key, value] of Object.entries(computedTheme.css)) {
            Oracle.Controls.Themes.addCSSRule(value);
        }
        _themeUpdaters.forEach(updater => {
            updater();
        });
        // Then specific theme styles (after)
        for (const [key, value] of Object.entries(computedTheme.cssOverrides)) {
            Oracle.Controls.Themes.addCSSRule(value);
        }
        result.currentTheme = selectedTheme;
    }

    // Base Controls Styles
    Oracle.Controls.Themes.addUpdater(() =>
    {
        Oracle.Controls.Themes.addCSSRule('.oracle.control { background-color: var(--controlBackgroundColor); color: var(--controlTextColor); }');
    });

    return parent;
}(Oracle));
