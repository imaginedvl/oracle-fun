'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};

    const result = parent.BugDB;

    result.Statuses =
    {
        11: { name: 'Open', number: 11, filterVisible: true },
        15: { name: 'Enhancement Request', number: 15 },
        30: { name: 'More Info Requested', number: 30, filterVisible: true },
        31: { name: 'Could Not Reproduce', number: 31 },
        32: { name: 'Not a Bug', number: 32 },
        33: { name: 'Suspended', number: 33 },
        36: { name: 'Duplicate Bug', number: 36 },
        37: { name: 'Merged', number: 37, filterVisible: true },
        39: { name: 'Waiting For Codeline', number: 39, filterVisible: true },
        40: { name: 'Waiting', number: 40, filterVisible: true },
        41: { name: 'Base Bug fixed', number: 41 },
        71: { name: 'Closed, data fix', number: 71 },
        72: { name: 'Closed, data fix', number: 72 },
        78: { name: 'Closed Environment Issue', number: 78 },
        80: { name: 'Ready To Validate', number: 80, filterVisible: true },
        84: { name: 'Closed, not feasible to fix', number: 84 },
        90: { name: 'Closed, Verified by Filer', number: 90 },
        91: { name: 'Closed, Could Not Reproduce', number: 91 },
        92: { name: 'Closed, Not a Bug', number: 92 },
        93: { name: 'Closed, Not Verified by Filer', number: 93 },
        95: { name: 'Closed Vendor OS/Software/Framework Prob', number: 95 },
        96: { name: 'Closed As Duplicate', number: 96 }
    }

    result.Severity =
    {
        1: { name: 'Complete Loss of Service', number: '1', filterTitle: 'Sev-1', filterVisible: true },
        2: { name: 'Severe', number: '2', filterTitle: 'Sev-2', filterVisible: true },
        3: { name: 'Minimal', number: '3', filterTitle: 'Sev-3', filterVisible: true },
        4: { name: 'Minor', number: '4', filterTitle: 'Sev-4', filterVisible: true }
    }

    result.Tag =
    {
        REGRN: { name: 'REGRN', filterTitle: 'REGRN', filterVisible: true },
        P1: { name: 'P1', filterTitle: 'P1', filterVisible: true },
        QABLK: { name: 'QABLK', filterTitle: 'QABLK', filterVisible: true },
        HCMBRONZE: { name: 'HCMBRONZE', filterTitle: 'HCMBRONZE', filterVisible: true },
        HCMSILVER: { name: 'HCMSILVER', filterTitle: 'HCMSILVER', filterVisible: true },
        'FRCE-SQL-CLEANUP': { name: 'FRCE-SQL-CLEANUP', filterTitle: 'FRCE-SQL-CLEANUP', filterVisible: true },
        VPAT_MUST: { name: 'VPAT_MUST', filterTitle: 'VPAT_MUST', filterVisible: true },
        CUSTOMER_IMPACT: { name: 'CUSTOMER_IMPACT', filterTitle: 'CUSTOMER_IMPACT' }
    }

    result.Fields = {
        DateReported: 'dateReported',
        Number: 'number',
        Assignee: 'assignee',
        Component: 'component',
        Severity: 'severity',
        Status: 'status',
        FixEta: 'fixEta',
        Subject: 'subject',
        Tags: 'tags',
        ProductNumber: 'productNumber',
        Customer: 'customer',
        //Selection: 'selection',
        //LineNumber: 'lineNumber',
        TestName: 'testName',
        SupportContact: 'supportContact'
    }

    const _fieldProperties = {
        number:
        {
            id: 'number',
            columnTitle: 'Number',
            columnSelector: 'Num',
            formater: 'BugDBNumber'
        },
        assignee:
        {
            id: 'assignee',
            columnTitle: 'Assignee',
            columnSelector: 'Assignee',
            filterTitle: 'Assignees',
            groupable: true,
            filterable: true
        },
        severity:
        {
            id: 'severity',
            columnTitle: 'Severity',
            columnSelector: 'Sev',
            lookup: result.Severity,
            //formater: 'BugDBSeverity',
            filterTitle: 'Severity',
            groupable: true,
            filterable: true
        },
        component:
        {
            id: 'component',
            columnTitle: 'Component',
            columnSelector: 'Component',
            filterTitle: 'Components',
            groupable: true,
            filterable: true
        },
        status:
        {
            id: 'status',
            columnTitle: 'Status',
            columnSelector: "$thead tr th:equalsi('Status'), thead tr th:equalsi('St')",
            filterTitle: 'Status',
            lookup: result.Statuses,
            formater: 'BugDBStatus',
            groupable: true,
            filterable: true
        },
        fixEta:
        {
            id: 'fixEta',
            columnTitle: 'Fix ETA',
            columnSelector: 'Fix Eta',
            formater: 'BugDBDate'
        },
        tags:
        {
            id: 'tags',
            columnTitle: 'Tags',
            columnSelector: "$thead tr th:equalsi('Tags'), thead tr th:equalsi('Tag')",
            lookup: result.Tag,
            formater: 'BugDBTags',
            filterTitle: 'Tags',
            filterable: true
        },
        customer: {
            id: 'customer',
            columnTitle: 'Customer',
            columnSelector: 'Customer',
            filterTitle: 'Customers',
            formater: 'BugDBCustomer',
            groupable: true
        },
        dateReported:
        {
            id: 'dateReported', columnTitle: 'Creation',
            columnSelector: "$thead tr th:equalsi('Date Reported'), thead tr th:equalsi('Reported Date')",
            formater: 'BugDBDate', groupable: false, filterable: false
        },
        subject: {
            id: 'subject',
            columnTitle: 'Subject',
            columnSelector: '=subject',
            formater: 'BugDBSubject'
        },
        selection: {
            id: 'selection',
            columnSelector: '#select_all_option'
        },
        lineNumber: {
            id: 'lineNumber',
            columnSelector: 'Sl No.'
        },
        productNumber: {
            id: 'productNumber',
            columnTitle: 'Product',
            columnSelector: '=Product ID',
            groupable: true
        },
        supportContact: {
            id: 'supportContact',
            columnTitle: 'Support Contact',
            columnSelector: 'Support Contact',
            groupable: true
        },
        testName: {
            id: 'testName',
            columnTitle: 'Test Name',
            columnSelector: 'Test Name/Doc Field',
            groupable: true
        }
    }

    result.FieldProperties = _fieldProperties;

    result.getFieldProperties = function (fieldName) {
        return _fieldProperties[fieldName];
    }

    result.UrlManager =
    {
        getBugEditUrl: function (bug) {
            return "https://bug.oraclecorp.com/pls/bug/webbug_edit.edit_info_top?rptno=" + bug.number;
        },

        getBugViewUrl: function (bug) {
            return "https://bug.oraclecorp.com/pls/bug/webbug_print.showbug?c_rptno=" + bug.number;
        },

        getSearchByTagUrl: function (tag, bug, productNumber) {
            if (!Oracle.isEmptyOrWhiteSpaces(bug?.productNumber)) {
                productNumber = bug.productNumber;
            }
            else if (Oracle.isEmptyOrWhiteSpaces(productNumber)) {
                productNumber = "2421"; // ORC
            }
            const search_title = "Tag search results for Product ID: " + productNumber + " and Tag: " + tag;
            return "https://bug.oraclecorp.com/pls/bug/WEBBUG_REPORTS.do_edit_report?cid_arr=2&cid_arr=3&cid_arr=9&cid_arr=8&cid_arr=7&cid_arr=11&cid_arr=13&cid_arr=72&c_count=8&query_type=2&fid_arr=1&fcont_arr=" + productNumber + "&fid_arr=125&fcont_arr=" + tag + "&f_count=2&rpt_title=" + search_title + "'";
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Bug
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Bug = class {

        constructor(data) {
            if (!Oracle.isEmpty(data)) {
                for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                    this[value] = data[value];
                }
            }
        }

        isLate() {
            let isLate = false;
            if (!Oracle.isEmpty(this.fixEta)) {
                isLate = this.fixEta < new Date(new Date().toDateString());
            }
            return isLate;
        }

        isBackport() {
            let isBackport = false;
            if (Oracle.includes(this.tags, 'CUSTOMER_IMPACT')) {
                isBackport = true;
            }
            return isBackport;
        }

        match(keyword) {
            if (keyword) {
                keyword = keyword.removeAccentsAndDiacritics().toLowerCase().trim();
                let result =
                    this.subject?.removeAccentsAndDiacritics().toLowerCase().indexOf(keyword) > -1
                    || this.customer?.removeAccentsAndDiacritics().toLowerCase().indexOf(keyword) > -1
                    || this.component?.removeAccentsAndDiacritics().toLowerCase().indexOf(keyword) > -1;
                if (!result && this.assignee) {
                    result = this.assignee.match(keyword);
                }
                if (!result) {
                    // here we will add tags search too, etc
                }
                return result;
            }
            else {
                return false;
            }
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugSummary
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugSummary = class {

        constructor(bugs, visiblebugs) {
            this.data = {};
            this.build(bugs, visiblebugs);
        }

        build(bugs, visiblebugs) {
            // Contruire la liste des champs
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                this.computeFieldSummary(bugs, visiblebugs, value);
            }
        }

        computeFieldSummary(bugs, visiblebugs, fieldName) {
            const result = {
                minimum: null,
                maximum: null,
                visibleMinimum: null,
                visibleMaximum: null,
                distinct: [],
                visibleDistinct: [],
                metrics: []
            };

            visiblebugs = visiblebugs ? visiblebugs : bugs;
            let sortedValues = [];
            for (let i = 0; i < bugs.length; i++) {
                const value = bugs[i][fieldName];
                if (!Oracle.isEmpty(value)) {
                    sortedValues.pushRange(value);
                }
            }
            let visibleSortedValues = [];
            for (let i = 0; i < visiblebugs.length; i++) {
                const value = visiblebugs[i][fieldName];
                if (!Oracle.isEmpty(value)) {
                    visibleSortedValues.pushRange(value);
                }
            }

            sortedValues = sortedValues.sort((a, b) => {
                return Oracle.compare(a, b);
            });
            result.minimum = sortedValues[0];
            result.maximum = sortedValues[sortedValues.length - 1];

            visibleSortedValues = visibleSortedValues.sort((a, b) => {
                return Oracle.compare(a, b);
            });
            result.visibleMinimum = visibleSortedValues[0];
            result.visibleMaximum = visibleSortedValues[visibleSortedValues.length - 1];

            const lookup = _fieldProperties[fieldName].lookup;
            if (!Oracle.isEmpty(lookup)) {
                for (const value in lookup) {
                    let numberValue = Oracle.Conversion.tryToNumber(value);
                    let hasValue = Oracle.includes(visibleSortedValues, numberValue.success ? numberValue.value : value);
                    if (lookup[value].filterVisible || hasValue) {
                        result.distinct.push(value);
                    }
                }
            }
            else {
                result.distinct = sortedValues.distinct();
            }

            //metrics
            for (let i = 0; i < result.distinct.length; i++) {
                const value = result.distinct[i];
                let count = 0;
                for (let j = 0; j < sortedValues.length; j++) {
                    if (Oracle.compare(value, sortedValues[j]) === 0) {
                        count++;
                    }
                }
                let visibleCount = 0;
                for (let j = 0; j < visibleSortedValues.length; j++) {
                    if (Oracle.compare(value, visibleSortedValues[j]) === 0) {
                        visibleCount++;
                    }
                }
                result.metrics.push({ value: value, count: count, visibleCount: visibleCount });
            }
            this.data[fieldName] = result;
        }

        getFieldSummary(fieldName) {
            return this.data[fieldName];
        }

        getVisibleMinimum(fieldName) {
            return this.getFieldSummary(fieldName)?.visibleMinimum;
        }

        getVisibleMaximum(fieldName) {
            return this.getFieldSummary(fieldName)?.visibleMaximum;
        }


        getMinimum(fieldName) {
            return this.getFieldSummary(fieldName)?.minimum;
        }

        getMaximum(fieldName) {
            return this.getFieldSummary(fieldName)?.maximum;
        }

        getDistinctMetrics(fieldName) {
            return this.getFieldSummary(fieldName)?.metrics;
        }

        getDistincts(fieldName) {
            return this.getFieldSummary(fieldName)?.distinct;
        }
    };

    const _setBugValue = function (bug, field, value, defaultValue) {
        if (value === null || value === undefined) {
            bug[field] = defaultValue;
        }
        else {
            bug[field] = value;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTable
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTable = class {

        constructor(table, target) {
            if (Oracle.isEmpty(table)) table = "#SummaryTab";
            if (Oracle.isEmpty(target)) {
                this.element = $(table);
            }
            else {
                this.element = $(target).find(table);
            }
            if (this.element.length === 0) {
                throw new Oracle.Errors.ValidationError("BugDB table does not exists", table);
            }
            if (!this.element.hasClass("summary")) {
                Oracle.Logger.logWarning("BudDB element does not have 'summary' class", this.element);
            }
            this.initializeIndexes();
            this.initializeRows();
        }

        initializeIndexes() {
            this.indexes = {};
            const fields = [];
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                let columnSelector = _fieldProperties[value]?.columnSelector;
                if (!Oracle.isEmpty(columnSelector)) {
                    if (columnSelector.startsWith("$")) {
                        columnSelector = columnSelector.substring(1);
                    }
                    else if (columnSelector.startsWith("=")) {
                        columnSelector = "thead tr th:equalsi('" + columnSelector.substring(1) + "')"
                    }
                    else {
                        columnSelector = "thead tr th:containsi('" + columnSelector + "')"
                    }
                    const col = this.element.find(columnSelector);
                    if (Oracle.isEmpty(col)) {
                        this.indexes[value] - 1;
                    }
                    else {
                        this.indexes[value] = col.index();
                    }
                }
                else {
                    this.indexes[value] - 1;
                }
                if (this.indexes[value] > -1) {
                    fields.push({ name: value, index: this.indexes[value] });
                }

            }
            fields.sort((a, b) => Oracle.compare(a.index, b.index));
            this.fields = [];
            for (let i = 0; i < fields.length; i++) {
                this.fields.push(fields[i].name);
            }
            Oracle.Logger.logDebug("BugDBTable: Indexes initialized", { indexes: this.indexes, fields: this.fields });
        }

        initializeRows() {
            this.rows = [];
            this.bugs = [];
            const rows = this.element.find("tbody tr");
            for (let i = 0; i < rows.length; i++) {
                const rowElement = $(rows.get(i));
                const row = new Oracle.BugDB.BugTableRow(this, rowElement);
                this.rows.push(row);
                for (const [key, value] of Object.entries(this.indexes)) {
                    if (value > -1) {
                        row.cells[key] = rowElement.find("td:eq(" + value + ")");
                    }
                    else {
                        row.cells[key] = null;
                    }
                }
                const bug = new Oracle.BugDB.Bug();
                // I always assume the Number column is present... If not, da fuck you want to do with that list... Just saying
                const number = row.getAsLink(Oracle.BugDB.Fields.Number);
                if (number) {
                    bug[Oracle.BugDB.Fields.Number] = Number(number.text);
                }
                bug[Oracle.BugDB.Fields.SupportContact] = row.getAsUser(Oracle.BugDB.Fields.SupportContact);
                bug[Oracle.BugDB.Fields.Assignee] = row.getAsUser(Oracle.BugDB.Fields.Assignee);
                bug[Oracle.BugDB.Fields.Status] = row.getAsNumber(Oracle.BugDB.Fields.Status);
                bug[Oracle.BugDB.Fields.Severity] = row.getAsNumber(Oracle.BugDB.Fields.Severity);
                bug[Oracle.BugDB.Fields.Subject] = row.getAsString(Oracle.BugDB.Fields.Subject);
                bug[Oracle.BugDB.Fields.Customer] = row.getAsString(Oracle.BugDB.Fields.Customer);
                bug[Oracle.BugDB.Fields.TestName] = row.getAsTest(Oracle.BugDB.Fields.TestName);
                if (!Oracle.isEmpty(bug[Oracle.BugDB.Fields.Customer])
                    && bug[Oracle.BugDB.Fields.Customer].startsWith("INTERNAL")) {
                    bug[Oracle.BugDB.Fields.Customer] = null;
                }
                bug[Oracle.BugDB.Fields.Tags] = row.getAsTags(Oracle.BugDB.Fields.Tags);
                bug[Oracle.BugDB.Fields.Component] = row.getAsString(Oracle.BugDB.Fields.Component);
                bug[Oracle.BugDB.Fields.FixEta] = row.getAsDateTime(Oracle.BugDB.Fields.FixEta);
                bug[Oracle.BugDB.Fields.DateReported] = row.getAsDateTime(Oracle.BugDB.Fields.DateReported);
                this.bugs.push(bug);
                row.bug = bug;
            }
            Oracle.Logger.logDebug("BugDBTable: Rows initialized", { rows: this.rows, bugs: this.bugs });
        }

        getBugByIndex(index) {
            return this.bugs[index];
        }

        hideColumnByIndex(index) {
            this.element.find("thead tr th:eq(" + index + ")").hide();
            for (let i = 0; i < this.rows.length; i++) {
                this.rows[i].element.find("td:eq(" + index + ")").hide();
            }
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTableRow
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTableRow = class {

        constructor(table, element) {
            this.table = table;
            this.element = element;
            this.cells = {};
        }

        getAsTags(fieldName) {
            let result = [];
            const cell = this.cells[fieldName];
            if (cell) {
                const value = cell.text();
                if (!Oracle.isEmptyOrWhiteSpaces(value)) {
                    const result = [];
                    // depending of the type of bugdb report, the tags can be 
                    // rendered as separate links or one space-separated text
                    const lineParsed = value.split('\n');
                    lineParsed.forEach(element => {
                        if (!Oracle.isEmptyOrWhiteSpaces(element)) {
                            const spaceParsed = element.split(' ');
                            spaceParsed.forEach(element => {
                                if (!Oracle.isEmptyOrWhiteSpaces(element)) {
                                    result.push(element);
                                }
                            });
                        }
                    });
                    return result;
                }
            }
            return result;
        }

        getAsTest(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                let value = cell.text();
                value = Oracle.Strings.trim(value);
                if (!Oracle.isEmptyOrWhiteSpaces(value)) {
                    const result = { name: null, jiraId: null };
                    if (value.startsWith("FRCE")) {
                        const tokens = value.split('-', 2);
                        result.jiraId = tokens[0];
                        if (tokens.length > 0) {
                            result.name = tokens[1];
                        }
                    }
                    return result;
                }
            }
            return null;
        }

        getAsUser(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                let globalId = null;
                let emailAddress = null;
                const a = cell.find('a');
                if (a.length > 0) {
                    emailAddress = a.attr('title');
                    if (!Oracle.isEmpty(emailAddress) && emailAddress.length > 16) {
                        emailAddress = emailAddress.substring(16);
                    }
                    else {
                        emailAddress = null;
                    }
                    globalId = Oracle.Strings.trim(a.text());
                }
                else {
                    globalId = Oracle.Strings.trim(cell.text());
                }
                return Oracle.Users.getOrCreateUser({ globalId: globalId, emailAddress: emailAddress });
            }
            else {
                return null;
            }
        }

        getAsLink(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                const a = cell.find('a');
                if (a.length > 0) {
                    return {
                        link: a.attr('href'),
                        text: a.text()
                    };
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }

        getAsNumber(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                return Number(cell.text());
            }
            else {
                return 0;
            }
        }

        getAsString(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                return cell.text();
            }
            else {
                return null;
            }
        }

        getAsDateTime(fieldName) {
            const cell = this.cells[fieldName];
            if (cell) {
                const text = cell.text();
                if (!Oracle.isEmptyOrWhiteSpaces(text)) {
                    const date = new Date(text);
                    if (date.isValid()) {
                        return date;
                    }
                }
            }
            return null;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTablePage
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTablePage = class {

        constructor() {
            this.element = $("<div id='bugDbPage' bgcolor='white' >");
            this.element.append($('body').children());
            $('body').append(this.element);
            $('body').removeAttr('bgcolor');
            $('body').removeAttr('onload');
            this.table = new Oracle.BugDB.BugTable(null, this.element);
            this.bugs = this.table.bugs;
            this.fields = this.table.fields;
            this.title = this.element.children('h2').text();
            this.settingsPath = Oracle.BugDB.generateSettingsPathForBugDbReportUrl();
        }

        hide() {
            this.element.hide();
        }
    };

    result.generateSettingsPathForBugDbReportUrl = function (url) {
        if (!Oracle.isString(url)) {
            url = window.location.href;
        }
        let result = "";
        url = url.toLowerCase();
        if (url.indexOf('select_stmt') > -1) {
            result = "BUGDBRPT-S";
            const selectStatement = Oracle.Http.getQueryStringValue("select_stmt", url);
            const whereStatement = Oracle.Http.getQueryStringValue("where_stmt", url);
            const orderStatement = Oracle.Http.getQueryStringValue("order_stmt", url);
            // LD: then the columns, let's see what to do with that later but I do not think we need to do anything about it:
            // &tot_cols=11&col_head=Assignee&col_head=Support%20Contact&col_head=Severity&col_head=Status&col_head=Fix%20ETA&col_head=Fixed%20Date&col_head=Subject&col_head=Component&col_head=Date%20Reported&col_head=Tag&col_head=Customer"
            if (selectStatement !== null) {
                result += "-S" + selectStatement.getHashCode();
            }
            if (whereStatement !== null) {
                result += "-W" + whereStatement.getHashCode();
            }
            if (orderStatement !== null) {
                result += "-O" + orderStatement.getHashCode();
            }
        }
        else if (url.indexOf('query_type') > -1) {
            result = "BUGDBRPT-Q-";
            const fcont_arr = Oracle.Http.getQueryStringValue("fcont_arr", url);
            if (fcont_arr !== null) {
                result += "-C" + fcont_arr.getHashCode();
            }
        }
        else {
            const index = url.indexOf("?");
            if (index > -1) {
                url = url.substring(0, index);
            }
            result = "BUGDBRPT-C-" + url.getHashCode();
        }
        return Oracle.Settings.normalizePath(result);
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Formaters
    // ---------------------------------------------------------------------------------------------------------------- //

    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr td.column-subject { font-size:90%  }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr td.column-tags { font-size:80%  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-date {  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-date .day { color: var(--controlTextColorLighten1); }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-date .month { font-weight:600; padding-right:4px; padding-left:4px;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-date .year { color: var(--controlTextColorLighten1); }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-customer { font-size:80%; }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-severity { white-space:nowrap; }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-severity .bugdb-severity-number { color: var(--controlTextColorLighten4); font-size:80%;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-severity.severity-1, .bugdb-severity.severity-2 { font-weight:600;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-severity.severity-4 { color: var(--controlTextColorLighten4);  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-status { white-space:nowrap;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-status .bugdb-status-number { color: var(--controlTextColorLighten4); font-size:80%;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-number { white-space: nowrap; }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-number-action { padding-left:4px}');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags { }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag { color: var(--controlTextColor); background-color:var(--controlBackgroundColorDarken1); border: 1px solid var(--controlBorderColor); border-radius:4px; padding:2px; white-space:nowrap; display:inline-block; margin:1px; }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-p1 {  color: var(--errorTextColor); background-color: var(--errorBackgroundColor) }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-p2 {  color: var(--warningTextColor); background-color: var(--warningBackgroundColor) }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-hcmbronze { color: var(--warningTextColor); background-color: var(--warningBackgroundColor) }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-hcmsilver { color: var(--errorTextColor); background-color: var(--errorBackgroundColor) }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-regrn {  color: var(--warningTextColor); background-color: var(--warningBackgroundColor) }');
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-tags .bugdb-tag-frce-sql-cleanup {  color: var(--infoTextColor); background-color: var(--infoBackgroundColor) }');

    Oracle.Formating.addFormater('BugDBDate', null, null, (value, settings) => {
        if (value instanceof Date && value.isValid()) {
            const dateDay = value.getDate(), month = value.getMonth(), year = value.getFullYear();
            return $(`<span class='bugdb-date'><span class='day'>${String(dateDay).padStart(2, '0')}</span><span class='month'>${Oracle.Dates.getMonthAbbreviation(month).toUpperCase()}</span><span class='year'>${year}</span></span>`);
        }
        else {
            return null;
        }
    });

    Oracle.HTML.addFormater("BugDBCustomer", null, null, (value, settings) => {
        if (settings.isHeader) {
            if (Oracle.isEmpty(value)) {
                return "Internal"
            }
            else {
                return value;
            }
        }
        else {
            if (value) {
                const result = $("<span class='bugdb-customer'>" + value + "</span>");
                return result;
            }
            else {
                return null;
            }
        }
    });

    Oracle.HTML.addFormater("BugDBSeverity", null, null, (value, settings) => {
        if (value) {
            const result = $("<span class='bugdb-severity severity-" + value + "'>" + value + "</span>");
            if (Oracle.BugDB.Severity.hasOwnProperty(value)) {
                if (settings.isHeader !== true) {
                    result.html(Oracle.BugDB.Severity[value].name + " <span class='bugdb-severity-number'>(" + Oracle.BugDB.Severity[value].number + ")<span>")
                }
                else {
                    result.html(Oracle.BugDB.Severity[value].name + " (" + Oracle.BugDB.Severity[value].number + ")")
                }
            }
            return result;
        }
        else {
            return null;
        }
    });

    Oracle.HTML.addFormater("BugDBStatus", null, null, (value, settings) => {
        if (value) {
            const result = $("<span class='bugdb-status status-" + value + "'>" + value + "</span>");
            if (Oracle.BugDB.Statuses.hasOwnProperty(value)) {
                if (settings.isHeader !== true) {
                    result.html(Oracle.BugDB.Statuses[value].name + " <span class='bugdb-status-number'>(" + Oracle.BugDB.Statuses[value].number + ")<span>")
                }
                else {
                    result.html(Oracle.BugDB.Statuses[value].name + " (" + Oracle.BugDB.Statuses[value].number + ")")
                }
            }
            return result;
        }
        else {
            return null;
        }
    });
    const _userHtmlFormater = function (value, settings) {
        if (value) {
            return "<a class='bugdb-number' href='" + Oracle.BugDB.UrlManager.getBugViewUrl(settings.entity) + "' target='_view_" + value + "'>" + value + "</a>";
        }
        else {
            return null;
        }
    };

    Oracle.HTML.addFormater("BugDBNumber", null, null, _userHtmlFormater, 'html');
    Oracle.Formating.addFormater("BugDBNumber", null, null, (value, settings) => {
        if (value) {
            const result = $("<span style='white-space: nowrap; display: flex; justify-content: center; align-items: center; '>");
            result.append(_userHtmlFormater(value, settings));
            result.append("<a class='bugdb-number-action' href='" + Oracle.BugDB.UrlManager.getBugEditUrl(settings.entity) + "'  target='_edit_" + value + "'><img src='https://zooktel.blob.core.windows.net/oracle/icons/edit.png' alt='Edit bug' /></a>");
            return result;
        }
        else {
            return null;
        }
    }, 'controls.grids');

    Oracle.HTML.addFormater('BugDBTags', null, null, (value, settings) => {
        const result = $("<div class='bugdb-tags'/>")
        if (!Oracle.isEmpty(value) && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                result.append("<a href='" + Oracle.BugDB.UrlManager.getSearchByTagUrl(value[i], settings.entity) + "'><div class='bugdb-tag bugdb-tag-" + value[i].toLowerCase() + "' >" + value[i] + "</div></a> ");
            }
        }
        return result;
    });

    Oracle.HTML.addFormater('BugDBSubject', null, null, (value, settings) => {
        const result = $("<div class='bugdb-subject'/>")
        if (!Oracle.isEmpty(value) && value.length > 0) {
            var subjectContent = value.split(" ");
            for (let i = 0; i < subjectContent.length; i++) {
                result.append(" ");
                if (subjectContent[i].length > 45) {
                    const longWord = $("<span title='" + subjectContent[i] + "' />");
                    longWord.append("..").append(subjectContent[i].substring(subjectContent[i].length - 35, subjectContent[i].length));
                    result.append(longWord);
                } else {
                    result.append(subjectContent[i]);
                }
            }
        }
        return result;

    });


    return parent;
}(Oracle));
