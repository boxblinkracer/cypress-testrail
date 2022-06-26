import TestData from "../../../../src/components/Cypress/TestData";


test('Test is passing if no error exists', () => {
    const result = new TestData({});
    expect(result.isPassed()).toBe(true);
});

test('Test is not passing if error exists', () => {
    const result = new TestData({
        'err': {
            'message': 'Error Message ABC',
        }
    });
    expect(result.isPassed()).toBe(false);
});


test('Error Message is correctly read', () => {
    const result = new TestData({
        'err': {
            'message': 'Error Message ABC',
        }
    });
    expect(result.getError()).toBe('Error Message ABC');
});

test('Error message is empty if test is passing', () => {
    const result = new TestData({});
    expect(result.getError()).toBe('');
});
