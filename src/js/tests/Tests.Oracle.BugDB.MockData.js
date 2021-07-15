
// ---------------------------------------------------------------------------------------------------------------- //
// Mock Data
// ---------------------------------------------------------------------------------------------------------------- //

Oracle.Tests.addMockData('Oracle.BugDB.Bugs',
    {
        1: new Oracle.BugDB.Bug(
            {
                number: 1,
                component: 'HIRING',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'LDEVIGNE' }),
                subject: 'Bug #1 subject',
                severity: 2,
                status: 11,
                tags: ['TAG1', 'TAG2'],
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
                tags: ['TAG4', 'TAG2'],
                customer: null,
                fixEta: new Date('23-JUN-2021'),
                dateReported: new Date('10-JUN-2021'),
            }),
        3: new Oracle.BugDB.Bug(
            {
                number: 3,
                component: 'HIRING',
                assignee: Oracle.Users.getOrCreateUser({ globalId: 'LDEVIGNE' }),
                subject: 'Bug #3 subject',
                severity: 4,
                status: 11,
                tags: ['TAG1', 'TAG3'],
                customer: 'Oracle',
                fixEta: new Date('10-JUN-2021'),
                dateReported: new Date('05-JUN-2021'),
            })
    }
);
