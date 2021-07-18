(function () {

    const debugConsole = $("<div id='debugConsole'>");
    const writeConsole = function (message) {
        const entry = $('<div>');
        entry.text(message);
        $("#debugConsole").append(entry);
    }

    const propertyName = 'X'

    const buttonsBar = $('<div>');
    const aButton = $('<button>Store A</button>').on('click', () => {
        Oracle.Storage.writeLocalStringValue(propertyName, 'a');
        writeConsole("Storing: 'a'");
    });

    const readButton = $('<button>Read</button>').on('click', () => {
        const value = Oracle.Storage.readLocalStringValue(propertyName, null);
        writeConsole("Reading: " + value);
    });
    buttonsBar.append(aButton);
    buttonsBar.append(readButton);


    $('body').append(buttonsBar);
    $('body').append(debugConsole);

})();
