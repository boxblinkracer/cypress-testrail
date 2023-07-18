import Result from '../../../../src/components/TestRail/Result';


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

test('Elapsed time is correctly converted from MS to S', () => {
    const result = new Result('C123', 1, 'this is a test', 15000);
    expect(result.getElapsed()).toBe('15s');
});

test('Screenshots are empty if not assigned', () => {
    const result = new Result('C123', 1, 'this is a test', 15000);
    expect(result.getScreenshotPaths().length).toBe(0);
});

test('Screenshots are correctly assigned', () => {
    const result = new Result('C123', 1, 'this is a test', 15000, ['path1', 'path2']);

    expect(result.getScreenshotPaths().length).toBe(2);
    expect(result.getScreenshotPaths()[0]).toBe('path1');
    expect(result.getScreenshotPaths()[1]).toBe('path2');
});

