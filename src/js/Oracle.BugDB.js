'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};

    const result = parent.BugDB;

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

    parent.BugDB.Statuses = 
    {
        11: 'Open'
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
        SupportContact: 'supportContact'
    }

    const _fieldLookups = {
        number: 'Bug Number',
        assignee: 'Assignee',
        severity: 'Severity',
        component: 'Component',
        status: 'Status',
        fixEta: 'Fix Eta',
        tags: 'Tag',
        customer: 'Customer',
        dateReported: 'Date Reported',
        subject: 'Subject',
        selection: '#select_all_option',
        lineNumber: 'Sl No.',
        supportContact: 'Support Contact'
    }

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
        }

        initializeIndexes()
        {
            this.indexes = {};
            this.fields = [];
            for (const [key, value] of Object.entries(Oracle.BugDB.Fields)) {
                const lookup = _fieldLookups[value];
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
                if(bug[Oracle.BugDB.Fields.Customer].startsWith("INTERNAL"))
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
                    const parsed = value.split(' ');
                    parsed.forEach(element => {
                        if(!Oracle.isEmptyOrWhiteSpaces(element))
                        {
                            result.push(element);
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
 
    Oracle.HTML.addStyle('table.oracle.control.grid tbody tr td.column-subject { font-size:90%  }');
    Oracle.HTML.addStyle('table.oracle.control.grid tbody tr td.column-tags { font-size:80%  }');

    Oracle.HTML.addStyle('.bugdb-date {  }');
    Oracle.HTML.addStyle('.bugdb-date .day { color:#333 }');
    Oracle.HTML.addStyle('.bugdb-date .month { font-weight:600; padding-right:4px; padding-left:4px;  }');
    Oracle.HTML.addStyle('.bugdb-date .year { color:#333 }');
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

    Oracle.HTML.addStyle('.bugdb-customer { font-size:80%; }');
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

    Oracle.HTML.addStyle('.bugdb-severity {  }');
    Oracle.HTML.addStyle('.bugdb-severity.severity-2 { font-weight:600;  }');
    Oracle.HTML.addStyle('.bugdb-severity.severity-4 { color:#333;  }');
    Oracle.HTML.addFormater("BugDBSeverity", null, null, (value, settings) =>
    {
        if (value) {
            return $(`<span class='bugdb-severity severity-${value}'>${value}</span>`);
        }
        else {
            return null;
        }
    });

    Oracle.HTML.addStyle('.bugdb-status { white-space:nowrap;  }');
    Oracle.HTML.addStyle('.bugdb-status .bugdb-status-number { color:#999; font-size:80%;  }');
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

    Oracle.HTML.addStyle('.bugdb-number { white-space: nowrap; }');
    Oracle.HTML.addStyle('.bugdb-number-action { padding-left:4px}');
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

    Oracle.HTML.addStyle('.bugdb-status { white-space:nowrap;  }');
    Oracle.HTML.addStyle('.bugdb-status .bugdb-status-number { color:#999; font-size:80%;  }');
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

    Oracle.HTML.addStyle('.bugdb-tags { }');
    Oracle.HTML.addStyle('.bugdb-tags .bugdb-tag { background-color:#FAFAFA; border: 1px solid #AAA; border-radius:4px; padding:1px; white-space:nowrap; display:inline-block; margin:1px; }');
    Oracle.HTML.addStyle('.bugdb-tags .bugdb-tag-hcmbronze { background-color:#FFDDDD; }');
    Oracle.HTML.addStyle('.bugdb-tags .bugdb-tag-p1 { background-color:#FFDDDD; }');

    Oracle.HTML.addFormater('BugDBTags', null, null, (value, settings) => { 
        const result = $("<div class='bugdb-tags'>")
        if(!Oracle.isEmpty(value) && value.length > 0)
        {
            for(let i = 0; i < value.length; i++)            
            {
                result.append("<div class='bugdb-tag bugdb-tag-" +  value[i].toLowerCase() + "' >" + value[i] + "</div> ");
            }
        }
        return result;
     });


    // <a href='" + context.bug.getViewLink() + "' target='_blank'>
    return parent;
}(Oracle));
