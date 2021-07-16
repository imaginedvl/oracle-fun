'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel { width:200px; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .main-title-panel { padding:8px; color: var(--primaryTextColor); background-color: var(--primaryBackgroundColorLighten1); font-weight: 600;  } ');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel > .section-panel { border-top: 1px solid var(--controlBorderColor);  border-left: 1px solid var(--controlBorderColor);  border-right: 1px solid var(--controlBorderColor); padding:8px;  }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel > .section-panel:last-child { border-bottom: 1px solid var(--controlBorderColor);   }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel > .section-header-panel { text-align:center; background-color: var(--primaryBackgroundColorLighten4); var(--primaryTextColorLighten4); font-weight: 600; }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-centered-panel { text-align: center }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .date-range-panel .from { color: var(--controlTextColorLighten3); padding-right:4px } ');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .date-range-panel .to  { color: var(--controlTextColorLighten3); padding-left:4px; padding-right:4px } ');


    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter-item {cursor: pointer;}');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter-item:not(:last-child)::after { color: var(--controlTextColorLighten3); content: ", "}');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter-item span.value { font-weight: 600; white-space: nowrap; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter-item span.count { padding-left:4px; color: var(--controlTextColorLighten3)}');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter-item * { pointer-events: none }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-search-panel input { width:100%; padding:8px; border: 1px solid var(--controlBorderColor); }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-search-panel input.searchKeyword {  height: 35px; padding-left: 10px; }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-reset-panel button { padding:4px; width:100%; border: 1px solid var(--controlBorderColor); cursor:pointer; color: var(--primaryTextColor); background-color: var(--primaryBackgroundColorLighten1);  }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-reset-panel button:hover { background-color: var(--primaryBackgroundColorLighten2); color: var(--primaryTextColorLighten2);  }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-reset-panel button:active { background-color: var(--primaryBackgroundColorLighten4); color: var(--primaryTextColorLighten4);  }');
    //

    result.PanelTypes =
    {
        Standard: { id: 'standard' },
        Search: { id: 'search', placeHolder: 'Refine search' },
        Summary: { id: 'summary' },
        Custom: { id: 'custom' },
        Reset: { id: 'reset', buttonText: 'Clear filters' }
    }

    result.CustomFilters =
    {
        IsCustomer: { panelTitle: 'Customer', panelfilter: 'Customer Bugs', filter: 'isNotEmpty' }
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanel
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanel = class extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'bugdbFilterPanel';
            controlSettings.elementType = 'div';
            super(controlSettings);
            if (Oracle.isEmpty(controlSettings.grid)) {
                Oracle.Logger.logWarning("Target grid is not provided...");
            }
            this.grid = controlSettings.grid;
            this.bugs = controlSettings.data;
            this.summary = new Oracle.BugDB.BugSummary(this.bugs);

            // Title
            const title = $("<div class='main-title-panel'>");
            title.text("Bug List Helper");
            this.element.append(title);

            // Panels
            if (!Oracle.isEmpty(controlSettings.panels)) {
                for (let i = 0; i < controlSettings.panels.length; i++) {
                    const panelSettings = controlSettings.panels[i];
                    if (Oracle.isString(panelSettings)) {
                        const properties = Oracle.BugDB.getFieldProperties(panelSettings);
                        const panelTitle = $("<div class='section-panel section-header-panel'>");
                        if (Oracle.isEmpty(properties.filterTitle)) {
                            panelTitle.text(properties.headerTitle);
                        }
                        else {
                            panelTitle.text(properties.filterTitle);
                        }
                        this.element.append(panelTitle);
                        const panel = $("<div class='section-panel'>");
                        this.initializeStandardFilterPanel(properties, panel);
                        this.element.append(panel);
                    }
                    else {
                        switch (panelSettings.type) {
                            case result.PanelTypes.Reset:
                                this.initializeResetFilterPanel(panelSettings);
                                break;
                            case result.PanelTypes.Search:
                                this.initializeSearchPanel(panelSettings);
                                break;
                            case result.PanelTypes.Summary:
                                this.initializeSummaryPanel();
                                break;
                            case result.PanelTypes.Custom:
                                this.initializeCustomPanel(panelSettings);
                                break;
                        }
                        // Custom filter
                    }
                }
            }
            Oracle.Logger.logDebug("FilterPanel initialized: " + this.id, { panel: this });
        }

        initializeSummaryPanel() {
            // Summary
            const dateRangePanel = $("<div class='section-panel section-centered-panel date-range-panel'>");
            dateRangePanel.append("<span class='from'>From</span>");
            dateRangePanel.append(Oracle.HTML.formatValue(this.summary.getMinimum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate' }));
            dateRangePanel.append("<span class='to'>to</span>");
            dateRangePanel.append(Oracle.HTML.formatValue(this.summary.getMaximum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate' }));
            this.element.append(dateRangePanel);
        }

        initializeSearchPanel(panelSettings) {
            // Search Panel
            const searchPanel = $("<div class='section-panel section-search-panel'>");
            const searchInputBox = $("<input type='text' placeholder='" + panelSettings['type'].placeHolder + "'>");
            searchInputBox.on("input", (e) => {
                const keyword = $(e.target).val();
                if (!Oracle.isEmptyOrWhiteSpaces(keyword)) {
                    this.grid.filter((settings) => {
                        let bug = settings.data;
                        return bug.match(keyword);
                    });
                }
                else {
                    this.grid.reset();
                }
            });
            searchPanel.append(searchInputBox);
            this.element.append(searchPanel);
        }

        initializeResetFilterPanel(panelSettings) {
            // Reset Panel
            const resetPanel = $("<div class='section-panel section-centered-panel section-reset-panel '>");
            const resetButton = $('<button/>');
            resetButton.text(panelSettings['type'].buttonText);
            resetButton.click((e) => { this.resetFilter(); });
            resetPanel.append(resetButton);
            this.element.append(resetPanel);
        }

        initializeCustomPanel(panelSettings) {
            //Custom
            const panelTitle = $("<div class='section-panel section-header-panel custom-title'>");
            panelTitle.text(panelSettings['filters'].panelTitle);
            this.element.append(panelTitle);
            const panel = $("<div class='section-panel'>");

            const filterItem = $("<span class='filter-item'>");
            filterItem.attr("data-filter-field", panelSettings['field']);
            const valueSpan = $('<span class="value">');
            const countSpan = $('<span class="count">');
            valueSpan.text(panelSettings['filters'].panelfilter);
            countSpan.text("(" + this.summary.getNotEmptyCount(panelSettings['field']) + ")­");
            filterItem.append(valueSpan);
            filterItem.append(countSpan);
            filterItem.click((e) => {
                const target = $(e.target);
                const field = target.attr("data-filter-field");
                this.applyCustomFilter(panelSettings['filters'].filter);
            });
            panel.append(filterItem);
            this.element.append(panel);
        }

        initializeStandardFilterPanel(properties, panel) {
            const distinctMetrics = this.summary.getDistinctMetrics(properties.id);
            if (!Oracle.isEmpty(distinctMetrics)) {
                for (let i = 0; i < distinctMetrics.length; i++) {
                    const metrics = distinctMetrics[i];
                    const filterItem = $("<span class='filter-item'>");
                    filterItem.attr("data-filter-field", properties.id);
                    filterItem.data("data-filter-value", metrics.value);
                    const valueSpan = $('<span class="value">');
                    const countSpan = $('<span class="count">');
                    if (properties.lookup) {
                        valueSpan.text(properties.lookup[metrics.value].filterTitle);
                    }
                    else {
                        valueSpan.text(Oracle.Formating.formatValue(metrics.value));
                    }
                    countSpan.text("(" + metrics.count + ")­");
                    filterItem.append(valueSpan);
                    filterItem.append(countSpan);
                    filterItem.click((e) => {
                        const target = $(e.target);
                        const field = target.attr("data-filter-field");
                        const value = target.data("data-filter-value");
                        this.applyFilter(field, value);
                    });
                    panel.append(filterItem);
                }
            }
        }

        applyFilter(fieldName, fieldValue) {
            this.grid.filter((settings) => Oracle.includes(settings.data[fieldName], fieldValue));
        }

        applyCustomFilter(filter, fieldName) {
            if (filter === 'isNotEmpty') {
                this.grid.filter((settings) => !Oracle.isEmpty(settings.data[fieldName]));
            }
        }

        resetFilter() {
            this.element.find(".section-search-panel input").val("");
            this.grid.reset();
        }

    }

    return parent;
}(Oracle));