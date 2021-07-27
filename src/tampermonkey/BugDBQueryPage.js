(function () {

    const bugDbPage = new Oracle.BugDB.BugTablePage();
    if (!Oracle.Conversion.defaultToBoolean(Oracle.Http.getQueryStringValue("showOriginal"))) {
        bugDbPage.hide();
    }
    Oracle.Settings.setRootPath("Oracle-TamperMonkey-" + bugDbPage.settingsPath);
    $('body').prepend("<div style='display:none' data-root-path='" + Oracle.Settings.getRootPath() + "'>");

    Oracle.HTML.addStyle("table td#main-view { width: 70%; vertical-align:top; } ");
    Oracle.HTML.addStyle("table td#side-view { width: 30%; vertical-align:top } ");
    const tableElement = $("<table data-control-path='TamperMonkey-BugDbTools-' style='width:100%' border='0'><tbody><tr><td id='main-view'></td><td id='side-view'></td></tr></tbody></table>");
    $('body').prepend(tableElement);
    const title = $('<h2>');
    title.text(bugDbPage.title);
    $('body').prepend(title);

    //Oracle.requires('Oracle', 'Oracle.HTML', '');

    const table = new Oracle.BugDB.BugGrid(
        {
            parent: "#main-view",
            classes: 'groupable sortable groupable-headers',
            fields: bugDbPage.fields,
            bugs: bugDbPage.bugs,
            name: 'BugDBGrid',
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
            parent: "#side-view",
            grid: table,
            data: bugDbPage.bugs,
            fields: bugDbPage.fields,
            name: 'BugDBPanel',
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

    Oracle.Controls.Themes.apply();

})();
