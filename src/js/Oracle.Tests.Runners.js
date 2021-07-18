'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Tests.Runners
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Tests')) parent.Tests = {};
    if (!parent.Tests.hasOwnProperty('Runners')) parent.Tests.Runners = {};

    const result = parent.Tests.Runners;


    /* To avoid dependencies on anything else but Oracle.js, let's deal with styles locally */
    const _addStyle = function (css) {
        if (!Oracle.isEmpty(css)) {
            const style = document.getElementById("OracleUnitTestStyles") || (function () {
                const style = document.createElement('style');
                style.setAttribute("type", 'text/css');
                style.id = "OracleUnitTestStyles";
                document.head.appendChild(style);
                return style;
            })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        }
    }

    _addStyle('.oracle.unitTestRunner > table { width: 100%; } ');
    _addStyle('.oracle.unitTestRunner > table { border-spacing:0px; border-collapse: collapse  } ');
    _addStyle('.oracle.unitTestRunner > table tbody td { border:1px solid gray; padding: 4px; padding-bottom: 8px;padding-top: 8px; vertical-align:middle  } ');

    _addStyle('.oracle.unitTestRunner > table tbody tr .cell-actions { width:10%;text-align:center; } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr .cell-actions > a { font-size:90%; } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr .cell-actions > a:not(:last-child)::after { content: ", " } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr .cell-result  { width:15%; text-align:center; } ');

    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row td { border-bottom:2px solid gray;  border-top:2px solid gray; } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row .module-header { cursor:pointer; font-size:100%;background-color:#EFEFEF; font-weight:600 } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row .module-header:hover { background-color:#FAFAFA; } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row .module-header:active { background-color:#DFDFDF; } ');
    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row .module-header .module-metrics { font-weight:normal;float:right; font-size:90% } ');

    _addStyle('.oracle.unitTestRunner table tbody tr.test-row.collapsed { display:none } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-header { width:60% } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td .test-header-actions { float:right; } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-result-success { background-color: #90D0B6;color:black; } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-result-failed { background-color: #F8B2BD;color:black; } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-result-skipped { background-color: #A6C7EA;color:black;  } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-result-unknown { background-color: #B9DDAD;color:black; } ');
    _addStyle('.oracle.unitTestRunner table tbody tr td.test-result-partialsuccess { background-color: #B9DDAD;color:black; } ');
    _addStyle('.oracle.unitTestRunner table tbody tr.test-row-details.collapsed { display:none } ');
    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: StandaloneRunnerTestRow
    // ---------------------------------------------------------------------------------------------------------------- //
    const _standaloneRunnerTestRowClass = class {
        constructor(runner, test, moduleRow, parent) {
            this.runner = runner;
            this.test = test;
            this.moduleRow = moduleRow;
            this.element = $("<tr class='test-row'>");
            // Category
            let td = $("<td class='test-category'>");
            td.text(test.category);
            this.element.append(td);
            // Name
            td = $("<td class='test-header'><span class='test-name'></span><span class='cell-actions test-header-actions'></span></td>");
            td.find('.test-name').text(test.name);
            this.element.append(td);
            // Status
            td = $("<td class=' test-result test-result-" + test.status.toLowerCase() + " cell-result'>");
            this.element.append(td);
            // Actions
            td = $("<td class='cell-actions test-actions'>");
            this.element.append(td);
            parent.append(this.element);
            this.element.data("data", this);
            this.refresh();
            this.detailsElement = $("<tr class='test-row-details collapsed'>");
            td = $("<td colspan='4'>");
            this.detailsElement.append(td);
            parent.append(this.detailsElement);
        }

        toggle() {
            this.element.toggleClass('collapsed');
            this.detailsElement.addClass("collapsed");
        }

        toggleDetails() {
            this.detailsElement.toggleClass("collapsed");
        }

        execute() {
            this.test.execute();
            this.refresh();
            this.moduleRow.refresh();
        }

        refresh() {
            let td = this.element.find("td.test-result");
            td.removeClass();
            td.addClass("cell-result test-result test-result-" + this.test.status.toLowerCase());
            td.text(Oracle.Tests.getStatusText(this.test.status));
            td = this.element.find("td.test-actions");
            td.empty();
            let action;
            let actionName = "Execute";
            if (this.test.status === Oracle.Tests.TestStatus.Success) {
                actionName = "Re-execute";
            }
            else if (this.test.status === Oracle.Tests.TestStatus.Failed) {
                actionName = "Retry";
            }
            action = $("<a href='#'>" + actionName + "</a>");
            action.on("click", (e) => {
                this.execute();
                return false;
            });
            td.append(action);
            const headerActions = this.element.find(".test-header-actions");
            headerActions.empty();
            if (this.test.status === Oracle.Tests.TestStatus.Success || this.test.status === Oracle.Tests.TestStatus.Failed) {
                action = $("<a href='#'>Details</a>");
                action.on("click", (e) => {
                    this.toggleDetails();
                    return false;
                });
                headerActions.append(action);
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: StandaloneRunnerModuleRow
    // ---------------------------------------------------------------------------------------------------------------- //
    const _standaloneRunnerModuleRowClass = class {
        constructor(runner, module, parent) {
            this.runner = runner;
            this.module = module;
            this.element = $("<tr class='module-row'>");
            let td = $("<td colspan='2' class='module-header' ><span class='module-name'></span><span class='module-metrics'></span></td>");
            td.find(".module-name").text(this.module.name);
            td.on('click', () => { this.toggle() });
            this.element.append(td);
            // Status
            td = $("<td class='module-result test-result-" + module.status.toLowerCase() + " cell-result'>");
            this.element.append(td);
            // Actions
            td = $("<td class='cell-actions module-actions'>");
            this.element.append(td);
            parent.append(this.element);
            this.element.data("data", this);
            this.testRows = [];
            this.refresh();
        }

        execute() {
            for (let i = 0; i < this.testRows.length; i++) {
                this.testRows[i].execute();
            }
        }

        toggle() {
            for (let i = 0; i < this.testRows.length; i++) {
                this.testRows[i].toggle();
            }
        }

        refresh() {
            let td = this.element.find("td.module-result");
            td.removeClass();
            td.addClass("cell-result module-result test-result-" + this.module.status.toLowerCase());
            td.text(Oracle.Tests.getStatusText(this.module.status));
            const metrics = this.element.find(".module-metrics");
            metrics.text("Total: " + this.module.tests.length + ", Success: " + this.module.successCount + ", Failed: " + this.module.failedCount);

            td = this.element.find("td.module-actions");
            td.empty();
            let action;
            let actionName = "Execute";
            if (this.module.status === Oracle.Tests.TestStatus.Success) {
                actionName = "Re-execute";
            }
            else if (this.module.status === Oracle.Tests.TestStatus.Failed) {
                actionName = "Retry";
            }
            action = $("<a href='#'>" + actionName + "</a>");
            action.on("click", (e) => {
                this.execute();
                return false;
            });
            td.append(action);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: StandaloneRunner
    // ---------------------------------------------------------------------------------------------------------------- //
    result.StandaloneRunner = class extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'unitTestRunner';
            controlSettings.elementType = 'table';
            super(controlSettings);
            this.moduleRows = [];
            this.testRows = [];
            this.initializeTable();
            Oracle.Logger.logDebug("UnitTestRunner initialized: " + this.id, { control: this });
        }

        initializeTable() {
            const table = $("<table >");
            const thead = $('<thead>');
            const tr = $('<tr>');
            let th = $('<th>');
            table.append(thead);
            const tbody = $('<tbody>');
            table.append(tbody);
            const modules = Oracle.Tests.getAllModules();
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                const moduleRow = new _standaloneRunnerModuleRowClass(this, module, tbody);
                this.moduleRows.push(moduleRow);
                for (let j = 0; j < module.tests.length; j++) {
                    const testRow = new _standaloneRunnerTestRowClass(this, module.tests[j], moduleRow, tbody);
                    this.testRows.push(testRow);
                    moduleRow.testRows.push(testRow);
                }
            }
            this.element.append(table);
        }
    }

    return parent;
}(Oracle));
