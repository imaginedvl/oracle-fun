'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Controls
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Controls')) parent.Controls = {};
    const result = parent.Controls;

    // ---------------------------------------------------------------------------------------------------------------- //
    // Renderers
    // ---------------------------------------------------------------------------------------------------------------- //
    const _renderers = {};

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: Control
    // ---------------------------------------------------------------------------------------------------------------- //
    result.Control = class {

        constructor(settings) {
            this.id = Oracle.generateId(25);
            if (Oracle.isEmpty(settings.target)) {
                this.element = $("<" + settings.elementType + " class='" + settings.type + " oracle control' data-control-id='" + this.id + "' data-control-type='" + settings.type + "'  >");
            }
            else {
                this.element = $(settings.target);
                this.element.addClass("oracle control " + settings.type);
                this.element.attr("data-control-id", this.id);
                this.element.attr("data-control-type", settings.type);
            }
        }

        on(event, callback) {
            this.element.on(event, callback);
            Oracle.Logger.logDebug(this.element.attr("data-control-type") + " event " + event + " registered");
        }

        triggerEvent(event) {
            Oracle.Logger.logDebug(this.element.attr("data-control-type") + " event " + event + " triggered");
            this.element.trigger(event);
        }

    };

    return parent;
}(Oracle));