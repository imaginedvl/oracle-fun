'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.BugDB.BugGrid
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('BugDB')) parent.BugDB = {};
    const result = parent.BugDB;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: BugGrid
    // ---------------------------------------------------------------------------------------------------------------- //
    result.BugGrid = class extends Oracle.Controls.Grids.Grid {

        constructor(controlSettings) {
            if (Oracle.isEmpty(controlSettings)) controlSettings = {};
            for(let i = 0; i< controlSettings.fields.length; i++)
            {
                if(Oracle.isEmpty(controlSettings.columns)) {
                    controlSettings.columns = [] ;
                }
                controlSettings.columns.push(Oracle.BugDB.getFieldProperties(controlSettings.fields[i]));
            }
            super(controlSettings);
        }
    }

    return parent;
}(Oracle));