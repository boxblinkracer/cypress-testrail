const TestCaseParser = require('../../../src/services/TestCaseParser');

const parser = new TestCaseParser();

test('case id can be successfully extracted', () => {
    const result = parser.searchCaseId('C123: This is a test');
    expect(result.length).toBe(1);
    expect(result[0]).toBe('123');
});

test('case id is empty if not existing', () => {
    const result = parser.searchCaseId('This is a test');
    expect(result.length).toBe(0);
});

test('case id can be found if starting with space', () => {
    const result = parser.searchCaseId(' C123: This is a test');
    expect(result.length).toBe(1);
    expect(result[0]).toBe('123');
});

test('multiple case IDs can be found', () => {
    const result = parser.searchCaseId('C54 C22 C67: This is a test');
    expect(result.length).toBe(3);
    expect(result[0]).toBe('54');
    expect(result[1]).toBe('22');
    expect(result[2]).toBe('67');
});

test('multiple case IDs including invalid IDs can be found', () => {
    const result = parser.searchCaseId('C13 24 ab test C35: This is a test');
    expect(result.length).toBe(2);
    expect(result[0]).toBe('13');
    expect(result[1]).toBe('35');
});

test('remove commas if accidentally existing', () => {
    const result = parser.searchCaseId('C1234, C1235, C1236: test case example title');
    expect(result.length).toBe(3);
    expect(result[0]).toBe('1234');
    expect(result[1]).toBe('1235');
    expect(result[2]).toBe('1236');
});
