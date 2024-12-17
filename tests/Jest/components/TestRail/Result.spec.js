const Result = require('../../../../src/components/TestRail/Result');

test('caseId is correctly assigned', () => {
    const result = new Result('C123', 1, 'this is a test');
    expect(result.getCaseId()).toBe('C123');
});

test('status is correctly assigned', () => {
    const result = new Result('C123', 1, 'this is a test');
    expect(result.getStatusId()).toBe(1);
});

test('comment is correctly assigned', () => {
    const result = new Result('C123', 1, 'this is a test');
    expect(result.getComment()).toBe('this is a test');
});

describe('Elapsed Time', () => {
    test('Elapsed time is correctly converted from MS to S', () => {
        const result = new Result('C123', 1, 'this is a test', 15000);

        expect(result.hasElapsedTime()).toBe(true);
        expect(result.getElapsed()).toBe('15s');
    });

    test('Elapsed time is 0 with value 0', () => {
        const result = new Result('C123', 1, 'this is a test', 0);

        expect(result.hasElapsedTime()).toBe(false);
        expect(result.getElapsed()).toBe('0s');
    });

    test('Elapsed time is 0 with empty string', () => {
        const result = new Result('C123', 1, 'this is a test', '');

        expect(result.hasElapsedTime()).toBe(false);
        expect(result.getElapsed()).toBe('0s');
    });

    test('Elapsed time is 0 with NULL', () => {
        const result = new Result('C123', 1, 'this is a test', null);

        expect(result.hasElapsedTime()).toBe(false);
        expect(result.getElapsed()).toBe('0s');
    });

    test('Elapsed time is 0 with undefined', () => {
        const result = new Result('C123', 1, 'this is a test', undefined);

        expect(result.hasElapsedTime()).toBe(false);
        expect(result.getElapsed()).toBe('0s');
    });
});

test('Attachments are empty if not assigned', () => {
    const result = new Result('C123', 1, 'this is a test', 15000);
    expect(result.getAttachmentPaths().length).toBe(0);
});

test('Attachments are correctly assigned', () => {
    const result = new Result('C123', 1, 'this is a test', 15000, ['path1', 'path2']);

    expect(result.getAttachmentPaths().length).toBe(2);
    expect(result.getAttachmentPaths()[0]).toBe('path1');
    expect(result.getAttachmentPaths()[1]).toBe('path2');
});
