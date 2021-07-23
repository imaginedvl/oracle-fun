'use strict';

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
        const severityMetrics = _fieldMetrics(Oracle.BugDB.Fields.Severity);        

        const expectations = {
            "1": 1,
            "2": 1,
            "3": 0,
            "4": 3            
        };

        _validateMetricsForField(assert, severityMetrics, expectations);  
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Status) ',
    test: (assert, logger) => {
        const statusMetrics = _fieldMetrics(Oracle.BugDB.Fields.Status);

        // We have 5 bugs, 4 at status 11 and 1 at status 80 but since metrics are computed
        // for a lot of status, we only look for the ones we care.     
        const expectations = {
            "11": 4,
            "80": 1
        };

        _validateMetricsForField(assert, statusMetrics, expectations);           
    }
});

Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Tags) ',
    test: (assert, logger) => {
        const tagMetrics = _fieldMetrics(Oracle.BugDB.Fields.Tags);

        // Tags computation is only done for some of the known tags, we will check the following ones:
        const expectations = {
            P1: 3,
            QABLK: 2,
            REGRN: 1,
            HCMSILVER: 1,
            HCMBRONZE: 3                                    
        };

        _validateMetricsForField(assert, tagMetrics, expectations);
        
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Customer) ',
    test: (assert, logger) => { 
        const customerMetrics = _fieldMetrics(Oracle.BugDB.Fields.Customer);

        let nbrOfCustomers = 0;
        // For this one we only count the customers from the metrics, regardless who they are
        // we know that we should have 3 customer bugs
        $.each( customerMetrics, function( i, metric ){ nbrOfCustomers += metric.count; });

        // We should have 3 customer bugs 
        assert.areEqual(nbrOfCustomers, 3, "Expecting to find 3 customer bugs");        
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Assignee) ',
    test: (assert, logger) => {
        const assingeeMetrics = _fieldMetrics(Oracle.BugDB.Fields.Assignee);
        
        // 5 bugs distributed among 4 users, verify some counts (since value it's a user class, we don't use "_validateMetricsForField" 
        // but instead do a step further and check for the globalId
        const LDEVIGNEMetrics = assingeeMetrics.find( function( metric ){ return metric.value.globalId === "LDEVIGNE";} );
        const NGAGOMetrics = assingeeMetrics.find( function( metric ){ return metric.value.globalId === "NGAGO";} );        

        assert.areEqual(LDEVIGNEMetrics.count, 2, "Expecting to find 2 bugs assigned to LDEVIGNE");
        assert.areEqual(NGAGOMetrics.count, 1, "Expecting to find 1 bug assigned to NGAGO");        
    }
});


Oracle.Tests.registerTest({
    module: 'Oracle.BugDB',
    category: 'Bug.BugSummary',
    name: 'Metrics (Component) ',
    test: (assert, logger) => {
        const componentMetrics = _fieldMetrics(Oracle.BugDB.Fields.Component);

        const expectations = {
            HIRING: 3,
            LIFECYCLE: 1,
            OPPTMKT: 1
        };

        _validateMetricsForField(assert, componentMetrics, expectations);
        
    }
});


// Makes use of the Mock bugs list to build the BugSummary and compute the metrics
const _fieldMetrics = function (field){
    const bugs = Oracle.Tests.getMockData('Oracle.BugDB.Bugs');    
    const bugList = [bugs[1], bugs[2], bugs[3], bugs[4], bugs[5]];
    const bugSummary = new Oracle.BugDB.BugSummary(bugList);  

    return bugSummary.getDistinctMetrics(field);
}


// Makes use of the metrics for a given field, then it tries to match the various values from the expectations
// which come from the metrics.
const _validateMetricsForField = function (assert, metrics, expectations) {

    for (const [key, value] of Object.entries(expectations)) {

        // get value from metrics 
        let currentMetric = metrics.find(function (metric) { return metric.value === key; });        

        // compare with the expected array
        assert.areEqual(currentMetric.count, value);
    }
}