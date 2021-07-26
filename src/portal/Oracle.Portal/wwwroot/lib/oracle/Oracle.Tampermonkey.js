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

    // Overriding storage methods if Oracle.Storage is being used/loaded and if the local storage is not available
    if (typeof (Storage) === "undefined") {
        if (parent.hasOwnProperty('Storage')) {
            parent.Storage.onReadStringValueFromLocalStorage = function (name) {
                return GM_getValue(name, undefined);
            }
            parent.Storage.onWriteStringValueToLocalStorage = function (name, value) {
                GM_setValue(name, value);
            }
        }
    }
    return parent;
}(Oracle));

