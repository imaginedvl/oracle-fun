(function () {

    const bugDbPage = new Oracle.BugDB.BugTablePage();
    if (!Oracle.Conversion.toBoolean(Oracle.Http.getQueryStringValue("showOriginal"))) {
        bugDbPage.hide();
    }

    //Oracle.requires('Oracle', 'Oracle.HTML', '');

    const table = new Oracle.BugDB.BugGrid(
        {
            classes: 'groupable sortable groupable-headers',
            fields: bugDbPage.fields,
            bugs: bugDbPage.bugs,
            sort:
            {
                column: 'severity'
            },
            noItemsMessage: "No bugs are matching the criteria. I strongly suggest to spend some time creating a custom query to check if Joel is not hidding any bug with a missing or past due date!"
        });

    //Example of custom Filter declaration
    /*Oracle.BugDB.addCustomPanelFilter('MyFilter', 'My filter', (bug) => {
        return bug.subject.startsWith('R');
    }, (bugs) => {
        let count = 0;
        for (let i = 0; i < bugs.length; i++) {
            if (bugs[i].subject.startsWith('R')) {
                count++;
            }
        }
        return count;
    })*/

    // -- Filter Panel Section -- //
    //  Oracle.BubDB.BugPanel  ( TODO )
    const filterPanel = new Oracle.BugDB.FilterPanel(
        {
            grid: table,
            data: bugDbPage.bugs,
            panels:
                [
                    { type: Oracle.BugDB.PanelTypes.Reset },
                    { type: Oracle.BugDB.PanelTypes.Summary },
                    { type: Oracle.BugDB.PanelTypes.Search },
                    { type: Oracle.BugDB.PanelTypes.Standard },
                    {
                        type: Oracle.BugDB.PanelTypes.Custom,
                        title: 'Advanced Filters',
                        filters: [Oracle.BugDB.CustomFilters.IsCustomer, Oracle.BugDB.CustomFilters.IsLate]
                    },
                ]
        });
    // -- /Filter Panel Section -- //

    Oracle.HTML.addStyle("table td#main-view { vertical-align:top; } ");
    Oracle.HTML.addStyle("table td#side-view { width: 300px; vertical-align:top } ");
    const tableElement = $("<table style='width:100%' border='0'><tbody><tr><td id='main-view'></td><td id='side-view'></td></tr></tbody></table>");
    tableElement.find("#main-view").append(table.element);
    tableElement.find("#side-view").append(filterPanel.element);
    $('body').prepend(tableElement);

    const title = $('<h2>');
    title.text(bugDbPage.title);
    $('body').prepend(title);

    Oracle.Controls.Themes.apply();

})();
