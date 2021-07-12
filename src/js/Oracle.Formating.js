'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Formating
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Formating')) parent.Formating = {};
    let _initialized = false;
    const result = parent.Formating;

    const _formaters = {
        default:
        {
            parent: null,
            byId: {},
            byType: {},
            byKnownClass: {}
        }
    };

    const _defaultFormater = _formaters.default;

    result.addFormaterCollection = function (code, parentCode = _defaultFormater) {
        _formaters[code] =
        {
            parent: parentCode,
            byId: {},
            byType: {},
            byKnownClass: {}
        }
    }

    const _normalizeIdList = function (idList) {
        if (!Oracle.isEmpty(idList)) {
            if (Oracle.isString(idList)) {
                return [idList];
            }
            else if (Array.isArray(idList)) {
                const result = [];
                for (let i = 0; i < idList.length; i++) {
                    if (Oracle.isString(idList[i])) {
                        result.push(idList[i]);
                    }
                }
                return result;
            }
        }
        else {
            return null;
        }
    }

    const _getFormaterCollectionByName = function (collectionName) {
        if (!Oracle.isEmpty(collectionName)) {
            const collection = _formaters[collectionName];
            if (!collection) {
                throw new Oracle.Errors.ValidationError("Invalid formater collection name: " + collectionName);
            }
            return collection;
        }
        else {
            return _defaultFormater;
        }
    }

    const _addFormater = function (ids, types, knownClasses, callback, collectionName = null) {
        ids = _normalizeIdList(ids);
        types = _normalizeIdList(types);
        knownClasses = _normalizeIdList(knownClasses);
        const collection = _getFormaterCollectionByName(collectionName);
        if (ids !== null) {
            for (let i = 0; i < ids.length; i++) {
                collection.byId[ids[i]] = callback;
            }
        }
        if (types !== null) {
            for (let i = 0; i < types.length; i++) {
                collection.byType[types[i]] = callback;
            }
        }
        if (knownClasses !== null) {
            for (let i = 0; i < knownClasses.length; i++) {
                collection.byKnownClass[knownClasses[i]] = callback;
            }
        }

        if (_initialized) {
            Oracle.Logger.logDebug("Adding Formater", { ids: ids, types: types, knownClasses: knownClasses, collection: collection });
        }
    }

    const _formatValue = function (value, settings, collectionName = null) {
        let collection = _getFormaterCollectionByName(collectionName);
        if (settings && Oracle.isString(settings.formater) && collection.byId.hasOwnProperty(settings.formater)) {
            return collection.byId[settings.formater](value, settings);
        }
        else if (settings && Oracle.isFunction(settings.formater)) {
            return settings.formater(value, settings);
        }
        else if (settings && Oracle.isString(settings.type) && collection.byType.hasOwnProperty(settings.type)) {
            return collection.byType[settings.type](value, settings);
        }
        else if (settings && Oracle.isString(settings.knownClass) && collection.byKnownClass.hasOwnProperty(settings.knownClass)) {
            return collection.byKnownClass[settings.knownClass](value, settings);
        }
        else // LD: If no specific type, id, or know class are specified in the settings, we try to figure out what is the variable.
        {
            // LD: We first look by type (typeof) and the known classes (instanceof but less performant, Joel would agree with me here,
            //     Joel is all about performance (when he is not late to the daily!))
            let typeofValue = typeof (value);
            if (collection.byType.hasOwnProperty(typeofValue)) {
                return collection.byType[typeofValue](value, settings);
            }
            else {
                typeofValue = Oracle.getKnownClass(value);
                if (collection.byKnownClass.hasOwnProperty(typeofValue)) {
                    return collection.byKnownClass[typeofValue](value, settings);
                }
            }
        }
        if (!Oracle.isEmpty(collection.parent)) {
            return _formatValue(value, settings, collection.parent);
        }
        else {
            return value;
        }
    }

    result.formatValue = _formatValue;
    result.addFormater = _addFormater;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Default Formaters
    // ---------------------------------------------------------------------------------------------------------------- //

    Oracle.Formating.addFormater('DateTime', 'System.DateTime', Oracle.KnownClasses.Date, (value, settings) => value.toLocaleString());
    Oracle.Formating.addFormater(['Bool', 'Boolean'], 'System.Boolean', null, (value, settings) => value.toLocaleString());
    Oracle.Formating.addFormater(['Array'], 'System.Array', Oracle.KnownClasses.Array, (value, settings) => { 
        let result = '';
        if(!Oracle.isEmpty(value) && value.length > 0)
        {
            result = value[0];
            for(let i = 1; i < value.length; i++)            
            {
                result += " " + value[i];
            }
        }
        return result;
     });

    Oracle.Logger.logDebug("Default Formaters", _formaters);
    _initialized = true;
    return parent;
}(Oracle));
