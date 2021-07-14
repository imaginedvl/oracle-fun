'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel { background-color: red; min-height: 200px; width:100%; }');
    
    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanel
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanel = class  extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'bugdbFilterpanel';
            controlSettings.elementType = 'div';
            super(controlSettings);
            // controlSettings.grid..
            if(Oracle.isEmpty(controlSettings.grid))
            {
                Oracle.Logger.logWarning("Target grid is not provided...");                
            }        

            /*
            this.summary = Oracle.BugDB.BugSummary(controlSettings.data);
            this.summary.getMaximum(Oracle.BugDB.Fields.DateReported);
            */


            this.sections = [];
            const initializationSettings = { grid: controlSettings.grid }; 
            
            initializationSettings.text = "Bug List Helper"  
            let section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);
            
            initializationSettings.text = "Reported from:" + controlSettings.data.maxDateForRange;
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);
            
            initializationSettings.text = "Severity:"  
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            initializationSettings.text = "Components:"  
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            initializationSettings.text = "Tags:"  
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            this.populateSections();
            Oracle.Logger.logDebug("FilterPanel initialized: ");
        }

        populateSections()
        {
            for(let i = 0; i < this.sections.length; i++)
            {
                const row = this.sections[i];
                this.element.append(row.element);
            }
            if(this.element.children().length === 0)
            {
                this.element.append(this.emptyRow);
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanelSection
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanelSection = class {

        constructor(initializationSettings) {
            this.grid = initializationSettings.grid;
            //this.cells = [];
            //this.data = initializationSettings.data;
            this.element = $("<div id='monkeyDivHeader' style='width:100%; font-size:12px; text-align:center;'><h3>" + initializationSettings.text + "</h3></div>");
            /*for (let c = 0; c < this.grid.columns.length; c++) {
                const column = this.grid.columns[c];
                initializationSettings.columnIndex = c;
                const td = $("<td data-column-index='" + c + "' class='column-" + column.id  + "' >");
                let value = Oracle.getMemberValueByPath(this.data, column.path);
                value = Oracle.Formating.formatValue(value, { entity: this.data, element: td, formater: column.formater },  _formaterCollection );
                td.setContent(value);
                this.element.append(td);
            }*/
        }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanelRow
    // ---------------------------------------------------------------------------------------------------------------- //
    /*result.FilterPanelRow = class {

        constructor(initializationSettings) {
            this.grid = initializationSettings.grid;
            this.cells = [];
            this.data = initializationSettings.data;
            this.dataIndex = initializationSettings.dataIndex;
            this.element = $("<tr data-row-index='" + this.index + "' data-index='" + this.dataIndex + "' >");
            for (let c = 0; c < this.grid.columns.length; c++) {
                const column = this.grid.columns[c];
                initializationSettings.columnIndex = c;
                const td = $("<td data-column-index='" + c + "' class='column-" + column.id  + "' >");
                let value = Oracle.getMemberValueByPath(this.data, column.path);
                value = Oracle.Formating.formatValue(value, { entity: this.data, element: td, formater: column.formater },  _formaterCollection );
                td.setContent(value);
                this.element.append(td);
            }
        }

        update(rowIndex)
        {
            this.element.attr("data-row-index", rowIndex);
            this.element.attr("data-row-new-group", this.isNewGroup);
            if(this.isNewGroup)
            {
                this.element.addClass("new-group");
            }
            else{
                this.element.removeClass("new-group");
            }
        }*/
    }

    return parent;
}(Oracle));