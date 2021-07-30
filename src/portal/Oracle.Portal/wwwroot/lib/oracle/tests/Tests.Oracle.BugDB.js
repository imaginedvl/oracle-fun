'use strict';

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'BugDBReportPage',
    name: 'GenerateSettingsPathForBugDbReportUrl',
    test: (assert, logger) => {
        const queryReport = "https://bug.oraclecorp.com/pls/bug/webbug_reports.do_custom_report?select_stmt=%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.programmer%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.SUPPORT_CONTACT%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.cs_priority%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.status%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.FIX_AVAIL_DATE%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.fixed_date%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.subject%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.category%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h.rptdate%20as%20DATE_REPORTED%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%28select%20BT.tags%20from%20BUG_TAGS%20BT%20where%20BT.rptno%20%3D%20h.RPTNO%29%20as%20TAG%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0D%0Ah.customer&where_stmt=h.product_id%20in%20%282421%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20and%20%28%28%20h.status%20%3C%3D%2041%29%20or%20h.status%20%3D%2080%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20AND%20UPPER%28H.CUSTOMER%29%20not%20like%20%27%25INTERNAL%25%27%0D%0A%20%20%20%20%20%20%20%20%20%20%20AND%20%28h.programmer%20IN%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%28SELECT%20bug_username%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FROM%20BUG_USER%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20WHERE%20STATUS%20%3D%20%27A%27%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20AND%20upper%28full_email%29%20%7C%7C%20%27%40ORACLE.COM%27%20IN%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%28SELECT%20upper%28email_address%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FROM%20hr_user_hierarchy_vw%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20START%20WITH%20email_address%20%3D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20upper%28%27laurent.devigne%40ORACLE.COM%27%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20CONNECT%20BY%20PRIOR%20email_address%20%3D%20manager_email%29%29%20or%20h.programmer%20%3D%20%27LDEVITRG%27%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20AND%20CATEGORY%20not%20like%20%27ADETXN%27%0D%0A%20%20%20%20%20%20%20%20%20%20%20and%20h.RPTD_BY%20%21%3D%20%28%27TLDSHREP%27%29%0D%0A%20%20%20%20%20%20%20%20%20%20%20and%20rownum%20%3C%2020000&order_stmt=h.fixed_date&rpt_title=Laurent%20Team%20Client%20Bugs%20Status%20%3C%3D%2041%20plus%2080&tot_cols=11&col_head=Assignee&col_head=Support%20Contact&col_head=Severity&col_head=Status&col_head=Fix%20ETA&col_head=Fixed%20Date&col_head=Subject&col_head=Component&col_head=Date%20Reported&col_head=Tag&col_head=Customer"
        const editReport = "https://bug.oraclecorp.com/pls/bug/WEBBUG_REPORTS.do_edit_report?cid_arr=2&cid_arr=3&cid_arr=9&cid_arr=8&cid_arr=7&cid_arr=11&cid_arr=13&cid_arr=72&c_count=8&query_type=2&fid_arr=1&fcont_arr=2421&fid_arr=125&fcont_arr=2421_A2L_ASSIGNED&f_count=2&rpt_title=Tag%20search%20results%20for%20Product%20ID:%202421#"
        assert.areEqual("BUGDBRPT-S-S765386283-W496668747-O1191745247", Oracle.BugDB.generateSettingsPathForBugDbReportUrl(queryReport))
        assert.areEqual("BUGDBRPT-Q-C1541121", Oracle.BugDB.generateSettingsPathForBugDbReportUrl(editReport));
        assert.areEqual("BUGDBRPT-C-703718552", Oracle.BugDB.generateSettingsPathForBugDbReportUrl("http://www.microsoft.com"));
        assert.areEqual("BUGDBRPT-C-703718552", Oracle.BugDB.generateSettingsPathForBugDbReportUrl("http://www.microsoft.com?extraparam=1"));
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug',
    name: 'Bug.match',
    test: (assert, logger) => {
        const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');
        assert.isTrue(bugs[1].match("Zooktel"));
        assert.isFalse(bugs[2].match("Zooktel"));
        assert.isTrue(bugs[1].match("Laurent"));
        assert.isTrue(bugs[1].match("  Laurent  "));
        assert.isTrue(bugs[4].match("VER"));
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Severity) ',
    test: (assert, logger) => {
        const severityMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Severity);

        const expectations = [
            { value: '1', count: 1, visibleCount: 1 },
            { value: '2', count: 1, visibleCount: 1 },
            { value: '3', count: 0, visibleCount: 0 },
            { value: '4', count: 3, visibleCount: 3 }
        ];

        _validateMetricsForField(assert, severityMetrics, expectations);
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Status) ',
    test: (assert, logger) => {
        const statusMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Status);

        // We have 5 bugs, 4 at status 11 and 1 at status 80 but since metrics are computed
        // for a lot of status, we only look for the ones we care.     
        const expectations = [
            { value: '11', count: 4, visibleCount: 4 },
            { value: '30', count: 0, visibleCount: 0 },
            { value: '37', count: 0, visibleCount: 0 },
            { value: '39', count: 0, visibleCount: 0 },
            { value: '40', count: 0, visibleCount: 0 },
            { value: '80', count: 1, visibleCount: 1 }
        ];

        _validateMetricsForField(assert, statusMetrics, expectations);
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Tags) ',
    test: (assert, logger) => {
        const tagMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Tags);

        // Tags computation is only done for some of the known tags, we will check the following ones:
        const expectations = [
            { value: 'REGRN', count: 1, visibleCount: 1 },
            { value: 'P1', count: 3, visibleCount: 3 },
            { value: 'QABLK', count: 2, visibleCount: 2 },
            { value: 'HCMBRONZE', count: 3, visibleCount: 3 },
            { value: 'HCMSILVER', count: 1, visibleCount: 1 },
            { value: 'FRCE-SQL-CLEANUP', count: 0, visibleCount: 0 },
            { value: 'VPAT_MUST', count: 0, visibleCount: 0 },
            { value: 'CUSTOMER_IMPACT', count: 1, visibleCount: 1 }
        ];

        _validateMetricsForField(assert, tagMetrics, expectations);

    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Customer) ',
    test: (assert, logger) => {
        const customerMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Customer);

        let nbrOfCustomers = 0;
        // For this one we only count the customers from the metrics, regardless who they are
        // we know that we should have 3 customer bugs
        $.each(customerMetrics, function (i, metric) { nbrOfCustomers += metric.count; });

        // We should have 3 customer bugs 
        assert.areEqual(nbrOfCustomers, 3, "Expecting to find 3 customer bugs");
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Assignee) ',
    test: (assert, logger) => {
        const assingeeMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Assignee);

        // 5 bugs distributed among 4 users, verify some counts (since value it's a user class, we don't use "_validateMetricsForField" 
        // but instead do a step further and check for the globalId
        const LDEVIGNEMetrics = assingeeMetrics.find(function (metric) { return metric.value.globalId === "LDEVIGNE"; });
        const NGAGOMetrics = assingeeMetrics.find(function (metric) { return metric.value.globalId === "NGAGO"; });

        assert.areEqual(LDEVIGNEMetrics.count, 2, "Expecting to find 2 bugs assigned to LDEVIGNE");
        assert.areEqual(NGAGOMetrics.count, 1, "Expecting to find 1 bug assigned to NGAGO");
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Component) ',
    test: (assert, logger) => {
        const componentMetrics = _fieldDistinctMetrics(Oracle.BugDB.Fields.Component);

        const expectations = [
            { value: 'HIRING', count: 3, visibleCount: 3 },
            { value: 'LIFECYCLE', count: 1, visibleCount: 1 },
            { value: 'OPPTMKT', count: 1, visibleCount: 1 }
        ];

        _validateMetricsForField(assert, componentMetrics, expectations);

    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (DateReported) ',
    test: (assert, logger) => {
        const bugSummary = _bugSummary(Oracle.BugDB.Fields.DateReported);

        const firstDate = bugSummary.getMinimum(Oracle.BugDB.Fields.DateReported);
        const lastDate = bugSummary.getMaximum(Oracle.BugDB.Fields.DateReported);

        // We expect bugs to be found between '01-JUN-2021' and '30-JUN-2021'
        assert.areComparable(firstDate, new Date('01-JUN-2021'));
        assert.areComparable(lastDate, new Date('30-JUN-2021'));
    }
});



Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug',
    name: 'Bug.isLate ',
    test: (assert, logger) => {
        const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');
        let currentDate = new Date();
        //tomorrow
        bugs[2].fixEta = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        assert.isFalse(bugs[2].isLate());
        //today
        bugs[2].fixEta = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        assert.isFalse(bugs[2].isLate());
        //yesterday
        bugs[2].fixEta = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
        assert.isTrue(bugs[2].isLate());
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug',
    name: 'Bug.isBackport ',
    test: (assert, logger) => {
        const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');
        assert.isTrue(bugs[1].isBackport());
        assert.isFalse(bugs[2].isBackport());
    }
});


// Gets the distinct metrics for a given field based on the BugSummary
const _fieldDistinctMetrics = function (field) {
    const bugSummary = _bugSummary(field);
    return bugSummary.getDistinctMetrics(field);
}


// Makes use of the Mock bugs list to build the BugSummary which computes the metrics
const _bugSummary = function (field) {
    const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');
    const bugList = [bugs[1], bugs[2], bugs[3], bugs[4], bugs[5]];

    return new Oracle.BugDB.BugSummary(bugList);
}

// Makes use of the metrics for a given field, then it tries to match the various values from the expectations
// which come from the metrics.
const _validateMetricsForField = function (assert, metrics, expectations) {

    /*for (const [key, value] of Object.entries(expectations)) {

        // get value from metrics 
        let currentMetric = metrics.find(function (metric) { return metric.value === key; });

        // compare with the expected array
        assert.areEqual(currentMetric.count, value);
    }*/
    assert.isTrue(JSON.stringify(metrics) === JSON.stringify(expectations));
}