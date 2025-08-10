# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v1.0.0...v1.1.0) (2025-08-10)

### ✨ Features

* **Horizontal scrolling support** - Major new feature!
  - `showLeft` and `showRight` properties in `FadeState` type
  - `leftGradient` and `rightGradient` options for horizontal fade styling
  - `getOverlayStyle()` now accepts `'left'` and `'right'` positions
  - Full support for horizontal carousels, sliders, and scrollable content
* Enhanced TypeScript definitions for the new horizontal scroll API
* Comprehensive test coverage for horizontal scroll functionality
* Updated documentation with horizontal scrolling examples

### 🔄 Changed

* **BREAKING**: `FadeState` type now includes `showLeft` and `showRight` properties
* **BREAKING**: `getOverlayStyle()` function signature expanded to include `'left' | 'right'` positions
* Enhanced `computeFadeState` function to calculate horizontal scroll positions
* Updated hook to measure and track both vertical and horizontal scroll states

### 📚 Documentation

* Fixed package name from `use-scroll-fades` to `@gboue/use-scroll-fades` in all examples
* Added comprehensive horizontal scrolling examples and use cases
* Updated API documentation with new options and function signatures

---

## 1.0.0 (2025-08-09)

### Features

* initial release of use-scroll-fades hook with smooth animations ([a9f7d0f](https://github.com/cosmicThreePointO/use-scroll-fades/commit/a9f7d0f6a89c06d087dd33f58b0c93cb1b8f6831))
