# Changelog

All notable changes to this project will be documented in this file.

## [2.3.1]

- Fixed problem with "ColoredConsole.debugg" is not a function in Create-TestRun mode. it should be debug, and not debugg


## [2.3.0]

### Added

- It's now possible to add multiple case ids to a test. Just do it like this "C1 C2 C3: my description of the test".
- Added new colored console outputs for successful or failed API calls.
- Improve the output of failed API calls to TestRail. The error message is now extracted and shown in a more convenient way.

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
- Add option to set a custom comment that is passed on to the result in TestRail. You can use this to describe your AUT version, commit hash or more.

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
