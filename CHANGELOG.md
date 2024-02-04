# Changelog

All notable changes to this project will be documented in this file.

## [2.10.0]

### Added

- Added description to README how to use an **Api Key** instead of the user password.
- Added documentation on how to use **Cucumber** and **Gherkin documents** with the integration.
- Added support for **process.env** variables. All configuration settings will now also consider entries in process.env.
- Added new option to **ignore pending tests**. If ignored, these tests will not be sent to TestRail. Please see README for more.
- Added new **created_run.json** file that is created in "Create Run Mode". This allows to immediately read and use data of the created run in other steps of your CI pipeline, while Cypress is running.

### Fixed

- Fixed problem with wrong **elapsed_time**. When skipped tests were detected coming in Cypress v13, it led to a wrong calculation of the elapsed time.

## [2.9.0]

### Changed

- Use the Cypress **test title** instead of the plain "Tested by Cypress" in the TestRail comments (thx @vijigit)
- Updated **Axios** dependency to version ^1.6.2 (thx @MelaAxel)

### Fixed

- Fixed a broken **elapsedTime** error with Cypress v13 in combination with **undefined** values for the duration of
  tests.

## [2.8.2]

### Fixed

- Fixed broken *screenshots upload* in Cypress 13.

## [2.8.1]

### Fixed

- Fixed broken **elapsedTime** calculation with Cypress v13.

## [2.8.0]

### Added

- Skipped tests in Cypress will now be sent as "blocked" to TestRail (only in createTestRun mode).
- Add option to provide a list of TestRail RunIDs with **runIDs**. This will send all test results to all provided run
  IDs.

### Fixed

- Fixed crash with missing *browser* when running in UI mode with experimentalInteractiveRunEvents turned on.

## [2.7.1]

### Added

- Added better test case extraction by removing comma character, if accidentally existing (thx @asalgado87)
- Add new output, if the integration is not correctly configured.

## [2.7.0]

### Added

- Added new configuration **runIncludeAll** that automatically adds all test cases to test runs when creating dynamic
  runs. (thx @williamatpaper)
- Added new configuration **screenshotsAll** that sends all screenshots of all attempts of a failed test to TestRail. (
  thx @williamatpaper)
- The integration now also works if you have accidentally provided "http://" and "https://" within your TestRail domain.

## [2.6.0]

### Changed

- Results are now sent as "batch" request to TestRail at the end of the file. This safes API requests by only sending 1
  request for a spec file (excluding screenshot requests).
- Changed the output color of debug texts to gray.

## [2.5.0]

### Added

- Added new CLI Setup Wizard to build your configuration in an interactive way. (see README)
- The integration will now automatically send the screenshots to TestRail for every failed test. This is all
  automatically done as soon as the new variable is enabled (see README).
- Added option to provide optional "suiteId" when creating new runs. If you have a project with suites, this parameter
  is required.

### Changed

- new README with better instructions and overview

## [2.4.0]

### Changed

- Tests with status "pending" had been sent as "failed" to TestRail. These test results will now be skipped and not sent
  to TestRail.

### Fixed

- Improved error response handling from TestRail API. Some errors led to an "undefined reading 'status'" exception.
  There should still be no error, but now we should know better what happens.

## [2.3.1]

- Fixed problem with "ColoredConsole.debug" is not a function in Create-TestRun mode. it should be debug, and not debugg

## [2.3.0]

### Added

- It's now possible to add multiple case ids to a test. Just do it like this "C1 C2 C3: my description of the test".
- Added new colored console outputs for successful or failed API calls.
- Improve the output of failed API calls to TestRail. The error message is now extracted and shown in a more convenient
  way.

## [2.2.1]

### Fixed

- Fixed cast problem with string replace function when using CLI ENV variables with INT values.

## [2.2.0]

### Changed

- RunIDs can now also be provided with a leading "R" and spaces. The integration will automatically remove it.
- ProjectIDs can now also be provided with a leading "P" and spaces. The integration will automatically remove it.
- MilestoneIDs can now also be provided with a leading "M" and spaces. The integration will automatically remove it.

### Fixed

- Fixed problem with missing axio package when doing an installation from scratch

## [2.1.1]

### Changed

- Elapsed times with "0s" will not be sent anymore. TestRail doesn't like this.
- Changed runName placeholder from %datetime% to __datetime__ to support better usages with bash for CI pipelines

## [2.1.0]

### Added

- Add mode to create TestRuns inside TestRail with custom names, placeholders and more
- Added option to provide config data as Cypress ENV variables

## [2.0.0]

### Breaking Changes

We had to change the way how the integration is registered.
The new way allows to read additional Cypress events and gather information about browsers, versions and more.
Please see the UPGRADE.md file for more about this topic.

### Added

- Add collected data to TestRail result such as Cypress version, browser, baseURL, system and Spec file.
- Add option to set a custom comment that is passed on to the result in TestRail. You can use this to describe your AUT
  version, commit hash or more.

### Changed

- Changed the way how the integration is registered.
- TestRail results are now sent at the end of a spec file, and not directly after a single test anymore.

## [1.1.0]

### Added

- Add Cypress error message to result comment
- Add elapsed time to result

### Changed

- Result comment is now trimmed to keep it neat ;)
- Improved extraction of Case IDs in Cypress titles by adding a trim to the title.

## [1.0.0]

### Added

- Initial version of the Cypress TestRail Integration
