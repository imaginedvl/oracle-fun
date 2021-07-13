'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('table.bugdbFilterpanel { background-color: red; min-height: 200px; width:100%; }');
    
    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanel
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanel = class  extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'bugdbFilterpanel';
            controlSettings.elementType = 'table';
            super(controlSettings);
            // controlSettings.grid..
            if(Oracle.isEmpty(controlSettings.grid))
            {
                Oracle.Logger.logWarning("Target grid is not provided...");                
            }        
            //const initializationSettings = { grid: controlSettings.grid };    
            //this.initializeColumns(controlSettings, initializationSettings);
            //this.initializeData(controlSettings, initializationSettings);
            //this.element.text("Bug List Helper");
            //this.element.text("Reported from");
            //this.element.text("Assignees:")
            Oracle.Logger.logDebug("FilterPanel initialized: ");
        }

        initializeColumns(controlSettings, initializationSettings) {
            this.columns = [];
            this.columnsById = {};
            initializationSettings.columnIndex = 0;
            this.theadElement = $('<thead>');
            const tr = $('<tr>');
            if (!Oracle.isEmpty(controlSettings.columns)) {
                this.theadElement.append(tr);
                const column = new Oracle.BugDB.FilterPanel.FilterPanelColumn(initializationSettings);
                this.columns.push(column);
                if(!Oracle.isEmpty(column.id))
                {
                    this.columnsById[column.id] = column;
                }
            }
            //tr.attr("data-column-count", this.columns.length)
            this.element.append(this.theadElement);
        }

        populateRows()
        {
            let index = 0;
            this.tbodyElement.children().remove();
            for(let i = 0; i < this.rows.length; i++)
            {
                const row = this.rows[i];
                if(row.isHidden !== true)
                {
                    if(row.isNewGroup && this.sortColumn)
                    {
                        if(lastGroup !== null)
                        {
                            lastGroup.find("span.group-count").text(groupRowCount);
                        }
                        groupRowCount = 1;
                        lastGroup = row.createGroupRow(this.sortColumn);
                        this.tbodyElement.append(lastGroup)
                    }
                    else
                    {
                        groupRowCount++; 
                    }
                    row.update(i);
                    this.tbodyElement.append(row.element);
                    index++;
                }
                if(lastGroup !== null)
                {
                    lastGroup.find("span.group-count").text(groupRowCount);
                }
            }
            if(this.tbodyElement.children().length === 0)
            {
                this.tbodyElement.append(this.emptyRow);
            }
        }

        initializeData(controlSettings, initializationSettings) {
            initializationSettings.rowIndex = -1;
            this.tbodyElement = $('<tbody>');
            this.data = controlSettings.data;
            if(Oracle.isEmpty(controlSettings.data))
            {
                this.data = [];
            }
            this.rows = [];
            for(let i = 0; i < this.data.length; i++)
            {
                initializationSettings.data = this.data[i];
                initializationSettings.dataIndex = i;
                const row = new Oracle.BugDB.FilterPanel.FilterPanelRow(initializationSettings);
                this.rows.push(row);
            }
            this.element.append(this.tbodyElement);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanelColumn
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanelColumn = class {

        constructor(initializationSettings) {
            this.grid = initializationSettings.grid;
            this.index = initializationSettings.columnIndex;
            this.id = Oracle.toNullableValue(initializationSettings.columnDefinition.id);
            this.element = $("<th data-column-index='" + this.index + "' class='column-" + this.id  + "' >");
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanelRow
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanelRow = class {

        constructor(initializationSettings) {
            this.grid = initializationSettings.grid;
            this.cells = [];
            this.isNewGroup = false;
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
    }

    return parent;
}(Oracle));