(function() {
     
    const bugDbPage = new Oracle.BugDB.BugTablePage();
    bugDbPage.hide();

    const table = new Oracle.Controls.Grids.Grid(
        {
            classes: 'groupable sortable groupable-headers',
            columns:
            [
                { id:'number', title: 'Number', formater: 'BugDBNumber',  },
                { id:'dateReported', title: 'Creation', formater: 'BugDBDate' },                        
                { id:'severity', title: 'Severity', formater: 'BugDBSeverity', groupable: true },
                { id:'status', title: 'Status', formater: 'BugDBStatus', groupable: true },
                { id:'assignee', title: 'Assignee', groupable: true}, 
                { id:'fixEta', title: 'Fix ETA', formater: 'BugDBDate' },         
                { id:'component', title: 'Component', groupable: true },         
                { id:'tags', title: 'Tags', formater: 'BugDBTags' },
                { id:'subject', title: 'Subject' },
                { id:'customer', title: 'Customer', formater: 'BugDBCustomer', groupable: true }
            ],
            data: bugDbPage.bugs,
            sort:
            {
                column: 'severity'
            },
            noItemsMessage: "No bugs are matching the criteria. I strongly suggest to spend some time creating a custom query to check if Joel is not hidding any bug with a missing or past due date!"
        });

    // -- Filter Panel Section -- //
    //  Oracle.BubDB.BugPanel  ( TODO )
    const filterPanel = new Oracle.BugDB.FilterPanel(
        {
            grid: table,
            data: bugDbPage.bugs,
            panelFilters:
            [
                /*{ id:'assignees', title: 'Assignees', targetField: Oracle.BugDB.Fields.Assignee , filterLayout: 'CLASS_BASED'}, 
                { id:'severity', title: 'Severity', targetField: Oracle.BugDB.Fields.Severity, filterLayout: 'SIMPLE'},
                { id:'components', title: 'Components', targetField: Oracle.BugDB.Fields.Component,  filterLayout: 'SIMPLE'},
                { id:'customer', title: 'Customers', targetField: Oracle.BugDB.Fields.Customer,  filterLayout: 'SIMPLE'},
                { id:'tags', title: 'Tags', targetField: Oracle.BugDB.Fields.Tags, filterLayout: 'SIMPLE'}*/
                Oracle.BugDB.Fields.Assignee,
                Oracle.BugDB.Fields.Severity,
                Oracle.BugDB.Fields.Component,
                Oracle.BugDB.Fields.Customer,
                Oracle.BugDB.Fields.Tags
            ]    
        });
    // -- /Filter Panel Section -- //

    // -- Search Panel Section -- //
    const searchPanel = new Oracle.BugDB.SearchPanel(
        {
            grid: table
        });
    // -- /Search Panel Section -- //

    Oracle.HTML.addStyle("table td#main-view { vertical-align:top; } ");
    Oracle.HTML.addStyle("table td#side-view { width: 300px; vertical-align:top } ");
    const tableElement = $("<table style='width:100%' border='0'><tbody><tr><td id='top-view'></td></tr><tr><td id='main-view'></td><td id='side-view'></td></tr></tbody></table>");
    tableElement.find("#main-view").append(table.element);
    tableElement.find("#top-view").append(searchPanel.element);
    tableElement.find("#side-view").append(filterPanel.element);
    $('body').prepend(tableElement);

    const title = $('<h2>');
    title.text(bugDbPage.title);
    $('body').prepend(title);

    Oracle.Controls.Themes.apply();

})();
