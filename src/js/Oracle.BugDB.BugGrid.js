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
            super(controlSettings);
        }
    }

    return parent;
}(Oracle));