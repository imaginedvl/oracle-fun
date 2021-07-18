// To use this file you need to add those 2 lines to the Tampermonkey script
// @grant GM_setValue
// @grant GM_getValue

// LD: In this file, we put everything that "overrides" the normal behavior of the oracle-fun framework for "tampermonkey" specific scripts
// One exemple is for the local storage, we need to use GM_getValue/GM_setValue instead of wrtiting directly to the storage.

'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Storage
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {

    // Overriding storage methods if Oracle.Storage is being used/loaded
    if (parent.hasOwnProperty('Storage')) {
        parent.Storage.onReadLocalStringValue = function (name, defaultValue = null) {
            return GM_getValue(name, defaultValue);
        }
        parent.Storage.onSetLocalStringValue = function (name, value) {
            GM_setValue(name, value);
        }
    }

    return parent;
}(Oracle));

