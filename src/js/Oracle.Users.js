'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Module: Oracle.Users
// ---------------------------------------------------------------------------------------------------------------- //
Oracle = (function (parent) {
    if (!parent.hasOwnProperty('Users')) parent.Users = {};
    const result = parent.Users;
    let _initialized = false;
    const _userByGlobalId = {};
    const _userByEmailAddress = {};
    const _flags = {
        None: 0,
        Internal: 1,
        Group: 2
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // Class: User
    // ---------------------------------------------------------------------------------------------------------------- //
    const _userClass = class {

        constructor(firstName, lastName, fullName, displayName, emailAddress, globalId, flags = 0) {
            this.globalId = null;
            this.firstName = null;
            this.lastName = null;
            this.displayName = null;
            this.emailAddress = null;
            this.fullName = null;
            this.flags = 0;
            this.update(firstName, lastName, fullName, displayName, emailAddress, globalId, flags);
        }

        match(keyword) {
            if (keyword) {
                return this.keywords?.indexOf(keyword.removeAccentsAndDiacritics()) > -1;
            }
            else {
                return false;
            }
        }

        getSortString() {
            if ((this.flags & _flags.Group) === _flags.Group) {
                return "Z" + this.fullName;
            }
            else {
                return "A" + this.fullName;
            }
        }

        update(firstName, lastName, fullName, displayName, emailAddress, globalId, flags = 0) {
            if (this.fullName === null && fullName != null) {
                this.fullName = fullName;
            }
            if (this.lastName === null && lastName !== null) {
                this.lastName = lastName;
            }
            if (this.firstName === null && firstName !== null) {
                this.firstName = firstName;
            }
            if (this.displayName === null && displayName !== null) {
                this.displayName = displayName;
            }
            if (this.globalId === null && globalId !== null) {
                this.globalId = globalId;
            }
            if (this.emailAddress === null && emailAddress !== null) {
                this.emailAddress = emailAddress;
            }
            this.flags = this.flags | flags;
            if (this.emailAddress !== null) {
                let index = this.emailAddress.indexOf('@');
                let text = this.emailAddress.substring(0, index);
                if (this.firstName === null) {
                    index = text.indexOf(".");
                    if (index > 0) {
                        this.firstName = text.substring(0, index).toLowerCase().toUpperCaseFirstLetter();
                        if (index < text.length - 1) {
                            const last = text.lastIndexOf(".");
                            if (last > 0 && last < text.length - 1) {
                                this.lastName = text.substring(last + 1).toLowerCase().toUpperCaseFirstLetter();
                            }

                        }
                    }
                }
            }
            if ((this.flags & _flags.Internal) === _flags.Internal && this.firstName && this.displayName === null) {
                this.displayName = this.firstName;
            }
            if (this.firstName !== null) {
                if (this.lastName !== null) {
                    if (this.fullName === null) {
                        this.fullName = this.firstName + " " + this.lastName;
                    }
                    if (this.displayName === null) {
                        this.displayName = this.fullName;
                    }
                    if (this.emailAddress === null) {
                        this.emailAddress = this.firstName.toLowerCase() + "." + this.lastName.toLowerCase() + "@oracle.com";
                    }
                }
                else {
                    if (this.displayName === null) {
                        this.displayName = this.firstName;
                    }
                }
            }
            if (this.displayName === null) {
                this.displayName = this.globalId;
            }
            if (this.emailAddress === '') {
                this.emailAddress = null;
            }
            if (this.fullName === null) {
                this.fullName = this.displayName;
            }
            this.keywords = ("" + this.globalId + this.firstName + this.lastName + this.displayName + this.emailAddress + this.fullName).removeAccentsAndDiacritics();
        }

    };

    const _unknownUser = new _userClass(null, null, 'Unknown', null, null);

    const _addUser = function (user) {
        const newUser = new _userClass(
            Oracle.toNullableValue(user.firstName),
            Oracle.toNullableValue(user.lastName),
            Oracle.toNullableValue(user.fullName),
            Oracle.toNullableValue(user.displayName),
            Oracle.toNullableValue(user.emailAddress),
            Oracle.toNullableValue(user.globalId),
            Oracle.toNullableValue(user.flags));
        if (newUser.globalId !== null) {
            _userByGlobalId[newUser.globalId.toLowerCase()] = newUser;
        }
        if (newUser.emailAddress !== null) {
            _userByEmailAddress[newUser.emailAddress.toLowerCase()] = newUser;
        }
        if (_initialized) {
            Oracle.Logger.logDebug("Adding User", newUser);
        }
        return newUser;
    }

    const _findUserByEmailAddress = function (emailAddress) {
        if (!Oracle.isEmpty(emailAddress)) {
            return Oracle.toNullableValue(_userByEmailAddress[emailAddress.toLowerCase()]);
        }
        else {
            return null;
        }
    }

    const _findUserByGlobalId = function (globalId) {
        if (!Oracle.isEmpty(globalId)) {
            return Oracle.toNullableValue(_userByGlobalId[globalId.toLowerCase()]);
        }
        else {
            return null;
        }
    }

    result.getOrCreateUser = function (data) {
        let result = null;
        let globalId = Oracle.toNullableValue(data?.globalId);
        let emailAddress = Oracle.toNullableValue(data?.emailAddress);
        let lastName = Oracle.toNullableValue(data?.lastName);
        let displayName = Oracle.toNullableValue(data?.displayName);
        let firstName = Oracle.toNullableValue(data?.firstName);
        let fullName = Oracle.toNullableValue(data?.fullName);
        let flags = Oracle.toNullableValue(data?.flags);
        if (Oracle.isString((data))) {
            globalId = data;
        }
        if (!Oracle.isEmpty(globalId)) {
            result = _findUserByGlobalId(globalId);
        }
        if (!Oracle.isEmpty(emailAddress)) {
            result = _findUserByEmailAddress(emailAddress);
        }
        if (result !== null) {
            result.update(firstName, lastName, fullName, displayName, emailAddress, globalId, flags);
        }
        else {
            result = _addUser(data);
        }
        return result;
    }

    result.addUser = _addUser;
    result.User = _userClass;
    result.Flags = _flags;

    _addUser({ globalId: 'LDEVIGNE', emailAddress: "laurent.devigne@oracle.com", flags: _flags.Internal });
    _addUser({ globalId: 'LDEVITRG', displayName: 'Triage', fullName: 'Triage (Laurent Devigne)', flags: _flags.Group });
    _addUser({ globalId: 'DGILBERT', emailAddress: 'danny.gilbert@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'FDORVAL', displayName: 'Frédéric D.', firstName: 'Frédéric', lastName: 'Dorval', emailAddress: 'frederic.dorval@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'SLABARRE', firstName: 'Sébastien', lastName: 'Labarre', emailAddress: 'sebastien.labarre@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'FCOLLIN2', firstName: 'François', lastName: 'Collins', emailAddress: 'francois.collins@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'BFALL', firstName: 'Babacar', lastName: 'Fall', emailAddress: 'babacar.fall@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'VHAMEL', emailAddress: 'vincent.hamel@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'OGRUSHEN', emailAddress: 'olga.grushenko@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'RSCHAUDH', emailAddress: 'rajdeep.chaudhary@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'VDENECHA', firstName: 'Véronique', lastName: 'Denechaud-Lafond', emailAddress: 'veronique.denechaud-lafond@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'STCHAMBE', emailAddress: 'steeve.chamberland@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'ANGUDUPA', emailAddress: 'anusha.g.gudupally@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'SOKAUSHI', emailAddress: 'sohit.kaushik@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'KICHINTA', emailAddress: 'kiran.chandra.chintakindi@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'SAVGARG', emailAddress: 'savi.garg@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'SUDASARI', emailAddress: 'sudheer.dasari@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'NGAGO', emailAddress: 'nelson.gago@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'PGAJJELA', emailAddress: 'prashanth.gajjela@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'GPICARD', emailAddress: 'guy.picard@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'BRPRASAD', firstName: 'B', lastName: 'Prasad', displayName: 'Prasad', fullName: 'Prasad', emailAddress: 'b.prasad@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'SILABARR', emailAddress: 'simon.labarre@oracle.com', flags: _flags.Internal });
    _addUser({ globalId: 'JMUHIMPU', firstName: 'Joel', lastName: 'Muhimpundu', emailAddress: 'joel.muhimpundu@oracle.com', flags: _flags.Internal });



    Oracle.Logger.logDebug("Users initialized", { byGlobalId: _userByGlobalId, byEmailAddress: _userByEmailAddress });

    const _compareUser = function (a, b) {
        return a.getSortString().localeCompare(b.getSortString());
    }

    Oracle.addKnownClass("User", _userClass, (a, b) => a.getSortString().localeCompare(b.getSortString()), (a) => a.getSortString());

    const _userFormater = function (value, settings) {
        let result = null;
        if (value) {
            if (settings.isHeader) {
                result = value.fullName;
            }
            else {
                if (value.displayName) {
                    result = value.displayName;
                }
                else if (value.globalId) {
                    result = value.globalId
                }
            }
            if (result === null) {
                result = "Unknown";
            }
        }
        return result;
    };
    Oracle.Formating.addFormater("User", null, Oracle.KnownClasses.User, _userFormater);

    Oracle.Controls.Themes.addStaticCSSRule('.oracle-user { }');
    Oracle.Controls.Themes.addStaticCSSRule('.oracle-user.internal { font-weight:600;  }');
    Oracle.Controls.Themes.addStaticCSSRule('.oracle-user.group { color: var(--controlTextColorLighten4); }');

    Oracle.HTML.addFormater("User", null, Oracle.KnownClasses.User, (value, settings) => {
        if (value) {
            const span = $("<span class='oracle-user'>");
            if (value.globalId) {
                span.attr("data-user-id", value.globalId);
            }
            if (value.emailAddress) {
                span.attr("data-user-email-address", value.emailAddress);
            }
            if (settings.isHeader !== true) {
                if ((value.flags & Oracle.Users.Flags.Internal) === Oracle.Users.Flags.Internal) {
                    span.addClass("internal");
                }
                if ((value.flags & Oracle.Users.Flags.Group) === Oracle.Users.Flags.Group) {
                    span.addClass("group");
                }
            }
            span.text(_userFormater(value, settings));
            return span;
        }
        else {
            return null;
        }
    });

    _initialized = true;
    return parent;
}(Oracle));
