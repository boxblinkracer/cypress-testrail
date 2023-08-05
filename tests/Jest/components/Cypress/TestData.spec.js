import TestData from '../../../../src/components/Cypress/TestData';


test('Test is passing if no error exists', () => {
    const result = new TestData({});
    expect(result.isPassed()).toBe(true);
});

test('Test is not passing if error exists', () => {
    const result = new TestData({
        'displayError': 'Error Message ABC',
    });
    expect(result.isPassed()).toBe(false);
});

test('Error Message is correctly read', () => {
    const result = new TestData({
        'displayError': 'Error Message ABC',
    });
    expect(result.getError()).toBe('Error Message ABC');
});

test('Error message is empty if test is passing', () => {
    const result = new TestData({});
    expect(result.getError()).toBe('');
});


test('Error Message that is NULL should be skipped', () => {
    const result = new TestData({
        'displayError': null,
    });
    expect(result.getError()).toBe('');
});

test('Last Title is correctly read', () => {
    const result = new TestData({
        'title': [
            'first',
            'second',
            'third',
        ]
    });
    expect(result.getTitle()).toBe('third');
});

test('Default title should exist if not found', () => {
    const result = new TestData({});
    expect(result.getTitle()).toBe('Title not found');
});

test('Duration is correctly summed up from attempts', () => {
    const result = new TestData({
        'attempts': [
            {
                'wallClockDuration': 5,
            },
            {
                'wallClockDuration': 10,
            }
        ]
    });
    expect(result.getDurationMS()).toBe(15);
});

test('Missing attempts lead to a duration of 0', () => {
    const result = new TestData({});
    expect(result.getDurationMS()).toBe(0);
});

test('State is correctly read', () => {
    const result = new TestData({
        'state': 'passed',
    });
    expect(result.getState()).toBe('passed');
});

test('isFailed is true with state failed', () => {
    const result = new TestData({
        'state': 'failed',
    });
    expect(result.isFailed()).toBe(true);
});

test('isFailed is false with state passed', () => {
    const result = new TestData({
        'state': 'passed',
    });
    expect(result.isFailed()).toBe(false);
});

test('isSkipped is true with state pending', () => {
    const result = new TestData({
        'state': 'pending',
    });
    expect(result.isSkipped()).toBe(true);
});

test('isSkipped is false with state passed', () => {
    const result = new TestData({
        'state': 'passed',
    });
    expect(result.isSkipped()).toBe(false);
});
