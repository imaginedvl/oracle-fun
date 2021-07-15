'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.SearchPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbsearchpanel { padding: 5px 0 10px 0; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbsearchpanel input.searchKeyword { height: 35px; padding-left: 10px; }');

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: SearchPanel
    // ---------------------------------------------------------------------------------------------------------------- //
    result.SearchPanel = class extends Oracle.Controls.Control {

        constructor(controlSettings) {

            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'bugdbsearchpanel';
            controlSettings.elementType = 'div';
            super(controlSettings);

            // Init grid
            if(Oracle.isEmpty(controlSettings.grid))
            {
                Oracle.Logger.logError("Target grid is not provided.");
            }  
            this.grid = controlSettings.grid;

            // Init search box
            const searchBox = $("<input id='searchBox' type='text' placeholder='Refine search' size='50' class='searchKeyword'>");
            searchBox.on("input", (e) => {
                const keyword = $(e.target).val();
                console.log("searchBox keyword", keyword);
                if (!Oracle.isEmptyOrWhiteSpaces(keyword)) 
                {
                    if (keyword.length > 1) 
                    {
                        this.grid.filter((settings) => {
                            let bug = settings.data;
                            console.log("grid filter predicate", keyword);
                            return bug.match(keyword);
                        });
                    }
                }
                else 
                {
                    this.grid.reset();
                }
            });
            this.element.append(searchBox);

            Oracle.Logger.logDebug("SearchPanel initialized: " + this.id, { panel: this });
        }

    }

    return parent;
}(Oracle));
