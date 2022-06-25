import TestCaseParser from "../../../src/services/TestCaseParser";

const parser = new TestCaseParser();


test('case id can be successfully extracted', () => {
    const caseId = parser.searchCaseId('C123: This is a test');
    expect(caseId).toBe('123');
});

test('case id is empty if not existing', () => {
    const caseId = parser.searchCaseId('This is a test');
    expect(caseId).toBe('');
});

test('case id can be found if starting with space', () => {
    const caseId = parser.searchCaseId(' C123: This is a test');
    expect(caseId).toBe('123');
});