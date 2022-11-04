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
