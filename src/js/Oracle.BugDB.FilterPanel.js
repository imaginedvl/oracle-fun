'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel { border: 1px solid var(--controlBorderColor);  }');

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
            bugsRange.append(this.summary.getMinimum(Oracle.BugDB.Fields.DateReported));
            bugsRange.append(" to ");
            bugsRange.append(this.summary.getMaximum(Oracle.BugDB.Fields.DateReported));
            panelFromTo.append(bugsRange);
            panelFromTo.append($('<hr>'));
            this.element.append(panelFromTo);

            // Build the filters
            if (!Oracle.isEmpty(controlSettings.panelFilters)) {
                for (let i = 0; i < controlSettings.panelFilters.length; i++) {
                    this.initializeFilterPanelSections(controlSettings.panelFilters[i]);
                }    
            }
        }

        initializeFilterPanelSections(filterObj) {

            if(!Oracle.isEmpty(filterObj.targetField))
            {
                const filterSection =  $("<div  id=  '" + this.id + "-filter' class='FilterPanelSection'>");
                filterSection.append($("<p  id=  '" + this.id + "-filter'  class='FilterPanelSectionTitle'>").append(filterObj.title + ":"));

                // TODO .. for now we simply use distint for all fields 
                const fieldSummary = this.summary.getDistincts(filterObj.targetField);

                if ( !Oracle.isEmpty(fieldSummary))
                {
                    for (const property in fieldSummary) {
                        
                        const filterItem = $("<span class='FilterPanelSectionFilterItem'>");
                        filterItem.attr("filterField", filterObj.id);
                        filterItem.attr("filterKey", property);
    
                        if("SIMPLE" == filterObj.filterLayout)
                        {
                            filterItem.append( property + " (" + fieldSummary[property] + ")­ <br>");
                        }
    
                        if("USE_TITLE" == filterObj.filterLayout)
                        {
                            filterItem.append(filterObj.title + "-" + property + " (" + fieldSummary[property] + ") <br>");
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

                Oracle.Logger.logDebug("Filter section  (" + filterObj.title + ") initialized");
                
            }
        }


        applyPanelSelectedFilter(target)
        {
           // TODO -- filter on field and on key     
            alert("TODO - filter on => " + target.attr("filterField") + " / " + target.attr("filterKey"));
        }

    }

    return parent;
}(Oracle));