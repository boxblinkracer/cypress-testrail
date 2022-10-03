import ConfigService from '../../../src/services/ConfigService';


describe('TestRail Domain', () => {

    describe('.env file', () => {

        test('TestRailDomain from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'domain': 'my-domain',
                }
            });
            expect(config.getDomain()).toBe('my-domain');
        });

    });

    describe('ENV variable', () => {

        test('TestRailDomain from ENV', () => {
            const config = new ConfigService({
                'TESTRAIL_DOMAIN': 'my-domain',
            });
            expect(config.getDomain()).toBe('my-domain');
        });

    });
});

describe('TestRail Username', () => {

    describe('.env file', () => {

        test('TestRailUsername from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'username': 'user123',
                }
            });
            expect(config.getUsername()).toBe('user123');
        });
    });

    describe('ENV variable', () => {

        test('TestRailUsername from ENV', () => {
            const config = new ConfigService({
                'TESTRAIL_USERNAME': 'user123',
            });
            expect(config.getUsername()).toBe('user123');
        });

    });
});

describe('TestRail Password', () => {

    describe('.env file', () => {

        test('TestRailPassword from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'password': 'P123',
                }
            });
            expect(config.getPassword()).toBe('P123');
        });
    });

    describe('ENV variable', () => {

        test('TestRailPassword from ENV', () => {
            const config = new ConfigService({
                'TESTRAIL_PASSWORD': 'P123',
            });
            expect(config.getPassword()).toBe('P123');
        });
    });
});

describe('ProjectID', () => {

    describe('.env file', () => {

        test('ProjectID from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'projectId': '123',
                }
            });
            expect(config.getProjectId()).toBe('123');
        });

        test('ProjectID from .env file with leading P', () => {
            const config = new ConfigService({
                'testrail': {
                    'projectId': 'P123',
                }
            });
            expect(config.getProjectId()).toBe('123');
        });

        test('ProjectID from .env file with whitespaces', () => {
            const config = new ConfigService({
                'testrail': {
                    'projectId': ' 123 ',
                }
            });
            expect(config.getProjectId()).toBe('123');
        });

        test('ProjectID from .env as INT', () => {
            const config = new ConfigService({
                'testrail': {
                    'projectId': 123,
                }
            });
            expect(config.getProjectId()).toBe('123');
        });


    });

    describe('ENV variable', () => {

        test('ProjectID from ENV variable as INT', () => {
            const config = new ConfigService({
                'TESTRAIL_PROJECT_ID': 45,
            });
            expect(config.getProjectId()).toBe('45');
        });
    });
});

describe('MilestoneID', () => {

    describe('.env file', () => {

        test('MilestoneID from .env', () => {
            const config = new ConfigService({
                'testrail': {
                    'milestoneId': 'P123',
                }
            });
            expect(config.getMilestoneId()).toBe('P123');
        });

        test('MilestoneID from .env with leading M', () => {
            const config = new ConfigService({
                'testrail': {
                    'milestoneId': 'M123',
                }
            });
            expect(config.getMilestoneId()).toBe('123');
        });

        test('MilestoneID from .env with whitespaces', () => {
            const config = new ConfigService({
                'testrail': {
                    'milestoneId': ' 123 ',
                }
            });
            expect(config.getMilestoneId()).toBe('123');
        });

        test('MilestoneID from .env as INT', () => {
            const config = new ConfigService({
                'testrail': {
                    'milestoneId': 123,
                }
            });
            expect(config.getMilestoneId()).toBe('123');
        });

    });

    describe('ENV variable', () => {

        test('MilestoneID from ENV variable as INT', () => {
            const config = new ConfigService({
                'TESTRAIL_MILESTONE_ID': 45,
            });
            expect(config.getMilestoneId()).toBe('45');
        });
    });
});

describe('RunID', () => {

    describe('.env file', () => {

        test('RunID from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'runId': '123',
                }
            });
            expect(config.getRunId()).toBe('123');
        });

        test('RunID from .env file with leading R', () => {
            const config = new ConfigService({
                'testrail': {
                    'runId': 'R123',
                }
            });
            expect(config.getRunId()).toBe('123');
        });

        test('RunID from .env file with whitespaces', () => {
            const config = new ConfigService({
                'testrail': {
                    'runId': ' 123 ',
                }
            });
            expect(config.getRunId()).toBe('123');
        });

        test('RunID from .env as INT', () => {
            const config = new ConfigService({
                'testrail': {
                    'runId': 123,
                }
            });
            expect(config.getRunId()).toBe('123');
        });
    });

    describe('ENV variable', () => {

        test('RunID from ENV variable as INT', () => {
            const config = new ConfigService({
                'TESTRAIL_RUN_ID': 455,
            });
            expect(config.getRunId()).toBe('455');
        });
    });
});

describe('RunName', () => {

    describe('.env file', () => {

        test('RunName from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'runName': 'P123',
                }
            });
            expect(config.getRunName()).toBe('P123');
        });
    });

    describe('ENV variable', () => {

        test('RunName from ENV', () => {
            const config = new ConfigService({
                'TESTRAIL_RUN_NAME': 'P123',
            });
            expect(config.getRunName()).toBe('P123');
        });
    });
});

describe('CloseRun', () => {

    describe('.env file', () => {

        test('CloseRun from .env file', () => {
            const config = new ConfigService({
                'testrail': {
                    'closeRun': true,
                }
            });
            expect(config.shouldCloseRun()).toBe(true);
        });
    });

    describe('ENV variable', () => {

        test('CloseRun from ENV', () => {
            const config = new ConfigService({
                'TESTRAIL_RUN_CLOSE': true,
            });
            expect(config.shouldCloseRun()).toBe(true);
        });
    });

    test('closeRun default is FALSE', () => {
        const config = new ConfigService({});
        expect(config.shouldCloseRun()).toBe(false);
    });
});

describe('Invalid Configurations', () => {

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
});
