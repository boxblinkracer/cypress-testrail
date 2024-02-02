const CypressStatusConverter = require('../../../src/services/CypressStatusConverter');

const converter = new CypressStatusConverter(1, 5, 2);

test('Status PASSED is correctly converted', () => {
    const statusID = converter.convertToTestRail('passed');
    expect(statusID).toBe(1);
});

test('Status FAILED is correctly converted', () => {
    const statusID = converter.convertToTestRail('failed');
    expect(statusID).toBe(5);
});

test('Status PENDING is correctly converted', () => {
    const statusID = converter.convertToTestRail('pending');
    expect(statusID).toBe(2);
});

test('Status UNKNOWN leads to negative number', () => {
    const statusID = converter.convertToTestRail('abc');
    expect(statusID).toBe(-1);
});
