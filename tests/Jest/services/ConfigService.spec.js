const ConfigService = require('../../../src/services/Config/ConfigService');

describe('ConfigService', () => {
    beforeEach(() => {
        process.env = [];
    });

    describe('TestRail Domain', () => {
        describe('.env file', () => {
            test('TestRailDomain from .env file with NULL config', () => {
                const config = new ConfigService(null);
                expect(config.getDomain()).toBe('');
            });

            test('TestRailDomain from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        domain: 'my-domain',
                    },
                });
                expect(config.getDomain()).toBe('my-domain');
            });

            test('TestRailDomain from .env file with NULL domain', () => {
                const config = new ConfigService({
                    testrail: {
                        domain: null,
                    },
                });
                expect(config.getDomain()).toBe('');
            });

            test('TestRailDomain from .env file not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getDomain()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('TestRailDomain from ENV', () => {
                const config = new ConfigService({
                    TESTRAIL_DOMAIN: 'my-domain',
                });
                expect(config.getDomain()).toBe('my-domain');
            });
        });

        describe('process.env', () => {
            test('TestRailDomain from process.env', () => {
                process.env.TESTRAIL_DOMAIN = 'my-domain';
                const config = new ConfigService({});
                expect(config.getDomain()).toBe('my-domain');
            });
        });

        test('Leading http:// is removed from TestRail domain', () => {
            const config = new ConfigService({
                TESTRAIL_DOMAIN: 'http://my-domain',
            });
            expect(config.getDomain()).toBe('my-domain');
        });

        test('Leading https:// is removed from TestRail domain', () => {
            const config = new ConfigService({
                TESTRAIL_DOMAIN: 'https://my-domain',
            });
            expect(config.getDomain()).toBe('my-domain');
        });
    });

    describe('TestRail Username', () => {
        describe('.env file', () => {
            test('TestRailUsername from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        username: 'user123',
                    },
                });
                expect(config.getUsername()).toBe('user123');
            });

            test('TestRailUsername from ENV with NULL config', () => {
                const config = new ConfigService(null);
                expect(config.getUsername()).toBe('');
            });

            test('TestRailUsername from .env file not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getUsername()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('TestRailUsername from ENV', () => {
                const config = new ConfigService({
                    TESTRAIL_USERNAME: 'user123',
                });
                expect(config.getUsername()).toBe('user123');
            });
        });

        describe('process.env', () => {
            test('TestRailUsername from process.env', () => {
                process.env.TESTRAIL_USERNAME = 'user123';
                const config = new ConfigService({});
                expect(config.getUsername()).toBe('user123');
            });
        });
    });

    describe('TestRail Password', () => {
        describe('.env file', () => {
            test('TestRailPassword from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        password: 'P123',
                    },
                });
                expect(config.getPassword()).toBe('P123');
            });

            test('TestRailPassword from .env file with NULL config', () => {
                const config = new ConfigService(null);
                expect(config.getPassword()).toBe('');
            });

            test('TestRailPassword from .env file not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getPassword()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('TestRailPassword from ENV', () => {
                const config = new ConfigService({
                    TESTRAIL_PASSWORD: 'P123',
                });
                expect(config.getPassword()).toBe('P123');
            });
        });

        describe('process.env', () => {
            test('TestRailPassword from process.env', () => {
                process.env.TESTRAIL_PASSWORD = 'P123';
                const config = new ConfigService({});
                expect(config.getPassword()).toBe('P123');
            });
        });
    });

    describe('ProjectID', () => {
        describe('.env file', () => {
            test('ProjectID from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        projectId: '123',
                    },
                });
                expect(config.getProjectId()).toBe('123');
            });

            test('ProjectID from .env file with leading P', () => {
                const config = new ConfigService({
                    testrail: {
                        projectId: 'P123',
                    },
                });
                expect(config.getProjectId()).toBe('123');
            });

            test('ProjectID from .env file with whitespaces', () => {
                const config = new ConfigService({
                    testrail: {
                        projectId: ' 123 ',
                    },
                });
                expect(config.getProjectId()).toBe('123');
            });

            test('ProjectID from .env as INT', () => {
                const config = new ConfigService({
                    testrail: {
                        projectId: 123,
                    },
                });
                expect(config.getProjectId()).toBe('123');
            });

            test('ProjectID from .env is not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getProjectId()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('ProjectID from ENV variable as INT', () => {
                const config = new ConfigService({
                    TESTRAIL_PROJECT_ID: 45,
                });
                expect(config.getProjectId()).toBe('45');
            });
        });

        describe('process.env', () => {
            test('ProjectID from process.env', () => {
                process.env.TESTRAIL_PROJECT_ID = 45;
                const config = new ConfigService({});
                expect(config.getProjectId()).toBe('45');
            });
        });
    });

    describe('MilestoneID', () => {
        describe('.env file', () => {
            test('MilestoneID from .env', () => {
                const config = new ConfigService({
                    testrail: {
                        milestoneId: '123',
                    },
                });
                expect(config.getMilestoneId()).toBe('123');
            });

            test('MilestoneID from .env with leading M', () => {
                const config = new ConfigService({
                    testrail: {
                        milestoneId: 'M123',
                    },
                });
                expect(config.getMilestoneId()).toBe('123');
            });

            test('MilestoneID from .env with whitespaces', () => {
                const config = new ConfigService({
                    testrail: {
                        milestoneId: ' 123 ',
                    },
                });
                expect(config.getMilestoneId()).toBe('123');
            });

            test('MilestoneID from .env as INT', () => {
                const config = new ConfigService({
                    testrail: {
                        milestoneId: 123,
                    },
                });
                expect(config.getMilestoneId()).toBe('123');
            });

            test('MilestoneID from .env not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getMilestoneId()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('MilestoneID from ENV variable as INT', () => {
                const config = new ConfigService({
                    TESTRAIL_MILESTONE_ID: 45,
                });
                expect(config.getMilestoneId()).toBe('45');
            });
        });

        describe('process.env', () => {
            test('MilestoneID from process.env', () => {
                process.env.TESTRAIL_MILESTONE_ID = 45;
                const config = new ConfigService({});
                expect(config.getMilestoneId()).toBe('45');
            });
        });
    });

    describe('SuiteID', () => {
        describe('.env file', () => {
            test('SuiteID from .env', () => {
                const config = new ConfigService({
                    testrail: {
                        suiteId: '123',
                    },
                });
                expect(config.getSuiteId()).toBe('123');
            });

            test('SuiteID from .env with leading S', () => {
                const config = new ConfigService({
                    testrail: {
                        suiteId: 'S123',
                    },
                });
                expect(config.getSuiteId()).toBe('123');
            });

            test('SuiteID from .env with whitespaces', () => {
                const config = new ConfigService({
                    testrail: {
                        suiteId: ' 123 ',
                    },
                });
                expect(config.getSuiteId()).toBe('123');
            });

            test('SuiteID from .env as INT', () => {
                const config = new ConfigService({
                    testrail: {
                        suiteId: 123,
                    },
                });
                expect(config.getSuiteId()).toBe('123');
            });

            test('SuiteID from .env not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getSuiteId()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('SuiteID from ENV variable as INT', () => {
                const config = new ConfigService({
                    TESTRAIL_SUITE_ID: 45,
                });
                expect(config.getSuiteId()).toBe('45');
            });
        });

        describe('process.env', () => {
            test('SuiteID from process.env', () => {
                process.env.TESTRAIL_SUITE_ID = 45;
                const config = new ConfigService({});
                expect(config.getSuiteId()).toBe('45');
            });
        });
    });

    describe('RunID', () => {
        describe('.env file', () => {
            test('RunID from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        runId: '123',
                    },
                });
                expect(config.getRunId()).toBe('123');
            });

            test('RunID from .env file with leading R', () => {
                const config = new ConfigService({
                    testrail: {
                        runId: 'R123',
                    },
                });
                expect(config.getRunId()).toBe('123');
            });

            test('RunID from .env file with whitespaces', () => {
                const config = new ConfigService({
                    testrail: {
                        runId: ' 123 ',
                    },
                });
                expect(config.getRunId()).toBe('123');
            });

            test('RunID from .env as INT', () => {
                const config = new ConfigService({
                    testrail: {
                        runId: 123,
                    },
                });
                expect(config.getRunId()).toBe('123');
            });

            test('RunID from .env not existing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getRunId()).toBe('');
            });
        });

        describe('ENV variable', () => {
            test('RunID from ENV variable as INT', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_ID: 455,
                });
                expect(config.getRunId()).toBe('455');
            });
        });

        describe('process.env', () => {
            test('RunID from process.env', () => {
                process.env.TESTRAIL_RUN_ID = 455;
                const config = new ConfigService({});
                expect(config.getRunId()).toBe('455');
            });
        });
    });

    describe('RunIDs', () => {
        describe('.env file', () => {
            test('RunIDs from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        runIds: ['123', '456'],
                    },
                });
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });

            test('RunIDs from .env file with leading R', () => {
                const config = new ConfigService({
                    testrail: {
                        runIds: ['R123', 'R456'],
                    },
                });
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });

            test('RunIDs from .env file with whitespaces', () => {
                const config = new ConfigService({
                    testrail: {
                        runIds: [' 123 ', ' 456 '],
                    },
                });
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });

            test('RunIDs from .env as INT', () => {
                const config = new ConfigService({
                    testrail: {
                        runIds: [123, 456],
                    },
                });
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });

            test('RunIDs from .env if NULL', () => {
                const config = new ConfigService({
                    testrail: {
                        runIds: null,
                    },
                });
                expect(config.getRunIds().length).toBe(0);
            });

            test('RunIDs from .env if missing', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.getRunIds().length).toBe(0);
            });
        });

        describe('ENV variable', () => {
            test('RunIDs from ENV variable as STRING', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_IDS: '123,456',
                });
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });

            test('RunIDs from ENV variable as STRING with single entry', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_IDS: '123',
                });
                expect(config.getRunIds().length).toBe(1);
                expect(config.getRunIds()[0]).toBe('123');
            });

            test('RunIDs from ENV variable with NULL', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_IDS: null,
                });
                expect(config.getRunIds().length).toBe(0);
            });

            test('RunIDs from ENV variable if not provided', () => {
                const config = new ConfigService({});
                expect(config.getRunIds().length).toBe(0);
            });
        });

        describe('process.env', () => {
            test('RunIDs from process.env', () => {
                process.env.TESTRAIL_RUN_IDS = '123,456';
                const config = new ConfigService({});
                expect(config.getRunIds().length).toBe(2);
                expect(config.getRunIds()[0]).toBe('123');
                expect(config.getRunIds()[1]).toBe('456');
            });
        });
    });

    describe('RunName', () => {
        describe('.env file', () => {
            test('RunName from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        runName: 'P123',
                    },
                });
                expect(config.getRunName()).toBe('P123');
            });
        });

        describe('ENV variable', () => {
            test('RunName from ENV', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_NAME: 'P123',
                });
                expect(config.getRunName()).toBe('P123');
            });
        });

        describe('process.env', () => {
            test('RunName from process.env', () => {
                process.env.TESTRAIL_RUN_NAME = 'P123';
                const config = new ConfigService({});
                expect(config.getRunName()).toBe('P123');
            });
        });
    });

    describe('RunIncludeAll', () => {
        describe('.env file', () => {
            test('RunIncludeAll from .env ON', () => {
                const config = new ConfigService({
                    testrail: {
                        runIncludeAll: true,
                    },
                });
                expect(config.includeAllCasesDuringCreation()).toBe(true);
            });

            test('RunIncludeAll from .env OFF', () => {
                const config = new ConfigService({
                    testrail: {
                        runIncludeAll: false,
                    },
                });
                expect(config.includeAllCasesDuringCreation()).toBe(false);
            });

            test('RunIncludeAll from .env default is OFF', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.includeAllCasesDuringCreation()).toBe(false);
            });
        });

        describe('ENV variable', () => {
            test('RunIncludeAll from ENV variable', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_INCLUDE_ALL: true,
                });
                expect(config.includeAllCasesDuringCreation()).toBe(true);
            });
        });

        describe('process.env', () => {
            test('RunIncludeAll from process.env', () => {
                process.env.TESTRAIL_RUN_INCLUDE_ALL = true;
                const config = new ConfigService({});
                expect(config.includeAllCasesDuringCreation()).toBe(true);
            });
        });
    });

    describe('CloseRun', () => {
        describe('.env file', () => {
            test('CloseRun from .env file', () => {
                const config = new ConfigService({
                    testrail: {
                        closeRun: true,
                    },
                });
                expect(config.shouldCloseRun()).toBe(true);
            });
        });

        describe('ENV variable', () => {
            test('CloseRun from ENV', () => {
                const config = new ConfigService({
                    TESTRAIL_RUN_CLOSE: true,
                });
                expect(config.shouldCloseRun()).toBe(true);
            });
        });

        test('closeRun default is FALSE', () => {
            const config = new ConfigService({});
            expect(config.shouldCloseRun()).toBe(false);
        });

        describe('process.env', () => {
            test('closeRun from process.env', () => {
                process.env.TESTRAIL_RUN_CLOSE = true;
                const config = new ConfigService({});
                expect(config.shouldCloseRun()).toBe(true);
            });
        });
    });

    describe('Screenshots', () => {
        describe('.env file', () => {
            test('Screenshots from .env ON', () => {
                const config = new ConfigService({
                    testrail: {
                        screenshots: true,
                    },
                });
                expect(config.isScreenshotsEnabled()).toBe(true);
            });

            test('Screenshots from .env OFF', () => {
                const config = new ConfigService({
                    testrail: {
                        screenshots: false,
                    },
                });
                expect(config.isScreenshotsEnabled()).toBe(false);
            });

            test('Screenshots from .env default is OFF', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.isScreenshotsEnabled()).toBe(false);
            });
        });

        describe('ENV variable', () => {
            test('Screenshots from ENV variable', () => {
                const config = new ConfigService({
                    TESTRAIL_SCREENSHOTS: true,
                });
                expect(config.isScreenshotsEnabled()).toBe(true);
            });
        });

        describe('process.env', () => {
            test('Screenshots from process.env', () => {
                process.env.TESTRAIL_SCREENSHOTS = true;
                const config = new ConfigService({});
                expect(config.isScreenshotsEnabled()).toBe(true);
            });
        });
    });

    describe('Screenshots All', () => {
        describe('.env file', () => {
            test('ScreenshotsAll from .env ON', () => {
                const config = new ConfigService({
                    testrail: {
                        screenshotsAll: true,
                    },
                });
                expect(config.includeAllFailedScreenshots()).toBe(true);
            });

            test('ScreenshotsAll from .env OFF', () => {
                const config = new ConfigService({
                    testrail: {
                        screenshotsAll: false,
                    },
                });
                expect(config.includeAllFailedScreenshots()).toBe(false);
            });

            test('ScreenshotsAll from .env default is OFF', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.includeAllFailedScreenshots()).toBe(false);
            });
        });

        describe('ENV variable', () => {
            test('ScreenshotsAll from ENV variable', () => {
                const config = new ConfigService({
                    TESTRAIL_SCREENSHOTS_ALL: true,
                });
                expect(config.includeAllFailedScreenshots()).toBe(true);
            });
        });

        describe('process.env', () => {
            test('ScreenshotsAll from process.env', () => {
                process.env.TESTRAIL_SCREENSHOTS_ALL = true;
                const config = new ConfigService({});
                expect(config.includeAllFailedScreenshots()).toBe(true);
            });
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

    describe('hasRunID', () => {
        test('hasRunID is true on single runs', () => {
            const config = new ConfigService({
                testrail: {
                    runId: '123',
                },
            });
            expect(config.hasRunID()).toBe(true);
        });

        test('hasRunID is true on multiple runs', () => {
            const config = new ConfigService({
                testrail: {
                    runIds: ['123', '456'],
                },
            });
            expect(config.hasRunID()).toBe(true);
        });

        test('hasRunID is false if no runs provided', () => {
            const config = new ConfigService(null);
            expect(config.hasRunID()).toBe(false);
        });
    });

    describe('ignorePendingTests', () => {
        describe('.env file', () => {
            test('ignorePendingTests from .env ON', () => {
                const config = new ConfigService({
                    testrail: {
                        ignorePending: true,
                    },
                });
                expect(config.ignorePendingCypressTests()).toBe(true);
            });

            test('ignorePendingTests from .env OFF', () => {
                const config = new ConfigService({
                    testrail: {
                        ignorePending: false,
                    },
                });
                expect(config.ignorePendingCypressTests()).toBe(false);
            });

            test('ignorePendingTests from .env default is ON', () => {
                const config = new ConfigService({
                    testrail: {},
                });
                expect(config.ignorePendingCypressTests()).toBe(true);
            });
        });

        describe('ENV variable', () => {
            test('ignorePendingTests from ENV variable', () => {
                const config = new ConfigService({
                    TESTRAIL_IGNORE_PENDING: true,
                });
                expect(config.ignorePendingCypressTests()).toBe(true);
            });
        });

        describe('process.env', () => {
            test('ignorePendingTests from process.env', () => {
                process.env.TESTRAIL_IGNORE_PENDING = true;
                const config = new ConfigService({});
                expect(config.ignorePendingCypressTests()).toBe(true);
            });
        });
    });

    describe('isApiValid', () => {
        test('isApiValid is TRUE', () => {
            const config = new ConfigService({
                testrail: {
                    domain: 'my-domain',
                    username: 'user123',
                    password: 'P123',
                },
            });
            expect(config.isApiValid()).toBe(true);
        });

        test('isApiValid is false because of missing password', () => {
            const config = new ConfigService({
                testrail: {
                    domain: 'my-domain',
                    username: 'user123',
                },
            });
            expect(config.isApiValid()).toBe(false);
        });

        test('isApiValid is false because of missing username', () => {
            const config = new ConfigService({
                testrail: {
                    domain: 'my-domain',
                    password: 'P123',
                },
            });
            expect(config.isApiValid()).toBe(false);
        });

        test('isApiValid is false because of missing domain', () => {
            const config = new ConfigService({
                testrail: {
                    username: 'user123',
                    password: 'P123',
                },
            });
            expect(config.isApiValid()).toBe(false);
        });
    });

    test('getTestRailStatusPassed', () => {
        const config = new ConfigService(null);
        expect(config.getTestRailStatusPassed()).toBe(1);
    });

    test('getTestRailStatusSkipped', () => {
        const config = new ConfigService(null);
        expect(config.getTestRailStatusSkipped()).toBe(2);
    });

    test('getTestRailStatusFailed', () => {
        const config = new ConfigService(null);
        expect(config.getTestRailStatusFailed()).toBe(5);
    });
});
