'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};

    const result = parent.BugDB;
    
    parent.BugDB.Statuses = 
    {
        11: 'Open',
        15: 'Enhancement Request',
        30: 'More Info Requested',
        32: 'Not a Bug',
        33: 'Suspended',
        36: 'Duplicate Bug',
        37: 'Merged',
        39: 'Waiting For Codeline',
        40: 'Waiting',
        41: 'Base Bug fixed',
        71: 'Closed, data fix',
        72: 'Closed, data fix',
        78: 'Closed Environment Issue',
        80: 'Ready To Validate',
        84: 'Closed, not feasible to fix',
        90: 'Closed, Verified by Filer',
        91: 'Closed, Could Not Reproduce',
        92: 'Closed, Not a Bug',
        93: 'Closed, Not Verified by Filer',
        95: 'Closed Vendor OS/Software/Framework Prob',
        96: 'Closed As Duplicate'
    }

    parent.BugDB.Severity = 
    {
        1: 'Complete',
        2: 'Severe',
        3: 'Minimal',
        4: 'Minor'
    }

    parent.BugDB.Fields = {
        DateReported: 'dateReported',
        Number: 'number',
        Assignee: 'assignee',
        Component: 'component',
        Severity: 'severity',
        Status: 'status',
        FixEta: 'fixEta',
        Subject: 'subject',
        Tags: 'tags',
        Customer: 'customer',
        //Selection: 'selection',
        //LineNumber: 'lineNumber',
        TestName: 'testName',
        SupportContact: 'supportContact'
    }

    const _fieldProperties = {
        number: { headerTitle: 'Num', type: 'number', formater: 'BugDBNumber', groupable: false }, 
        assignee: { headerTitle: 'Assignee' }, 
        severity: { headerTitle: 'Sev' }, 
        component: { headerTitle: 'Component' }, 
        status: { headerTitle: 'St' }, 
        fixEta: { headerTitle: 'Fix Eta' }, 
        tags: { headerTitle: 'Tag' }, 
        customer: { headerTitle: 'Customer' }, 
        dateReported: { headerTitle: 'Reported' }, 
        subject: { headerTitle: 'Subject' }, 
        selection: { headerTitle: '#select_all_option' }, 
        lineNumber: { headerTitle: 'Sl No.' }, 
        supportContact: { headerTitle: 'Support Contact' },
        testName: { headerTitle: 'Test Name/Doc Field'}
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Bug
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Bug = class{

        constructor() {
        }

        getEditLink()
        {
            return "https://bug.oraclecorp.com/pls/bug/webbug_edit.edit_info_top?rptno=" + this.number;
        }

        getViewLink()
        {
            return "https://bug.oraclecorp.com/pls/bug/webbug_print.showbug?c_rptno=" + this.number;
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugSummary
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugSummary = class{

        constructor(bugs) {
            this.data = {};

            // Contruire la liste des champs
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) 
            { 
                this.computeFieldSummary(bugs, value);
            }
        }

        computeFieldSummary(bugs, fieldName)
        {
            const result = {
                minimum: null,
                maximum: null,
                distinct: {}
            };

            const newArray = bugs.sort((a,b) =>
            {
                return Oracle.compare(a[fieldName], b[fieldName]); 
            });
            result.minimum = newArray[0][fieldName];
            result.maximum = newArray[newArray.length-1][fieldName];
            newArray.forEach(el => {
                result.distinct[el[fieldName]] = (result.distinct[el[fieldName]] || 0) + 1;
            })

            this.data[fieldName] = result;
        }

        getFieldSummary(fieldName)
        {
            return this.data[fieldName];
        }

        getMinimum(fieldName)
        {
            return this.getFieldSummary(fieldName)?.minimum;
        }

        getMaximum(fieldName)
        {
            return this.getFieldSummary(fieldName)?.maximum;
        }

        getDistincts(fieldName)
        {
            return this.getFieldSummary(fieldName)?.distinct;
        }
    };

    const _setBugValue = function(bug, field, value, defaultValue)
    {
        if (value === null || value === undefined)
        {
            bug[field] = defaultValue;
        }
        else
        {
            bug[field] = value;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTable
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTable = class{

        constructor(table, target) {
            if(Oracle.isEmpty(table)) table = "#SummaryTab";
            if(Oracle.isEmpty(target))
            {
                this.element = $(table);
            }
            else{
                this.element = $(target).find(table);
            }
            if(this.element.length === 0)
            {
                throw new Oracle.Errors.ValidationError("BugDB table does not exists", table);
            }
            if(!this.element.hasClass("summary"))
            {
                Oracle.Logger.logWarning("BudDB element does not have 'summary' class", this.element);
            }
            this.initializeIndexes();
            this.initializeRows();
            this.setMinMaxReportedDate();
        }

        initializeIndexes()
        {
            this.indexes = {};
            this.fields = [];
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                const lookup = _fieldProperties[value].headerTitle;
                if(!Oracle.isEmpty(lookup))
                {
                    if(lookup.startsWith('#'))
                    {
                        this.indexes[value] = this.getColumnIndexByControlId(lookup.substring(1));
                    }
                    else
                    {
                        this.indexes[value] = this.getColumnIndexByTitle(lookup);
                    }
                }
                else
                {
                    this.indexes[value] = -1;
                }
                if(this.indexes[value] > -1)
                {
                    this.fields.push(value);
                }
            }
            Oracle.Logger.logDebug("BugDBTable: Indexes initialized", { indexes: this.indexes, fields : this.fields });
        }

        initializeRows()
        {
            this.rows = [];
            this.bugs = [];
            const rows = this.element.find("tbody tr");
            for(let i = 0; i < rows.length; i++)
            {
                const rowElement = $(rows.get(i));
                const row = new Oracle.BugDB.BugTableRow(this, rowElement);
                this.rows.push(row);
                for (const [key, value] of Object.entries(this.indexes)) {
                    if(value > -1)
                    {
                        row.cells[key] = rowElement.find("td:eq(" + value + ")");
                    }
                    else
                    {
                        row.cells[key] = null;
                    }
                }
                const bug = new Oracle.BugDB.Bug();
                // I always assume the Number column is present... If not, da fuck you want to do with that list... Just saying
                const number = row.getAsLink(Oracle.BugDB.Fields.Number);
                if(number)
                {
                    bug[Oracle.BugDB.Fields.Number] = Number(number.text);
                }
                bug[Oracle.BugDB.Fields.SupportContact] = row.getAsUser(Oracle.BugDB.Fields.SupportContact);
                bug[Oracle.BugDB.Fields.Assignee] = row.getAsUser(Oracle.BugDB.Fields.Assignee);
                bug[Oracle.BugDB.Fields.Status] = row.getAsNumber(Oracle.BugDB.Fields.Status);
                bug[Oracle.BugDB.Fields.Severity] = row.getAsNumber(Oracle.BugDB.Fields.Severity);
                bug[Oracle.BugDB.Fields.Subject] = row.getAsString(Oracle.BugDB.Fields.Subject);
                bug[Oracle.BugDB.Fields.Customer] = row.getAsString(Oracle.BugDB.Fields.Customer);
                if(!Oracle.isEmpty(bug[Oracle.BugDB.Fields.Customer]) 
                   && bug[Oracle.BugDB.Fields.Customer].startsWith("INTERNAL"))
                {
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

        getBugByIndex(index)
        {
            return this.bugs[index];
        }

        getColumnIndexByTitle(columnName)
        {
            const col = this.element.find("thead tr th:containsi('" + columnName + "')");
            if(Oracle.isEmpty(col))
            {
                return -1;
            }
            else
            {
                return col.index();
            }
        }

        getColumnIndexByControlId(controlId)
        {
            const col = this.element.find("thead tr th > #" + controlId);
            if(Oracle.isEmpty(col))
            {
                return -1;
            }
            else
            {
                return col.parent().index();
            }
        }

        hideColumnByIndex(index)
        {
            this.element.find("thead tr th:eq(" + index + ")").hide();
            for(let i = 0; i < this.rows.length; i++)
            {
                 this.rows[i].element.find("td:eq(" + index + ")").hide();
            }
        }

        setMinMaxReportedDate() {
            let minDateForRange = new Date();
            let maxDateForRange = new Date();
            for(let i = 0; i < this.bugs.length; i++)
            {
                let dateReported = this.bugs[i].dateReported;
                if(dateReported < minDateForRange){
                    minDateForRange = dateReported;           
                }
                if(dateReported > maxDateForRange){
                    maxDateForRange = dateReported;           
                }
            }
            this.minDateForRange = minDateForRange;
            this.maxDateForRange = maxDateForRange;
        }
    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTableRow
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTableRow = class{

        constructor(table, element)
        {
            this.table = table;
            this.element = element;
            this.cells = {};
        }

        getAsTags(fieldName)
        {
            let result = [];
            const cell = this.cells[fieldName];
            if(cell)
            {
                const value = cell.text();
                if(!Oracle.isEmptyOrWhiteSpaces(value))
                {
                    const result = [];
                    // depending of the type of bugdb report, the tags can be 
                    // rendered as separate links or one space-separated text
                    const lineParsed = value.split('\n');
                    lineParsed.forEach(element => {
                        if(!Oracle.isEmptyOrWhiteSpaces(element))
                        {
                            const spaceParsed = element.split(' ');
                            spaceParsed.forEach(element => {
                                if(!Oracle.isEmptyOrWhiteSpaces(element))
                                {
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

        getAsUser(fieldName)
        {
            const cell = this.cells[fieldName];
            if(cell)
            {
                let globalId = null;
                let emailAddress = null;
                const a = cell.find('a');
                if(a.length > 0)
                {
                    emailAddress = a.attr('title');
                    if(!Oracle.isEmpty(emailAddress) && emailAddress.length > 16)
                    {
                        emailAddress = emailAddress.substring(16);
                    }
                    else
                    {
                        emailAddress = null;
                    }
                    globalId = Oracle.Strings.trim(a.text());
                }
                else
                {
                    globalId = Oracle.Strings.trim(cell.text());
                }
                return Oracle.Users.getOrCreateUser( { globalId: globalId, emailAddress: emailAddress } );
            }
            else
            {
                return null;
            }
        }

        getAsLink(fieldName)
        {
            const cell = this.cells[fieldName];
            if(cell)
            {
                const a = cell.find('a');
                if(a.length > 0)
                {
                    return {
                        link: a.attr('href'),
                        text: a.text()
                    };
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        getAsNumber(fieldName)
        {
            const cell = this.cells[fieldName];
            if(cell)
            {
                return Number(cell.text());
            }
            else
            {
                return 0;
            }
        }

        getAsString(fieldName)
        {
            const cell = this.cells[fieldName];
            if(cell)
            {
                return cell.text();
            }
            else
            {
                return null;
            }
        }

        getAsDateTime(fieldName)
        {
            const cell = this.cells[fieldName];
            if(cell)
            {
                const text = cell.text();
                if(Oracle.isEmptyOrWhiteSpaces(text))
                {
                    return null;
                }
                else
                {
                    return new Date(text);
                }
            }
            else
            {
                return null;
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugTablePage
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugTablePage = class{

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

        hide()
        {
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
    Oracle.Controls.Themes.addStaticCSSRule('.bugdb-severity.severity-2 { font-weight:600;  }');
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
            else
            {
                return value;
            }
        }
        else{
            if (value) 
            {
                const result = $("<span class='bugdb-customer'>" + value + "</span>");
                return result;
            }
            else {
                return null;
            }
        }
    });

    Oracle.HTML.addFormater("BugDBSeverity", null, null, (value, settings) =>
    {
        if (value) {
            const result = $("<span class='bugdb-severity severity-" + value + "'>" + value + "</span>");
            if(Oracle.BugDB.Severity.hasOwnProperty(value)) {
                if(settings.isHeader !== true)
                {
                    result.html(Oracle.BugDB.Severity[value] + " <span class='bugdb-severity-number'>(" + value + ")<span>")
                }
                else {
                    result.html(Oracle.BugDB.Severity[value] + " (" + value + ")")
                }
            }
            return result;
        }
        else {
            return null;
        }
    });
 
    Oracle.HTML.addFormater("BugDBStatus", null, null, (value, settings) =>
    {
        if (value) {
            const result = $("<span class='bugdb-status status-" + value + "'>" + value + "</span>");
            if(Oracle.BugDB.Statuses.hasOwnProperty(value))
            {
                if(settings.isHeader !== true)
                {
                    result.html(Oracle.BugDB.Statuses[value] + " <span class='bugdb-status-number'>(" + value + ")<span>")
                }
                else{
                    result.html(Oracle.BugDB.Statuses[value] + " (" + value + ")")
                }
            }
            return result;
        }
        else {
            return null;
        }
    });
    const _userHtmlFormater = function(value, settings) 
    {
        if (value) {
            return "<a class='bugdb-number' href='" + settings.entity.getViewLink() + "' target='_view_" + value + "'>" + value + "</a>";
        }
        else {
            return null;
        }
    };

    Oracle.HTML.addFormater("BugDBNumber", null, null, _userHtmlFormater, 'html');
    Oracle.Formating.addFormater("BugDBNumber", null, null, (value, settings) =>
    {
        if (value) {
            const result = $("<span style='white-space: nowrap; display: flex; justify-content: center; align-items: center; '>");
            result.append(_userHtmlFormater(value, settings));
            result.append("<a class='bugdb-number-action' href='" + settings.entity.getEditLink() + "'  target='_edit_" + value + "'><img src='https://zooktel.blob.core.windows.net/oracle/icons/edit.png' alt='Edit bug' /></a>");
            //return $(&nbsp;");
            return result;
        }
        else {
            return null;
        }
    }, 'controls.grids');

    Oracle.HTML.addFormater("BugDBStatus", null, null, (value, settings) =>
    {
        if (value) {
            const result = $("<span class='bugdb-status status-" + value + "'>" + value + "</span>");
            if(Oracle.BugDB.Statuses.hasOwnProperty(value))
            {
                if(settings.isHeader !== true)
                {
                    result.html(Oracle.BugDB.Statuses[value] + " <span class='bugdb-status-number'>(" + value + ")<span>")
                }
                else{
                    result.html(Oracle.BugDB.Statuses[value] + " (" + value + ")")
                }
            }
            return result;
        }
        else {
            return null;
        }
    });

    Oracle.HTML.addFormater('BugDBTags', null, null, (value, settings) => { 
        const result = $("<div class='bugdb-tags'>")
        if(!Oracle.isEmpty(value) && value.length > 0)
        {
            for(let i = 0; i < value.length; i++)            
            {
                result.append("<a href='" + Oracle.BugDB.Search.getSearchByTagLink(value[i]) + "'><div class='bugdb-tag bugdb-tag-" +  value[i].toLowerCase() + "' >" + value[i] + "</div></a> ");
            }
        }
        result.append("</div>");
        return result;
     });


    // <a href='" + context.bug.getViewLink() + "' target='_blank'>
    return parent;
}(Oracle));
