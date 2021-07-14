'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.FilterPanel
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel { border: 1px solid var(--controlBorderColor);  }');
    Oracle.Controls.Themes.addStaticCSSRule('div.bugdbFilterpanel.oracle.control div { border: 1px solid var(--controlBorderColor);  }');
    
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

            this.summary = new Oracle.BugDB.BugSummary(controlSettings.data);
            
            this.sections = [];
            const initializationSettings = { grid: controlSettings.grid }; 
            
            let texts = [];
            texts.push("Bug List Helper");
            initializationSettings.texts = texts
            initializationSettings.textAlign  = "center";
            let section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);
            
            texts = [];
            texts.push("Reported from:");
            texts.push(this.summary.getMinimum(Oracle.BugDB.Fields.DateReported));
            texts.push("to");
            texts.push(this.summary.getMaximum(Oracle.BugDB.Fields.DateReported));
            initializationSettings.texts = texts
            initializationSettings.textAlign  = "left";
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);
            
            texts = [];
            texts.push("Severity:");
            initializationSettings.texts = texts
            initializationSettings.textAlign  = "left";
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            texts = [];
            texts.push("Components:");
            initializationSettings.texts = texts
            initializationSettings.textAlign  = "left";
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            texts = [];
            texts.push("Tags:");
            initializationSettings.texts = texts
            initializationSettings.textAlign  = "left";
            section = new Oracle.BugDB.FilterPanelSection(initializationSettings);
            this.sections.push(section);

            texts = [];
            this.populateSections();
            Oracle.Logger.logDebug("FilterPanel initialized: ");
        }

        populateSections()
        {
            for(let i = 0; i < this.sections.length; i++)
            {
                const section = this.sections[i];
                for(let c = 0; c < section.rows.length; c++)
                {
                    this.element.append(section.rows[c]);
                }
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
            this.texts = initializationSettings.texts;
            this.textAlign = initializationSettings.textAlign;
            this.rows = [];
            
            for(let c = 0; c < this.texts.length; c++) {
                this.rows.push($("<div style='width:100%; font-size:12px; text-align:" + this.textAlign + ";'><h3>" + this.texts[c] + "</h3></div>"));
            }
        }
    }

    return parent;
}(Oracle));