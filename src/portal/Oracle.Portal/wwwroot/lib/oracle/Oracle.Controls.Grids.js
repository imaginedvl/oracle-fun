'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls.Tables
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    if (!parent.Controls.hasOwnProperty('Grids')) parent.Controls.Grids = {};
    const result = parent.Controls.Grids;
    const _formaterCollection = 'controls.grids';

    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid { border-collapse: collapse; width:100%; box-sizing: border-box; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th:last-child { border-right:1px solid rgba(0, 0, 0, 0); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th { box-sizing: border-box; user-select:none; background-color: var(--primaryBackgroundColor); color: var(--primaryTextColor); padding-top:8px; padding-bottom: 8px; padding-right: 8px; padding-left: 8px; font-weight: 500; font-size: 100%; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th.sortable { padding-right:30px; background-repeat: no-repeat; background-position:right center ; cursor:pointer; margin:0px;background-color: var(--primaryBackgroundColorLighten1); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th.sortable.sorted { background-color: var(--primaryBackgroundColor);background-image: url("https://zooktel.blob.core.windows.net/oracle/icons/sort_down.png"); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th.sortable.sorted.ascending { background-image: url("https://zooktel.blob.core.windows.net/oracle/icons/sort_up.png"); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid thead tr th.sortable:hover { color: var(--primaryTextColorLighten2); background-color: var(--primaryBackgroundColorLighten2); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr td { padding-top:8px; padding-bottom: 8px; padding-right: 8px; padding-left: 8px; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr:first-child td { border-top: none }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr td.sorted { background-color: var(--controlEmphasisBackgroundColor); }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.empty-row td{ padding:40px; text-align:center; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr td { border:1px solid var(--controlBorderColor); }');

    // Groups
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td {background-color: var(--primaryBackgroundColorLighten4); var(--primaryTextColorLighten4); padding-top:2px; padding-bottom:4px; text-align:left; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-title {}');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-title::after { content: ": " }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-value { font-weight:600; }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-count {  font-weight:200;}');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-count::before { content: " (" }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td span.group-count::after { content: ")" }');
    Oracle.Controls.Themes.addStaticCSSRule('table.oracle.control.grid tbody tr.group td { border: 1px solid var(--controlBorderColor); } ')

    // Events
    result.Events =
    {
        Reset: "Oracle.Controls.Grids.Reset",
        RowCountChanged: "Oracle.Controls.Grids.RowCountChange"
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Grid
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Grid = class extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'grid';
            controlSettings.elementType = 'table';
            super(controlSettings);
        }

        onInitialize(controlSettings, userSettings) {
            const initializationSettings = { grid: this };
            this.initializeColumns(controlSettings, initializationSettings);
            this.initializeData(controlSettings, initializationSettings);
            this.sortColumn = null;
            this.emptyRow = $("<tr class='empty-row'><td colspan='" + this.columns.length + "'></td></tr>");
            const emptyRowMessage = Oracle.toDefaultValue(controlSettings.noItemsMessage, "No data matching the criteria");
            this.emptyRow.find("td").text(emptyRowMessage);
            let sortColumnIndex = Oracle.Conversion.defaultToNumber(userSettings?.sortColumnIndex, -1);
            let sortAscending = Oracle.Conversion.defaultToBoolean(userSettings?.sortAscending, true);
            const sortColumn = this.columnsById[controlSettings?.sort?.column];
            if (!Oracle.isEmpty(sortColumn)) {
                this.sortColumnIndex = Oracle.Conversion.defaultToNumber(sortColumn.index, sortColumnIndex);
                this.sortAscending = Oracle.Conversion.defaultToBoolean(controlSettings?.sort?.descending, sortAscending);
            }
            this.sortByColumnIndex(sortColumnIndex, sortAscending);
        }

        sortByColumnIndex(index, ascending = true) {
            console.log({ index: index, ascending: ascending })
            if (index > -1) {
                const column = this.columns[index];
                let ascendingOrder = true;
                if (ascending !== null) {
                    ascendingOrder = ascending;
                }
                else {
                    if (column.isSorted()) {
                        if (column.sortIsAscending()) {
                            ascendingOrder = false;
                        }
                    }
                }
                this.sortColumn = column;
                column.setSort(ascendingOrder);
                this.rows.forEach(row => {
                    row.element.find("td.sorted").removeClass("sorted ascending descending");
                    const cell = row.element.find("td[data-column-index=" + index + "]");
                    if (ascendingOrder) {
                        cell.addClass("sorted ascending")
                    }
                    else {
                        cell.addClass("sorted descending")
                    }
                });
                this.rows.sort((a, b) => {
                    a = Oracle.getMemberValueByPath(a.data, column.path);
                    b = Oracle.getMemberValueByPath(b.data, column.path);
                    if (ascendingOrder) {
                        return Oracle.compare(a, b);
                    }
                    else {
                        return Oracle.compare(b, a);
                    }
                });
                // Then we look for groups, probably a better way to do that and maybe we can do the sort/group detection in one go, but it is late so :)
                // The grouping looks really cool.
                let a, b;
                for (let i = 0; i < this.rows.length; i++) {
                    const row = this.rows[i];
                    row.isNewGroup = false;
                    if (column.groupable === true) {
                        if (i == 0) {
                            row.isNewGroup = true;
                        }
                        else {
                            a = Oracle.getMemberValueByPath(this.rows[i - 1].data, column.path);
                            b = Oracle.getMemberValueByPath(this.rows[i].data, column.path);
                            if (Oracle.compare(a, b) !== 0) {
                                row.isNewGroup = true;
                            }
                        }
                    }
                }
            }
            else {
                this.sortColumn = null;
            }
            this.populateRows();
            this.saveUserSettings();
        }

        onBuildUserSettings(userSettings) {
            if (this.sortColumn !== null) {
                userSettings.sortColumnIndex = this.sortColumn.index;
                userSettings.sortAscending = this.sortColumn.sortIsAscending();

            }
            else {
                userSettings.sortColumnIndex = -1;
                userSettings.sortAscending = true;
            }
        }

        filter(selectPredicate) {
            for (let i = 0; i < this.rows.length; i++) {
                const row = this.rows[i];
                if (selectPredicate) {
                    row.isHidden = !selectPredicate({ grid: this, row: row, data: row.data, rowIndex: i });
                }
                else {
                    row.isHidden = false;
                }
            }
            this.populateRows();
        }

        getVisibleRowCount() {
            return 10;
        }

        initializeColumns(controlSettings, initializationSettings) {
            const _this = this;
            this.columns = [];
            this.columnsById = {};
            initializationSettings.columnIndex = -1;
            this.theadElement = $('<thead>');
            const tr = $('<tr>');
            if (!Oracle.isEmpty(controlSettings.columns)) {
                for (const [key, value] of Object.entries(controlSettings.columns)) {
                    initializationSettings.columnIndex++;
                    initializationSettings.columnDefinition = value;
                    this.theadElement.append(tr);
                    const column = new Oracle.Controls.Grids.GridColumn(initializationSettings);
                    tr.append(column.element);
                    this.columns.push(column);
                    if (!Oracle.isEmpty(column.id)) {
                        this.columnsById[column.id] = column;
                    }
                }
            }
            tr.attr("data-column-count", this.columns.length)
            tr.find("th.sortable").click((e) => {
                _this.sortByColumnIndex($(e.target).attr('data-column-index'));
            });
            this.element.append(this.theadElement);
        }

        populateRows() {
            let lastGroup = null;
            let groupRowCount = 0;
            let index = 0;
            this.tbodyElement.children().remove();
            for (let i = 0; i < this.rows.length; i++) {
                const row = this.rows[i];
                if (row.isHidden !== true) {
                    if (row.isNewGroup && this.sortColumn) {
                        if (lastGroup !== null) {
                            lastGroup.find("span.group-count").text(groupRowCount);
                        }
                        groupRowCount = 1;
                        lastGroup = row.createGroupRow(this.sortColumn);
                        this.tbodyElement.append(lastGroup)
                    }
                    else {
                        groupRowCount++;
                    }
                    row.update(i);
                    this.tbodyElement.append(row.element);
                    index++;
                }
                if (lastGroup !== null) {
                    lastGroup.find("span.group-count").text(groupRowCount);
                }
            }
            if (this.tbodyElement.children().length === 0) {
                this.tbodyElement.append(this.emptyRow);
            }
        }

        initializeData(controlSettings, initializationSettings) {
            initializationSettings.rowIndex = -1;
            this.tbodyElement = $('<tbody>');
            this.data = controlSettings.data;
            if (Oracle.isEmpty(controlSettings.data)) {
                this.data = [];
            }
            this.rows = [];
            for (let i = 0; i < this.data.length; i++) {
                initializationSettings.data = this.data[i];
                initializationSettings.dataIndex = i;
                const row = new Oracle.Controls.Grids.GridRow(initializationSettings);
                this.rows.push(row);
            }
            this.element.append(this.tbodyElement);
        }

        reset() {
            this.filter();
            this.triggerEvent(Oracle.Controls.Grids.Events.Reset);
        }

    };

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: GridColumn
    // ---------------------------------------------------------------------------------------------------------------- //
    result.GridColumn = class {

        constructor(initializationSettings) {
            this.grid = initializationSettings.grid;
            this.index = initializationSettings.columnIndex;
            this.path = Oracle.toNullableValue(initializationSettings.columnDefinition.path);
            this.id = Oracle.toNullableValue(initializationSettings.columnDefinition.id);
            this.columnTitle = Oracle.toNullableValue(initializationSettings.columnDefinition.columnTitle);
            this.formater = Oracle.toNullableValue(initializationSettings.columnDefinition.formater);
            this.groupable = Oracle.toDefaultValue(initializationSettings.columnDefinition.groupable, false);
            this.element = $("<th data-column-index='" + this.index + "' class='column-" + this.id + "' >");
            this.element.setContent(this.columnTitle);
            if (initializationSettings.columnDefinition.sortable !== false) {
                this.element.addClass("sortable");
            }
            if (this.path === null) {
                this.path = this.id;
            }
        }

        setSort(ascending = false) {
            if (this.element.hasClass("sortable")) {
                this.element.parent().find('th.sortable').removeClass("ascending").removeClass("descending").removeClass("sorted");
                if (ascending) {
                    this.element.addClass("sorted ascending");
                }
                else {
                    this.element.addClass("sorted descending");
                }
            }
        }

        isSorted() {
            return this.element.hasClass("sorted");
        }

        sortIsAscending() {
            return this.element.hasClass("ascending");
        }

    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: GridRow
    // ---------------------------------------------------------------------------------------------------------------- //
    result.GridRow = class {

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
                const td = $("<td data-column-index='" + c + "' class='column-" + column.id + "' >");
                let value = Oracle.getMemberValueByPath(this.data, column.path);
                value = Oracle.Formating.formatValue(value, { entity: this.data, element: td, formater: column.formater }, _formaterCollection);
                td.setContent(value);
                this.element.append(td);
            }
        }

        createGroupRow(sortColumn) {
            const tr = $("<tr class='group'></tr>");
            const td = $("<td colspan='" + this.grid.columns.length + "'></td>");
            const spanTitle = $("<span class='group-title'>");
            spanTitle.setContent(sortColumn.columnTitle);
            const spanValue = $("<span class='group-value'>");
            tr.append(td);
            td.append(spanTitle);
            td.append(spanValue);
            const spanCount = $("<span class='group-count'>");
            td.append(spanCount);
            let value = Oracle.getMemberValueByPath(this.data, sortColumn.path);
            value = Oracle.Formating.formatValue(value, { isHeader: true, entity: this.data, element: td, formater: sortColumn.formater }, _formaterCollection);
            spanValue.setContent(value);
            return tr;
        }

        update(rowIndex) {
            this.element.attr("data-row-index", rowIndex);
            this.element.attr("data-row-new-group", this.isNewGroup);
            if (this.isNewGroup) {
                this.element.addClass("new-group");
            }
            else {
                this.element.removeClass("new-group");
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Formaters
    // ---------------------------------------------------------------------------------------------------------------- //
    Oracle.Formating.addFormaterCollection(_formaterCollection, 'html');

    return parent;
}(Oracle));
