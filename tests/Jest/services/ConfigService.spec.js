import ConfigService from "../../../src/services/ConfigService";


test('undefined config returns default values', () => {
    const config = new ConfigService(undefined);
    expect(config.getRunId()).toBe('');
});

test('null config returns default values', () => {
    const config = new ConfigService(null);
    expect(config.getRunId()).toBe('');
});

test('empty config returns default values', () => {
    const config = new ConfigService({});
    expect(config.getRunId()).toBe('');
});

test('runId is correctly read', () => {
    const config = new ConfigService(
            {
                'runId': 'R123',
            }
        )
    ;
    expect(config.getRunId()).toBe('R123');
});

test('domain is correctly read', () => {
    const config = new ConfigService(
            {
                'domain': 'my-domain',
            }
        )
    ;
    expect(config.getDomain()).toBe('my-domain');
});

test('username is correctly read', () => {
    const config = new ConfigService(
            {
                'username': 'user123',
            }
        )
    ;
    expect(config.getUsername()).toBe('user123');
});

test('password is correctly read', () => {
    const config = new ConfigService(
            {
                'password': 'P123',
            }
        )
    ;
    expect(config.getPassword()).toBe('P123');
});
