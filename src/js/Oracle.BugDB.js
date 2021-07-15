'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};

    const result = parent.BugDB;

    result.Statuses =
    {
        11: { name: 'Open', number: 11 },
        15: { name: 'Enhancement Request', number: 15 },
        30: { name: 'More Info Requested', number: 30 },
        31: { name: 'Could Not Reproduce', number: 31 },
        32: { name: 'Not a Bug', number: 32 },
        33: { name: 'Suspended', number: 33 },
        36: { name: 'Duplicate Bug', number: 36 },
        37: { name: 'Merged', number: 37 },
        39: { name: 'Waiting For Codeline', number: 39 },
        40: { name: 'Waiting', number: 40 },
        41: { name: 'Base Bug fixed', number: 41 },
        71: { name: 'Closed, data fix', number: 71 },
        72: { name: 'Closed, data fix', number: 72 },
        78: { name: 'Closed Environment Issue', number: 78 },
        80: { name: 'Ready To Validate', number: 80 },
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
        1: { name: 'Complete Loss of Service', number: '1', filterTitle: 'Sev-1'},
        2: { name: 'Severe', number: '2', filterTitle: 'Sev-2'},
        3: { name: 'Minimal', number: '3', filterTitle: 'Sev-3'},
        4: { name: 'Minor', number: '4', filterTitle: 'Sev-4'}
    }

    result.Tag =
    {
       REGRN: { name: 'REGRN', filterTitle: 'REGRN'},
       P1: { name: 'P1', filterTitle: 'P1' },
       QABLK: { name: 'QABLK', filterTitle: 'QABLK' },
       HCMBRONZE: { name: 'HCMBRONZE', filterTitle: 'HCMBRONZE' },
       HCMSILVER: { name: 'HCMSILVER', filterTitle: 'HCMSILVER' },
       SQL_CLEANUP: { name: 'SQL_CLEANUP', filterTitle: 'SQL_CLEANUP' },
       VPAT_MUST: { name: 'VPAT_MUST', filterTitle: 'VPAT_MUST' },
       CLIENT_BUGS: { name: 'CLIENT_BUGS', filterTitle: 'CLIENT_BUGS' }
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
        number: { headerTitle: 'Num', title: 'Number', sectionTitle: 'Numbers',  type: 'number', formater: 'BugDBNumber', groupable: false }, 
        assignee: { headerTitle: 'Assignee', filterId:'assignees', filterTitle: 'Assignees' }, 
        severity: { headerTitle: 'Sev', lookup: result.Severity, formater: 'BugDBSeverity', filterId:'severity', filterTitle: 'Severity' }, 
        component: { headerTitle: 'Component', filterId:'components', filterTitle: 'Components'} , 
        status: { headerTitle: 'St', lookup: result.Status, formater: 'BugDBStatus' }, 
        fixEta: { headerTitle: 'Fix Eta', formater: 'BugDBDate' }, 
        tags: { headerTitle: 'Tag', lookup: result.Tag, formater: 'BugDBTag', filterId:'tags', filterTitle: 'Tags' }, 
        customer: { headerTitle: 'Customer', filterId:'customer', filterTitle: 'Customers' }, 
        dateReported: { headerTitle: 'Reported' }, 
        subject: { headerTitle: 'Subject' }, 
        selection: { headerTitle: '#select_all_option' }, 
        lineNumber: { headerTitle: 'Sl No.' }, 
        productNumber: { headerTitle: 'Product ID'},
        supportContact: { headerTitle: 'Support Contact' },
        testName: { headerTitle: 'Test Name/Doc Field' }
    }

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

        match(keyword) {
            if(keyword)
            {
                keyword = keyword.toLowerCase();
                const result = this.subject?.toLowerCase().indexOf(keyword) > -1
                    || this.customer?.toLowerCase().indexOf(keyword) > -1
                    || this.component?.toLowerCase().indexOf(keyword) > -1
                    || this.assignee?.displayName.toLowerCase().indexOf(keyword) > -1;
                if (!result) // her we will add tags search too, etc
                {

                }
                return result;
            }
            else{
                return false;
            }
        }

    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugSummary
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugSummary = class {

        constructor(bugs) {
            this.data = {};

            // Contruire la liste des champs
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                this.computeFieldSummary(bugs, value);
            }
        }

        computeFieldSummary(bugs, fieldName) {
            const result = {
                minimum: null,
                maximum: null,
                distinct: [],
                metrics: []
            };

            let sortedValues = [];
            for (let i = 0; i < bugs.length; i++) {
                const value = bugs[i][fieldName];
                if (!Oracle.isEmpty(value)) {
                    sortedValues.pushRange(value);
                }
            }
            
            sortedValues = sortedValues.sort((a, b) => {
                return Oracle.compare(a, b);
            });
            result.minimum = sortedValues[0];
            result.maximum = sortedValues[sortedValues.length - 1];
            
            const lookup = _fieldProperties[fieldName].lookup;
            if(!Oracle.isEmpty(lookup)) {
                for(const value in lookup)
                {
                    result.distinct.push(value);
                }
            }
            else {
                result.distinct = sortedValues.distinct();
            }
            
            for(let i = 0; i < result.distinct.length; i++)
            {
                const value = result.distinct[i];
                let count = 0;
                for (let j = 0; j < sortedValues.length; j++) {
                    if (Oracle.compare(value, sortedValues[j]) === 0) {
                        count++;
                    }
                }
                result.metrics.push({ value: value, count: count });
            }
            this.data[fieldName] = result;
        }

        getFieldSummary(fieldName) {
            return this.data[fieldName];
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
            this.fields = [];
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                const lookup = _fieldProperties[value].headerTitle;
                if (!Oracle.isEmpty(lookup)) {
                    if (lookup.startsWith('#')) {
                        this.indexes[value] = this.getColumnIndexByControlId(lookup.substring(1));
                    }
                    else {
                        this.indexes[value] = this.getColumnIndexByTitle(lookup);
                    }
                }
                else {
                    this.indexes[value] = -1;
                }
                if (this.indexes[value] > -1) {
                    this.fields.push(value);
                }
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

        getColumnIndexByTitle(columnName) {
            const col = this.element.find("thead tr th:containsi('" + columnName + "')");
            if (Oracle.isEmpty(col)) {
                return -1;
            }
            else {
                return col.index();
            }
        }

        getColumnIndexByControlId(controlId) {
            const col = this.element.find("thead tr th > #" + controlId);
            if (Oracle.isEmpty(col)) {
                return -1;
            }
            else {
                return col.parent().index();
            }
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
                if (Oracle.isEmptyOrWhiteSpaces(text)) {
                    return null;
                }
                else {
                    return new Date(text);
                }
            }
            else {
                return null;
            }
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
            this.title = this.element.children('h2').text();
        }

        hide() {
            this.element.hide();
        }

    };


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
        if (value) {
            const dateDay = value.getDate(), month = value.getMonth() + 1, year = value.getFullYear();
            return $(`<span class='bugdb-date'><span class='day'>${String(dateDay).padStart(2, '0')}</span><span class='month'>${Oracle.Dates.getMonthAbbreviation(month).toUpperCase()}</span><span class='year'>${year}</span></span>`);
        }
        else {
            return null;
        }
    });
    
    Oracle.HTML.addFormater("BugDBCustomer", null, null, (value, settings) =>
    {
        if(settings.isHeader)
        {
            if(Oracle.isEmpty(value))
            {
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
            if(Oracle.BugDB.Severity.hasOwnProperty(value)) {
                if(settings.isHeader !== true)
                {
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
            if(Oracle.BugDB.Statuses.hasOwnProperty(value))
            {
                if(settings.isHeader !== true)
                {
                    result.html(Oracle.BugDB.Statuses[value].name + " <span class='bugdb-status-number'>(" + Oracle.BugDB.Statuses[value].number + ")<span>")
                }
                else{
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
            //return $(&nbsp;");
            return result;
        }
        else {
            return null;
        }
    }, 'controls.grids');

    Oracle.HTML.addFormater('BugDBTags', null, null, (value, settings) => { 
        const result = $("<div class='bugdb-tags'>")
        if (!Oracle.isEmpty(value) && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                result.append("<a href='" + Oracle.BugDB.UrlManager.getSearchByTagUrl(value[i], settings.entity) + "'><div class='bugdb-tag bugdb-tag-" + value[i].toLowerCase() + "' >" + value[i] + "</div></a> ");
            }
        }
        result.append("</div>");
        return result;
    });

    // <a href='" + context.bug.getViewLink() + "' target='_blank'>
    return parent;
}(Oracle));
