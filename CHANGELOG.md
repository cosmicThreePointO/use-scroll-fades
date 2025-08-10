# [2.0.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v1.1.0...v2.0.0) (2025-08-10)


### Features

* revolutionary mask-image approach for true transparency ([760bc9f](https://github.com/cosmicThreePointO/use-scroll-fades/commit/760bc9f1d337d689ca09bd5c7e6b1b5d48fd5e33))
* revolutionary mask-image approach with true transparency ([5ac07f4](https://github.com/cosmicThreePointO/use-scroll-fades/commit/5ac07f462acbd24fd725d4aac096803623ab130e))


### BREAKING CHANGES

* getOverlayStyle() is now deprecated and returns empty styles. Use getContainerStyle() directly on your scrollable container instead.

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 🚀 Major Performance & Visual Improvements

- **Revolutionary mask-image approach**: Complete rewrite using CSS `mask-image` for true transparency
  - ✨ Works perfectly with any background (gradients, images, patterns)  
  - 🚀 Better performance - GPU-accelerated mask properties
  - 📐 Simpler markup - no overlay divs needed
  - 🎨 True transparency instead of layered gradients
- **New `getContainerStyle()` function**: Primary API for mask-based fade effects
- **New `fadeSize` option**: Control fade effect size in pixels (default: 20px)
- **Backward compatibility**: `getOverlayStyle()` still works but shows deprecation warning
- **Enhanced browser support**: WebKit prefixes for Safari compatibility
- **Updated documentation**: Comprehensive examples showing mask-image superiority

### 🔧 Technical Improvements

- CSS mask-image with `intersect` composite for multi-directional fades
- Vendor-prefixed transitions for cross-browser compatibility  
- Optimized mask positioning and sizing for all scroll directions
- Graceful degradation for older browsers (no fades, but full functionality)

---

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
