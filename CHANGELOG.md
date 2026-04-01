# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-04-01

### Changed
- Homebridge v2 compatible: replaced `.on('set', callback)` with `.onSet()` API
- Replaced deprecated `request` library with native `fetch` (Node.js 18+ built-in) — no external dependencies
- Updated `engines` to `^1.6.0 || ^2.0.0-beta.0` with Node.js 18/20/22 requirement
- Added `repository`, `bugs` and `homepage` fields so Config UI X shows changelog and release notes correctly

## [1.2.6] - 2026-03-28

### Fixed
- Added `config.schema.json` to fix "plugin alias could not be determined" error in Homebridge Config UI X.

## [1.2.5] - 2025

### Changed
- Universal status adjustment and stability improvements.

## [1.2.4] - 2025

### Changed
- Universal status adjustment.

## [1.2.3] - 2025

### Changed
- Universal status adjustment.

## [1.2.2] - 2025

### Changed
- Universal status adjustment.

## [1.1.12] - 2025

### Changed
- Universal status adjustment.

## [1.1.11] - 2025

### Changed
- Universal status adjustment.

## [1.1.10] - 2025

### Changed
- Universal status adjustment.

## [1.1.9] - 2025

### Changed
- Universal status adjustment.

## [1.1.8] - 2025

### Changed
- Universal status adjustment.

## [1.1.7] - 2025

### Changed
- Universal status adjustment.

## [1.1.6] - 2025

### Changed
- Universal status adjustment.

## [1.1.3] - 2025

### Added
- Auto-close after OPEN (3 seconds).

## [1.1.2] - 2025

### Fixed
- Fixed "Closing" stuck state → forced CLOSED.

## [1.1.1] - 2025

### Fixed
- Plugin alias alignment for Config UI X.

## [1.1.0] - 2025

### Added
- Inline Config UI X schema support.

## [1.0.9] - 2025

### Added
- Full `config.schema.json` support.
