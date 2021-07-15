'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel { border: 1px solid var(--controlBorderColor);  }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel span {cursor: pointer;}');
    
    /*
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel.oracle.control div { border: 1px solid var(--controlBorderColor);  }');
    */

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
            this.grid = controlSettings.grid;

        
            // Init Panel Header
            const panelHader = $("<div class='title'>");
            panelHader.append($("<h3  id=  '" + this.id + "-filter'  class='FilterPanelTitle'>").append("Bug List Helper"));
            panelHader.append($('<hr>'));
            this.element.append(panelHader);

            // Compute summary which will be used by the init sections
            this.summary = new Oracle.BugDB.BugSummary(controlSettings.data);

            // Add the From to which is a specific section 
            const panelFromTo = $("<div class='fromTo'>");
            const bugsRange = $("<p>");
            bugsRange.append(Oracle.HTML.formatValue(this.summary.getMinimum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate'}));
            bugsRange.append("<br/>to<br/> ");
            bugsRange.append(Oracle.HTML.formatValue(this.summary.getMaximum(Oracle.BugDB.Fields.DateReported), { formater: 'BugDBDate'}));
            panelFromTo.append(bugsRange);
            panelFromTo.append($('<hr>'));
            this.element.append(panelFromTo);

            // add reset buton .. TODO: .. give some love to this button       
            const resetFiltersButton = $('<button/>', {text: 'Reset Filters', id: 'resetFiltersButton'});
            resetFiltersButton.click((e) => {this.applyPanelSelectedFilter();});            
            this.element.append(resetFiltersButton); 

            // Build the filters
            if (!Oracle.isEmpty(controlSettings.panelFilters)) {
                for (let i = 0; i < controlSettings.panelFilters.length; i++) {
                    this.initializeFilterPanelSections(controlSettings.panelFilters[i]);
                }    
            }
            Oracle.Logger.logDebug("FilterPanel initialized: " + this.id, { panel: this });

        }

        initializeFilterPanelSections(filterObj) {

            if(!Oracle.isEmpty(filterObj))
            {
                const properties = Oracle.BugDB.getFieldProperties(filterObj);
                const filterSection =  $("<div  id=  '" + this.id + "-filter' class='FilterPanelSection'>");
                filterSection.append($("<p  id=  '" + this.id + "-filter'  class='FilterPanelSectionTitle'>").append(properties.filterTitle + ":"));

                // TODO .. for now we simply use distint for all fields 
                const distinctMetrics = this.summary.getDistinctMetrics(filterObj);

                // fieldSummary = this
                if ( !Oracle.isEmpty(distinctMetrics))
                {
                    for(let i = 0; i < distinctMetrics.length; i++)
                    {
                        const metrics = distinctMetrics[i];
                        const filterItem = $("<span class='FilterPanelSectionFilterItem'>");
                        filterItem.attr("data-filter-field", filterObj);
                        filterItem.data("data-filter-value", metrics.value);
    
                        if(properties.lookup) {
                            filterItem.append(properties.lookup[metrics.value].filterTitle + " (" + metrics.count + ")­ ");
                        }
                        else {
                            filterItem.append(Oracle.Formating.formatValue(metrics.value) + " (" + metrics.count + ")­ ");
                        }
                        
                        filterItem.click((e) => 
                        {
                            this.applyPanelSelectedFilter($(e.target));                               
                        });
    
                        filterSection.append(filterItem);  
                    }
                        
                }

                filterSection.append($("<hr>"));
                this.element.append(filterSection);
                
            }
        }

        applyPanelSelectedFilter(target)
        {
            if ( !Oracle.isEmpty(target))
            {
                const field = target.attr("data-filter-field");
                const value = target.data("data-filter-value");
                console.log("FILTER", { value: value, field: field}); 
                this.grid.filter((settings) => Oracle.includes(settings.data[field], value));
            }
            else
            {
                this.grid.filter();
            }
        }
    }

    return parent;
}(Oracle));