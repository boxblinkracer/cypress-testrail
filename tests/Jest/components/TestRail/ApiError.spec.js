const ApiError = require('../../../../src/components/TestRail/ApiError');

describe('empty errors', () => {
    test('ApiError data for NULL error', () => {
        const error = new ApiError(null);

        expect(error.getStatusCode()).toBe(0);
        expect(error.getStatusText()).toBe('No response from TestRail');
        expect(error.getErrorText()).toBe('No response from TestRail');
    });

    test('ApiError data for undefined error', () => {
        const error = new ApiError(undefined);

        expect(error.getStatusCode()).toBe(0);
        expect(error.getStatusText()).toBe('No response from TestRail');
        expect(error.getErrorText()).toBe('No response from TestRail');
    });

    test('ApiError data for NULL error', () => {
        const data = { response: null };
        const error = new ApiError(data);

        expect(error.getStatusCode()).toBe(0);
        expect(error.getStatusText()).toBe('No response from TestRail');
        expect(error.getErrorText()).toBe('No response from TestRail');
    });

    test('ApiError data for undefined error', () => {
        const data = { response: undefined };
        const error = new ApiError(data);

        expect(error.getStatusCode()).toBe(0);
        expect(error.getStatusText()).toBe('No response from TestRail');
        expect(error.getErrorText()).toBe('No response from TestRail');
    });
});

describe('existing errors', () => {
    test('ApiError with correct data', () => {
        const data = {
            response: {
                status: 404,
                statusText: 'Not Found',
                data: {
                    error: 'Our error',
                },
            },
        };

        const error = new ApiError(data);

        expect(error.getStatusCode()).toBe(404);
        expect(error.getStatusText()).toBe('Not Found');
        expect(error.getErrorText()).toBe('Our error');
    });

    test('ApiError with invalid data', () => {
        const data = {
            response: {},
        };

        const error = new ApiError(data);

        expect(error.getStatusCode()).toBe(0);
        expect(error.getStatusText()).toBe('Missing Status Text');
        expect(error.getErrorText()).toBe('Missing Error');
    });
});
