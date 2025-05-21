# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - RC

### Breaking changes

- (#10) Remove one-webcrypto dependency, now using native Web Crypto API
  drop support for Node.js 18 and below

## [3.1.0] - 2024-11-16

- (#7) Updated outdated dependencies, added examples to test esm/cjs imports.
- (#6) Fixed types export for ESNext target.

## [3.0.2] - 2024-05-17

- Add main field to package.json

## [3.0.1] - 2023-12-26

- Add test to improve npm page code quality...

## [3.0.0] - 2023-12-24

- Drop support for node16
- Update outdated packages

## [2.0.0] - 2022-06-06

- This major release has focus on browser support. The library has been rewritten to standard JavaScript API, Web Crypto and TypedArrays.

### Major changes

- `calculate` function returns Promise<Uint8Array>
