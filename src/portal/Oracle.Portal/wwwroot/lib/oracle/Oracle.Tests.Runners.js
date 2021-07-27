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
    _addStyle('.oracle.unitTestRunner > table tbody tr.module-row .module-header { user-select:none; cursor:pointer; font-size:100%;background-color:#EFEFEF; font-weight:600 } ');
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

    _addStyle('.oracle.unitTestRunner table tbody tr.test-row-details .test-row-details-container {  } ');

    _addStyle('.oracle.unitTestRunner table tbody tr.test-row-details { background-color:#FAFAFA;  } ');

    _addStyle('.oracle.unitTestRunner table .test-row-details-message-title { font-size:90%; padding-bottom:4px; color:#333; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-message { padding:4px; border: 1px solid gray; background-color:white; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-message-error { color:red; } ');

    _addStyle('.oracle.unitTestRunner table .test-row-details-log { padding:8px; border:#333; background-color:black; color:white; font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;  } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-title { font-size:90%; padding-bottom:4px; color:#333; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .text {   } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level { padding-right:8px; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-0 { color:red; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-1 { color:red; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-2 { color:yellow; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-3 { color:white; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-4 { color:blue; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-5 { color:blue; } ');
    _addStyle('.oracle.unitTestRunner table .test-row-details-log-entry .level-6 { color:gray; } ');


    const _getLevelText = function (level) {
        switch (level) {
            case Oracle.Logger.Level.Critical:
                return "CRIT&nbsp;&nbsp;";
            case Oracle.Logger.Level.Error:
                return "ERROR&nbsp;";
            case Oracle.Logger.Level.Warning:
                return "WARN&nbsp;&nbsp;";
            case Oracle.Logger.Level.Information:
                return "INFO&nbsp;&nbsp;";
            case Oracle.Logger.Level.Debug:
                return "DEBUG&nbsp;";
            case Oracle.Logger.Level.Trace:
                return "TRACE&nbsp;";
            default:
                return "NONE&nbsp;&nbsp;";
        }
    }

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
            this.detailsElement = $("<tr class='test-row-details'>");
            td = $("<td colspan='4' class='test-row-details-container'>");
            this.detailsElement.append(td);
            parent.append(this.detailsElement);
            this.visible = false;
            this.detailsVisible = false;
            this.hasDetails = false;
            this.refresh();
            this.invalidate();
        }

        refreshDetails() {
            const container = this.detailsElement.find('.test-row-details-container');
            container.empty();
            if (!Oracle.isEmpty(this.test.resultMessage)) {
                /*
                const messageTitle = $("<div class='test-row-details-message-title'>Message:</div>");
                container.append(messageTitle);
                */
                const message = $("<div class='test-row-details-message'>");
                if (this.test.status === Oracle.Tests.TestStatus.Failed) {
                    message.addClass("test-row-details-message-error");
                }
                message.text(this.test.resultMessage);
                container.append(message);
            }
            if (this.test.logs.length > 0) {
                const logTitle = $("<div class='test-row-details-log-title'>Console output:</div>");
                container.append(logTitle);
                const log = $("<div class='test-row-details-log'>");
                for (let i = 0; i < this.test.logs.length; i++) {
                    const logEntry = this.test.logs[i];
                    const entry = $("<div class='test-row-details-log-entry'>");
                    const level = $("<span class='level level-" + logEntry.level + "'>");
                    level.html(_getLevelText(logEntry.level));
                    const text = $("<span class='text'>");
                    if (Oracle.isObject(logEntry)) {
                        text.text(JSON.stringify(logEntry.message))
                    }
                    else {
                        text.text(logEntry.message)
                    }
                    entry.append(level);
                    entry.append(text);
                    log.append(entry);
                }
                container.append(log);
            }
            this.hasDetails = !container.is(':empty');
            return this.hasDetails;
        }

        invalidate() {
            if (this.visible) {
                this.element.removeClass('collapsed');
                if (this.detailsVisible && this.hasDetails) {
                    this.detailsElement.removeClass('collapsed');
                }
                else {
                    this.detailsElement.addClass("collapsed");
                }
            }
            else {
                this.element.addClass('collapsed');
                this.detailsElement.addClass("collapsed");
            }
        }

        forceShow(showDetails = false) {
            if (this.visible === false) {
                this.moduleRow.show();
            }
            if (showDetails) {
                this.showDetails();
            }
        }

        show() {
            this.visible = true;
            this.invalidate();
        }

        hide() {
            this.visible = false;
            this.invalidate();
        }

        toggle() {
            this.visible = !this.visible;
            this.invalidate();
        }

        toggleDetails() {
            this.detailsVisible = !this.detailsVisible;
            this.invalidate();
        }

        showDetails() {
            this.detailsVisible = true;
            this.invalidate();
        }

        hideDetails() {
            this.detailsVisible = false;
            this.invalidate();
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
            if (this.refreshDetails()) {
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

        show() {
            for (let i = 0; i < this.testRows.length; i++) {
                this.testRows[i].show();
            }
        }

        hide() {
            for (let i = 0; i < this.testRows.length; i++) {
                this.testRows[i].hide();
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

    const _populateStandaloneRunnerSettingsFromLocalStorage = function (settings) {
    }

    const _populateStandaloneRunnerSettingsFromUrl = function (settings) {
        if (Oracle.Conversion.defaultToBoolean(Oracle.Http.getQueryStringValue("execute"))) {
            settings.execute = true;
        }
        settings.modules = [];
        const module = Oracle.Http.getQueryStringValue("module");
        if (!Oracle.isEmptyOrWhiteSpaces(module)) {
            settings.modules.push(module);
        }
        if (Oracle.Conversion.defaultToBoolean(Oracle.Http.getQueryStringValue("collapseAll")) || Oracle.Conversion.defaultToBoolean(Oracle.Http.getQueryStringValue("collapse"))) {
            settings.collapseAll = true;
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
            if (controlSettings.useStorageSettings) {
                _populateStandaloneRunnerSettingsFromLocalStorage(settings);
            }
            if (controlSettings.useUrlSettings) {
                _populateStandaloneRunnerSettingsFromUrl(settings);
            }
            this.viewSettings = {};
            this.moduleRows = [];
            this.testRows = [];
            const includeModules = [];
            if (Array.isArray(controlSettings.modules)) {
                includeModules.pushRange(settings.modules);
            }
            this.initializeTable(includeModules, Oracle.Conversion.defaultToBoolean(controlSettings.collapseAll));
            Oracle.Logger.logDebug("UnitTestRunner initialized: " + this.id, { control: this });
            if (controlSettings.execute === true) {
                this.execute();
            }
        }

        execute() {
            for (let i = 0; i < this.moduleRows.length; i++) {
                this.moduleRows[i].execute();
            }
        }

        initializeTable(includeModules = null, collapseAll = false) {
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
                let addModule = true;
                if (Array.isArray(includeModules) && includeModules.length > 0) {
                    addModule = Oracle.includes(includeModules, module.name, (a, b) => b.startsWith(a));
                }
                if (addModule) {
                    const moduleRow = new _standaloneRunnerModuleRowClass(this, module, tbody);
                    this.moduleRows.push(moduleRow);
                    for (let j = 0; j < module.tests.length; j++) {
                        const testRow = new _standaloneRunnerTestRowClass(this, module.tests[j], moduleRow, tbody);
                        this.testRows.push(testRow);
                        moduleRow.testRows.push(testRow);
                    }
                    if (!collapseAll) {
                        moduleRow.show();
                    }
                }
            }
            this.element.append(table);
        }
    }

    return parent;
}(Oracle));
