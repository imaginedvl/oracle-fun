(function () {

    const debugConsole = $("<div id='debugConsole'>");
    const writeConsole = function (message) {
        const entry = $('<div>');
        entry.text(message);
        $("#debugConsole").append(entry);
    }

    const propertyName = 'X'

    const buttonsBar = $('<div>');
    const aButton = $('<button>Store bool:true</button>').on('click', () => {
        Oracle.Storage.writeLocalValue(propertyName, true);
    });

    const readButton = $('<button>Read</button>').on('click', () => {
        const value = Oracle.Storage.readLocalValue(propertyName, null);
    });
    buttonsBar.append(aButton);
    buttonsBar.append(readButton);


    $('body').append(buttonsBar);
    $('body').append(debugConsole);

})();
