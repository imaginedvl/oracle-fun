
// ---------------------------------------------------------------------------------------------------------------- //
// Mock Data
// ---------------------------------------------------------------------------------------------------------------- //

Oracle.Tests.addMockData('Oracle.BugDB.Bugs', 
    [
        { 
            number: 1, 
            subject: 'Bug #1 subject', 
            severity: 2, 
            status: 11,
            tags: ['TAG1', 'TAG2'], 
            customer: 'Zooktel', 
            fixEta: new Date('23-JUN-2021'),
            dateReported: new Date('01-JUN-2021'),
        }
    ]
);
