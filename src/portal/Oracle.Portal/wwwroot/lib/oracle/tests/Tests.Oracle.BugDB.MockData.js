'use strict';

Oracle.Tests.registerMockData('Oracle.BugDB.Bugs',
    {
        1: new Oracle.BugDB.Bug(
            {
                number: 1,
                component: 'HIRING',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'LDEVIGNE' }),
                subject: 'Bug #1 subject',
                severity: 2,
                status: 11,
                tags: [Oracle.BugDB.Tag.REGRN.name, Oracle.BugDB.Tag.P1.name, Oracle.BugDB.Tag.CUSTOMER_IMPACT.name],
                customer: 'Zooktel',
                fixEta: null,
                dateReported: new Date('01-JUN-2021'),
            }),
        2: new Oracle.BugDB.Bug(
            {
                number: 2,
                component: 'HIRING',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'VHAMEL' }),
                subject: 'Bug #2 subject',
                severity: 1,
                status: 80,
                tags: [Oracle.BugDB.Tag.QABLK.name, Oracle.BugDB.Tag.HCMBRONZE.name],
                customer: null,
                fixEta: new Date('23-JUN-2021'),
                dateReported: new Date('10-JUN-2021'),
            }),
        3: new Oracle.BugDB.Bug(
            {
                number: 3,
                component: 'LIFECYCLE',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'LDEVIGNE' }),
                subject: 'Bug #3 subject',
                severity: 4,
                status: 11,
                tags: [Oracle.BugDB.Tag.QABLK.name, Oracle.BugDB.Tag.HCMSILVER.name, Oracle.BugDB.Tag.P1.name],
                customer: 'Oracle',
                fixEta: new Date('10-JUN-2021'),
                dateReported: new Date('05-JUN-2021'),
            }),
        4: new Oracle.BugDB.Bug(
            {
                number: 4,
                component: 'HIRING',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'VDENECHA' }),
                subject: 'Bug #4 subject',
                severity: 4,
                status: 11,
                tags: [Oracle.BugDB.Tag.HCMBRONZE.name, Oracle.BugDB.Tag.P1.name],
                customer: 'Oracle',
                fixEta: new Date('25-JUN-2021'),
                dateReported: new Date('15-JUN-2021'),
            }),
        5: new Oracle.BugDB.Bug(
            {
                number: 5,
                component: 'OPPTMKT',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'NGAGO' }),
                subject: 'Bug #5 subject',
                severity: 4,
                status: 11,
                tags: [Oracle.BugDB.Tag.HCMBRONZE.name],
                customer: null,
                fixEta: new Date('30-JUN-2021'),
                dateReported: new Date('30-JUN-2021'),
            })
    }
);
