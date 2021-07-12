(function() {

    $('body').css("font-family", '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";');

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
                 { id: 'status', title: 'Status', formater: 'BugDBStatus', groupable: true },
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

    Oracle.HTML.addStyle("table td#main-view { } ");
    Oracle.HTML.addStyle("table td#side-view { width: 300px; } ");
    const tableElement = $("<table style='width:100%' border='0'><tbody><tr><td id='main-view'></td><td id='side-view'></td></tbody></table>");
    tableElement.find("#main-view").append(table.element);
    $('body').prepend(tableElement);

})();
