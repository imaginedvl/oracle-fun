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

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-date-range { color: var(--controlTextColorLighten3); } ');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-date-range .from { color: var(--controlTextColor);  } ');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-date-range .to  {color: var(--controlTextColor); } ');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-totals .selected { font-weight:600; color: var(--controlTextColor); } ');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-totals .total  {  font-weight:600;color: var(--controlTextColor); } ');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel .section-summary-panel .summary-totals { color: var(--controlTextColorLighten3); } ');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter { display:inline-block; cursor: pointer; user-select:none; border:2px solid RGBA(0, 0, 0, 0); border-radius:0.2rem; }');

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item { margin-bottom:1px;  padding-right:2px; padding-left:2px; display:inline-block; cursor: pointer; user-select:none; border:2px solid RGBA(0, 0, 0, 0); border-radius:0.2rem; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item span.value { font-weight: 600; white-space: nowrap; }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item span.count { padding-left:3px; color: var(--controlTextColorLighten3)}');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item * { pointer-events: none }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item.selected:not(.inverted) { border:2px solid var(--successBorderColor); color: var(--successTextColorLighten2);background-color: var(--successBackgroundColorLighten2); }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter.item.selected.inverted {  border:2px solid var(--errorBorderColor); color: var(--errorTextColorLighten2);background-color: var(--errorBackgroundColorLighten2); }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterPanel span.filter:hover { background-color:var(--controlFocusBackgroundColor); color: var(--controlFocusTextColor); border:2px solid var(--controlFocusBorderColor); }');

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
        IsBackport: 'isBackport',
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
        },
        isBackport: {
            title: 'BackPort Request',
            predicate: (bug) => {
                return (bug.isBackport());
            },
            count: (bugs) => {
                let count = 0;
                for (let i = 0; i < bugs.length; i++) {
                    if (bugs[i].isBackport()) {
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

    let _nextSectionId = 0;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: FilterPanel
    // ---------------------------------------------------------------------------------------------------------------- //
    result.FilterPanel = class extends Oracle.Controls.Control {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            controlSettings.type = 'bugdbFilterPanel';
            controlSettings.elementType = 'div';
            super(controlSettings);
            this.filterItemSettings = [];
        }

        onBuildUserSettings(userSettings) {
            if (!Oracle.isEmptyOrWhiteSpaces(this.filterItemSettings)) {
                userSettings.filterItemSettings = this.filterItemSettings;
            }
            else {
                userSettings.filterItemSettings = null;
            }
            userSettings.keywordSearchValue = this.element.find(".section-search-panel input")?.val();
        }

        onInitialize(controlSettings, userSettings) {
            if (Oracle.isEmpty(controlSettings.grid)) {
                Oracle.Logger.logWarning("Target grid is not provided...");
            }
            this.grid = controlSettings.grid;
            this.bugs = controlSettings.data;
            this.fields = controlSettings.fields;
            this.summary = new Oracle.BugDB.BugSummary(this.bugs, controlSettings.grid.visibleData);

            // Title
            const title = $("<div class='main-title-panel'>");
            title.text("Bug List Helper");
            this.element.append(title);

            let filterItemSettings = null;
            // First from control settings
            filterItemSettings = controlSettings?.filterItemSettings;
            // Then from user 
            filterItemSettings = userSettings?.filterItemSettings ? userSettings?.filterItemSettings : filterItemSettings;
            if (!Array.isArray(filterItemSettings)) {
                filterItemSettings = [];
            }

            if (!Oracle.isEmpty(controlSettings.panels)) {
                for (let i = 0; i < controlSettings.panels.length; i++) {
                    const panelSettings = controlSettings.panels[i];
                    switch (panelSettings.type) {
                        case result.PanelTypes.Reset:
                            this.initializeResetPanel();
                            break;
                        case result.PanelTypes.Search:
                            this.initializeSearchPanel(controlSettings, userSettings);
                            break;
                        case result.PanelTypes.Summary:
                            this.initializeSummaryPanel();
                            break;
                        case result.PanelTypes.Standard:
                            this.initializeStandardPanel(controlSettings, userSettings, false);
                            break;
                        case result.PanelTypes.Custom:
                            this.initializeCustomPanel(panelSettings, controlSettings, userSettings);
                            break;
                    }
                }
            }
            this.updateFilters();
        }

        updatePanels() {
            const panelItems = this.element.find(".filter.item");
            for (let i = 0; i < panelItems.length; i++) {
                const target = $(panelItems.get(i));
                const filterId = target.attr("data-filter-id");
                let visibleCount = 0;
                if (Oracle.isEmpty(filterId)) {
                    const field = target.attr("data-filter-field");
                    const value = target.data("data-filter-value");
                    const metric = this.summary.getDistinctMetrics(field).find(obj => {
                        return obj.value === value
                    });
                    visibleCount = metric ? metric.visibleCount : 0;
                }
                else {
                    visibleCount = _getCustomPanelFilterById(filterId).count(this.grid.visibleData);
                }
                const countSpan = target.find(".count");
                countSpan.text("(" + visibleCount + ")");
            }
            // then we update the summary
            const dateRange = this.element.find(".summary-date-range");
            const minDateReported = this.summary.getVisibleMinimum(Oracle.BugDB.Fields.DateReported);
            if (!Oracle.isEmpty(minDateReported)) {
                dateRange.find(".from").html(Oracle.HTML.formatValue(minDateReported, { formater: 'BugDBDate' }));
                dateRange.show();
                dateRange.find(".to").html(Oracle.HTML.formatValue(this.summary.getVisibleMaximum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate' }));
            }
            else {
                dateRange.hide();
            }
            const totals = this.element.find(".summary-totals");
            totals.find(".selected").text(this.grid.visibleData.length);
            totals.find(".total").text(this.grid.data.length);
        }

        initializeSummaryPanel() {
            const summaryPanel = $("<div class='section-panel section-centered-panel section-summary-panel'>");
            const totals = $("<div class='summary-totals'>");
            totals.append("Showing ")
            totals.append("<span class='selected'>" + this.grid.visibleData.length + "</span>");
            totals.append(" out of ");
            totals.append("<span class='total'>" + this.grid.data.length + "</span>");
            totals.append(" bugs");
            summaryPanel.append(totals);
            const dateRange = $("<div class='summary-date-range'  style='display:none'>");
            dateRange.append("From ");
            dateRange.append("<span class='from'>(from)</span>");
            dateRange.append(" to ");
            dateRange.append("<span class='to'>(to)</span>");
            summaryPanel.append(dateRange);
            this.element.append(summaryPanel);
        }

        initializeBasePanel(title) {
            _nextSectionId++;
            const panelTitle = $("<div class='section-panel section-header-panel'>");
            panelTitle.text(title);
            this.element.append(panelTitle);
            const panel = $("<div class='section-panel'>");
            panel.attr('data-section-id', _nextSectionId);
            return panel;
        }

        createBaseFilterItem(text, value, count, fieldName, customFilterId, controlSettings, userSettings) {
            let filterItemSettings = this.getSettingValue(controlSettings, userSettings, "filterItemSettings");
            if (!Array.isArray(filterItemSettings)) {
                filterItemSettings = [];
            }

            let filterItemName = customFilterId ? customFilterId : fieldName + "-" + Oracle.toNeutralString(value);
            const filterSetting = filterItemSettings.find(obj => {
                return obj.filterItem === filterItemName
            });
            const filterItem = $("<span class='filter'>");
            filterItem.addClass("item");
            if (!Oracle.isEmpty(filterSetting)) {
                if (filterSetting.value) {
                    filterItem.addClass("inverted")
                }
                filterItem.addClass("selected");

            }
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

                if (e.ctrlKey) {
                    if (!target.hasClass("selected")) {
                        target.addClass("selected");
                    }
                    if (!target.hasClass("inverted")) {
                        target.addClass("inverted");
                    }
                    else {
                        target.removeClass("selected inverted");
                    }
                }
                else {
                    if (!target.hasClass("selected")) {
                        target.addClass("selected");
                    }
                    else {
                        target.removeClass("selected inverted");
                    }
                }
                this.updateFilters();
            });
            return filterItem;
        }

        updateFilters() {
            this.grid.filter((settings) => {
                let result = true;
                this.filterItemSettings = [];
                // First we check if there is keyword filter
                const keyword = this.element.find(".section-search-panel input").val();
                if (!Oracle.isEmptyOrWhiteSpaces(keyword)) {
                    result = settings.data.match(keyword);
                }
                // Then we check for each selected filters
                const filterPanels = this.element.find(".section-panel[data-section-id]");
                for (let j = 0; j < filterPanels.length; j++) {
                    const panelItems = $(filterPanels[j]).find(".filter.selected");
                    if (!Oracle.isEmpty(panelItems)) {
                        let panelResult = false;
                        for (let i = 0; i < panelItems.length; i++) {
                            const target = $(panelItems.get(i));
                            const filterId = target.attr("data-filter-id");
                            const field = target.attr("data-filter-field");
                            const value = target.data("data-filter-value");
                            if (!panelResult) {
                                if (Oracle.isEmpty(filterId)) {
                                    panelResult = Oracle.includes(settings.data[field], value);
                                }
                                else {
                                    panelResult = _getCustomPanelFilterById(filterId).predicate(settings.data);
                                }
                                if (target.hasClass("inverted")) panelResult = !panelResult;
                            }
                            let filterItemName = filterId ? filterId : field + "-" + Oracle.toNeutralString(value);
                            this.filterItemSettings.push({ filterItem: filterItemName, value: target.hasClass("inverted") });
                        }
                        result = result && panelResult;
                    }
                }
                return result;
            });
            this.saveUserSettings();
            this.summary.build(this.bugs, this.grid.visibleData);
            this.updatePanels()
        }

        initializeStandardPanel(controlSettings, userSettings, expandFilter) {
            for (const [key, properties] of Object.entries(Oracle.BugDB.FieldProperties)) {
                if (Oracle.includes(this.fields, properties.id)) {
                    if (properties.filterable === true) {
                        let title;
                        if (Oracle.isEmpty(properties.filterTitle)) {
                            title = properties.headerTitle;
                        }
                        else {
                            title = properties.filterTitle;
                        }
                        const panel = this.initializeBasePanel(title);
                        const hiddenFilter = this.initializeStandardPanelFilterItem(controlSettings, userSettings, panel, properties, expandFilter);

                        if (!expandFilter && hiddenFilter) {
                            const filterExpand = $("<span class='filter'/>")
                            filterExpand.addClass("expand");
                            filterExpand.text("...");
                            filterExpand.click((e) => {
                                const target = $(e.target);
                                panel.children().remove();
                                this.initializeStandardPanelFilterItem(controlSettings, userSettings, panel, properties, true);
                                this.updateFilters();//required to apply user saved filter that wasn't displayed before expand
                            });

                            panel.append(filterExpand);
                        }
                        this.element.append(panel);
                    }
                }
            }
        }

        initializeStandardPanelFilterItem(controlSettings, userSettings, panel, properties, expandFilter) {
            let hiddenFilter = false;
            const distinctMetrics = this.summary.getDistinctMetrics(properties.id);
            if (!Oracle.isEmpty(distinctMetrics)) {
                for (let i = 0; i < distinctMetrics.length; i++) {
                    const metrics = distinctMetrics[i];
                    let value;
                    if (properties.lookup && properties.lookup[metrics.value]?.filterTitle) {
                        value = properties.lookup[metrics.value].filterTitle;
                    }
                    else {
                        value = Oracle.Formating.formatValue(metrics.value);
                    }
                    if (Oracle.compare(metrics.count, 0) === 1 || (properties.lookup && properties.lookup[metrics.value].filterVisible)) {
                        let displayFilter = expandFilter || !properties.lookup || properties.lookup[metrics.value] !== undefined;
                        if (displayFilter) {
                            const item = this.createBaseFilterItem(value, metrics.value, metrics.visibleCount, properties.id, null, controlSettings, userSettings);
                            panel.append(item);
                            if (i < distinctMetrics.length - 1) {
                                panel.append("<span class='itemSeparator'>, </span>");
                            }
                        }
                        else {
                            hiddenFilter = true;
                        }
                    }
                }
            }
            return hiddenFilter;
        }

        initializeSearchPanel(controlSettings, userSettings) {
            // Search Panel
            const searchPanel = $("<div class='section-panel section-search-panel'>");
            const searchInputBox = $("<input type='text' placeholder='Refined search...'>");
            let keywordSearchValue = this.getSettingValue(controlSettings, userSettings, "keywordSearchValue");
            searchInputBox.val(keywordSearchValue);
            searchInputBox.on("input", (e) => {
                this.updateFilters();
            });
            searchPanel.append(searchInputBox);
            this.element.append(searchPanel);
        }

        initializeResetPanel() {
            // Reset Panel
            const resetPanel = $("<div class='section-panel section-centered-panel section-reset-panel '>");
            const resetButton = $('<button/>');
            resetButton.text('Clear Filters');
            resetButton.click((e) => { this.resetFilters(); });
            resetPanel.append(resetButton);
            this.element.append(resetPanel);
        }

        initializeCustomPanel(panelSettings, controlSettings, userSettings) {
            const panel = this.initializeBasePanel(panelSettings.title);
            for (let i = 0; i < panelSettings.filters.length; i++) {
                const filterId = panelSettings.filters[i];
                const properties = _getCustomPanelFilterById(filterId);
                const count = properties.count(this.bugs);
                const item = this.createBaseFilterItem(properties.title, null, count, null, filterId, controlSettings, userSettings);
                panel.append(item);
                if (i < panelSettings.filters.length - 1) {
                    panel.append("<span class='itemSeparator'>, </span>");
                }
            }
            this.element.append(panel);
        }

        resetFilters() {
            this.element.find(".section-search-panel input").val("");
            this.element.find('.filter.selected').removeClass("selected inverted");
            this.updateFilters();
        }

        getSettingValue(controlSettings, userSettings, settingName) {
            // First from control settings
            let settingValue = null
            settingValue = settingValue ? controlSettings[settingName] : null;
            // Then from user 
            settingValue = userSettings ? (userSettings[settingName] ? userSettings[settingName] : settingValue) : settingValue;
            return settingValue;
        }
    }

    return parent;
}(Oracle));
