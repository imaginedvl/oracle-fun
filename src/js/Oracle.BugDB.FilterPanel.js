'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel { width:200px; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .main-title-panel { text-align:center; padding:8px; color: var(--primaryTextColor); background-color: var(--primaryBackgroundColorLighten1); font-weight: 600;  } ');

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
        Standard: 'standard',
        Search: 'search',
        Summary: 'summary',
        Custom: 'custom',
        Reset: 'reset'
    }

    result.CustomFilters =
    {
        IsCustomer: 'isCustomer',
        IsLate: 'isLate'
    }

    const _customFilterSettings =
    {
        isCustomer: {
            title: 'Customer Bugs',
            predicate: (bug) => {
                return !Oracle.isEmpty(bug.customer);
            },
            count: (bugs) => {
                let count = 0;
                for (let i = 0; i < bugs.length; i++) {
                    if (!Oracle.isEmpty(bugs[i].customer)) {
                        count++;
                    }
                }
                return count;
            },
        },
        isLate: {
            title: 'Past Eta',
            predicate: (bug) => {
                return (bug.isLate());

            },
            count: (bugs) => {
                let count = 0;
                for (let i = 0; i < bugs.length; i++) {
                    if (bugs[i].isLate()) {
                        count++;
                    }
                }
                return count;
            }
        }
    }

    const _getCustomPanelFilterById = function (id) {
        return _customFilterSettings[id];
    }

    result.getCustomPanelFilterById = _getCustomPanelFilterById;

    result.addCustomPanelFilter = function (id, title, predicate, countCallback) {
        _customFilterSettings[id] =
        {
            title: title,
            predicate: predicate,
            count: countCallback
        };
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
                        let title;
                        if (Oracle.isEmpty(properties.filterTitle)) {
                            title = properties.headerTitle;
                        }
                        else {
                            title = properties.filterTitle;
                        }
                        const panel = this.initializeBasePanel(title);
                        this.initializeStandardFilterPanel(properties, panel);
                        this.element.append(panel);
                    }
                    else {
                        switch (panelSettings.type) {
                            case result.PanelTypes.Reset:
                                this.initializeResetFilterPanel();
                                break;
                            case result.PanelTypes.Search:
                                this.initializeSearchPanel();
                                break;
                            case result.PanelTypes.Summary:
                                this.initializeSummaryPanel();
                                break;
                            case result.PanelTypes.Custom:
                                this.initializeCustomPanel(panelSettings);
                                break;
                        }
                    }
                }
            }
            Oracle.Logger.logDebug("FilterPanel initialized: " + this.id, { panel: this });
        }

        initializeBasePanel(title) {
            const panelTitle = $("<div class='section-panel section-header-panel'>");
            panelTitle.text(title);
            this.element.append(panelTitle);
            const panel = $("<div class='section-panel'>");
            return panel;
        }

        createBaseFilterItem(text, value, count, fieldName, customFilterId) {
            const filterItem = $("<span class='filter-item'>");
            filterItem.attr("data-filter-field", fieldName);
            filterItem.attr("data-filter-id", customFilterId);
            filterItem.data("data-filter-value", value);
            const valueSpan = $('<span class="value">');
            valueSpan.setContent(text);
            filterItem.append(valueSpan);

            if (!Oracle.isEmpty(count)) {
                const countSpan = $('<span class="count">');
                countSpan.text("(" + count + ")­");
                filterItem.append(countSpan);
            }
            filterItem.click((e) => {
                const target = $(e.target);
                const filterId = target.attr("data-filter-id");
                const field = target.attr("data-filter-field");
                const value = target.data("data-filter-value");
                this.applyFilter(field, value, filterId);
            });
            return filterItem;
        }

        initializeStandardFilterPanel(properties, panel) {
            const distinctMetrics = this.summary.getDistinctMetrics(properties.id);
            if (!Oracle.isEmpty(distinctMetrics)) {
                for (let i = 0; i < distinctMetrics.length; i++) {
                    const metrics = distinctMetrics[i];
                    let value;
                    if (properties.lookup) {
                        value = properties.lookup[metrics.value].filterTitle;
                    }
                    else {
                        value = Oracle.Formating.formatValue(metrics.value);
                    }
                    const item = this.createBaseFilterItem(value, metrics.value, metrics.count, properties.id, null);
                    panel.append(item);
                }
            }
        }

        initializeSummaryPanel() {
            // Summary
            const minDateReported = this.summary.getMinimum(Oracle.BugDB.Fields.DateReported);
            if (!Oracle.isEmpty(minDateReported)) {
                const dateRangePanel = $("<div class='section-panel section-centered-panel date-range-panel'>");
                dateRangePanel.append("<span class='from'>From</span>");
                dateRangePanel.append(Oracle.HTML.formatValue(minDateReported, { formater: 'BugDBDate' }));
                dateRangePanel.append("<span class='to'>to</span>");
                dateRangePanel.append(Oracle.HTML.formatValue(this.summary.getMaximum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate' }));
                this.element.append(dateRangePanel);
            }
        }

        initializeSearchPanel() {
            // Search Panel
            const searchPanel = $("<div class='section-panel section-search-panel'>");
            const searchInputBox = $("<input type='text' placeholder='Refined search...'>");
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

        initializeResetFilterPanel() {
            // Reset Panel
            const resetPanel = $("<div class='section-panel section-centered-panel section-reset-panel '>");
            const resetButton = $('<button/>');
            resetButton.text('Clear Filters');
            resetButton.click((e) => { this.resetFilter(); });
            resetPanel.append(resetButton);
            this.element.append(resetPanel);
        }

        initializeCustomPanel(panelSettings) {
            const panel = this.initializeBasePanel(panelSettings.title);
            for (let i = 0; i < panelSettings.filters.length; i++) {
                const filterId = panelSettings.filters[i];
                const properties = _getCustomPanelFilterById(filterId);
                const count = properties.count(this.bugs);
                const item = this.createBaseFilterItem(properties.title, null, count, null, filterId);
                panel.append(item);
            }
            this.element.append(panel);
        }

        applyFilter(fieldName, fieldValue, filterId) {
            if (Oracle.isEmpty(filterId)) {
                console.log({ name: fieldName, value: fieldValue });
                this.grid.filter((settings) => Oracle.includes(settings.data[fieldName], fieldValue));
            }
            else {
                this.grid.filter((settings) => _getCustomPanelFilterById(filterId).predicate(settings.data));
            }
        }

        resetFilter() {
            this.element.find(".section-search-panel input").val("");
            this.grid.reset();
        }
    }

    return parent;
}(Oracle));
