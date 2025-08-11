# [3.4.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v3.3.0...v3.4.0) (2025-08-11)


### Features

* add custom color gradients visual example to documentation ([0c8cae8](https://github.com/cosmicThreePointO/use-scroll-fades/commit/0c8cae898f7aafabbb04549c5a054efc634d5101))

# [3.3.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v3.2.0...v3.3.0) (2025-08-11)


### Features

* enhance demo site with improved code example layout and documentation ([08d24ff](https://github.com/cosmicThreePointO/use-scroll-fades/commit/08d24ffd38194b4c182d14d359657938a11232c4))

# [3.2.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v3.1.0...v3.2.0) (2025-08-11)


### Features

* add interactive color palette demo with perfect fade positioning ([b541253](https://github.com/cosmicThreePointO/use-scroll-fades/commit/b54125387be22436d0be0aff045f4b6eedb4f74d))

# [3.1.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v3.0.0...v3.1.0) (2025-08-11)


### Features

* add gradient color customization feature ([8874911](https://github.com/cosmicThreePointO/use-scroll-fades/commit/8874911acef055f9c9c16c5671a9b83c081cfcd5))

# [3.0.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v2.1.0...v3.0.0) (2025-08-11)


### Bug Fixes

* update tests to work with new accessibility features ([5d4d60b](https://github.com/cosmicThreePointO/use-scroll-fades/commit/5d4d60bb44806ae3b61781e27a591ca5506f2003))


### chore

* **release:** 3.0.0 ([77eb693](https://github.com/cosmicThreePointO/use-scroll-fades/commit/77eb693b2255fad3cf7e82ed12e7aee75a81d532))


### Features

* add comprehensive accessibility and browser compatibility support ([0bed837](https://github.com/cosmicThreePointO/use-scroll-fades/commit/0bed837e3c8a85eff814997586a3ad45069e825a))


### BREAKING CHANGES

* **release:** Hook now automatically respects accessibility preferences

- Auto-respect prefers-reduced-motion by default (respectReducedMotion: true)
- Auto-disable effects when mask-image unsupported (respectBrowserSupport: true)
- New accessibility utilities and browser compatibility checks
- Enhanced documentation with accessibility guide
- All tests passing (76/76)

This is a breaking change because the hook behavior now changes based on
user accessibility preferences, which may affect existing users who were
not seeing effects due to browser/accessibility limitations.
* Hook now automatically respects user accessibility preferences

✨ New Accessibility Features:
- Auto-detect and respect prefers-reduced-motion setting
- Automatic CSS mask-image browser support detection
- Graceful degradation for unsupported browsers
- Real-time motion preference monitoring with watchMotionPreference()
- High contrast mode detection
- Server-side rendering (SSR) compatibility

🔧 New Configuration Options:
- respectReducedMotion: boolean (default: true) - Auto-respect motion preferences
- respectBrowserSupport: boolean (default: true) - Disable effects if unsupported
- maskImageFallback: 'disable' | 'ignore' (default: 'disable') - Fallback behavior

📊 New Return Values:
- accessibility.shouldApplyEffects - Whether effects should be enabled
- accessibility.reducedMotionPreferred - Current user motion preference
- accessibility.browserCapabilities - Detailed browser feature detection
- accessibility.shouldDisableTransitions - Whether transitions are disabled

🛠️ New Utility Functions (exported):
- prefersReducedMotion() - Check user's motion preference
- prefersHighContrast() - Check high contrast mode
- supportsMaskImage() - CSS mask-image feature detection
- supportsTransitions() - CSS transitions support check
- getMotionPreference() - Get detailed motion preference
- watchMotionPreference() - Monitor preference changes
- getBrowserCapabilities() - Comprehensive browser info

📖 Enhanced Documentation:
- Complete accessibility guide with examples
- Browser compatibility matrix
- Feature detection examples
- Progressive enhancement patterns

This addresses user feedback about missing accessibility checks and browser flags.
Effects now automatically disable when users prefer reduced motion or when
browsers don't support mask-image, ensuring inclusive user experiences.

# [3.0.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v2.1.0...v3.0.0) (2025-08-11)


### Bug Fixes

* update tests to work with new accessibility features ([5d4d60b](https://github.com/cosmicThreePointO/use-scroll-fades/commit/5d4d60bb44806ae3b61781e27a591ca5506f2003))


### chore

* **release:** 3.0.0 ([77eb693](https://github.com/cosmicThreePointO/use-scroll-fades/commit/77eb693b2255fad3cf7e82ed12e7aee75a81d532))


### Features

* add comprehensive accessibility and browser compatibility support ([0bed837](https://github.com/cosmicThreePointO/use-scroll-fades/commit/0bed837e3c8a85eff814997586a3ad45069e825a))


### BREAKING CHANGES

* **release:** Hook now automatically respects accessibility preferences

- Auto-respect prefers-reduced-motion by default (respectReducedMotion: true)
- Auto-disable effects when mask-image unsupported (respectBrowserSupport: true)
- New accessibility utilities and browser compatibility checks
- Enhanced documentation with accessibility guide
- All tests passing (76/76)

This is a breaking change because the hook behavior now changes based on
user accessibility preferences, which may affect existing users who were
not seeing effects due to browser/accessibility limitations.
* Hook now automatically respects user accessibility preferences

✨ New Accessibility Features:
- Auto-detect and respect prefers-reduced-motion setting
- Automatic CSS mask-image browser support detection
- Graceful degradation for unsupported browsers
- Real-time motion preference monitoring with watchMotionPreference()
- High contrast mode detection
- Server-side rendering (SSR) compatibility

🔧 New Configuration Options:
- respectReducedMotion: boolean (default: true) - Auto-respect motion preferences
- respectBrowserSupport: boolean (default: true) - Disable effects if unsupported
- maskImageFallback: 'disable' | 'ignore' (default: 'disable') - Fallback behavior

📊 New Return Values:
- accessibility.shouldApplyEffects - Whether effects should be enabled
- accessibility.reducedMotionPreferred - Current user motion preference
- accessibility.browserCapabilities - Detailed browser feature detection
- accessibility.shouldDisableTransitions - Whether transitions are disabled

🛠️ New Utility Functions (exported):
- prefersReducedMotion() - Check user's motion preference
- prefersHighContrast() - Check high contrast mode
- supportsMaskImage() - CSS mask-image feature detection
- supportsTransitions() - CSS transitions support check
- getMotionPreference() - Get detailed motion preference
- watchMotionPreference() - Monitor preference changes
- getBrowserCapabilities() - Comprehensive browser info

📖 Enhanced Documentation:
- Complete accessibility guide with examples
- Browser compatibility matrix
- Feature detection examples
- Progressive enhancement patterns

This addresses user feedback about missing accessibility checks and browser flags.
Effects now automatically disable when users prefer reduced motion or when
browsers don't support mask-image, ensuring inclusive user experiences.

# [3.0.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v2.1.0...v3.0.0) (2025-08-11)

### ⚡ BREAKING CHANGES

* **accessibility**: The hook now automatically respects user accessibility preferences by default
* Effects automatically disable when `prefers-reduced-motion: reduce` is set
* Effects automatically disable when browser doesn't support CSS `mask-image`
* This may change behavior for users who were not previously seeing effects due to accessibility settings

### ✨ Features

* **accessibility**: Add comprehensive accessibility and browser compatibility support ([41dceab](https://github.com/cosmicThreePointO/use-scroll-fades/commit/41dceab))
* **accessibility**: Auto-detect and respect `prefers-reduced-motion` setting
* **accessibility**: Automatic CSS `mask-image` browser support detection
* **accessibility**: Graceful degradation for unsupported browsers  
* **accessibility**: Real-time motion preference monitoring with `watchMotionPreference()`
* **accessibility**: High contrast mode detection
* **accessibility**: Server-side rendering (SSR) compatibility

### 🔧 New Configuration Options

* `respectReducedMotion: boolean` (default: true) - Auto-respect motion preferences
* `respectBrowserSupport: boolean` (default: true) - Disable effects if unsupported
* `maskImageFallback: 'disable' | 'ignore'` (default: 'disable') - Fallback behavior

### 📊 New Return Values  

* `accessibility.shouldApplyEffects` - Whether effects should be enabled
* `accessibility.reducedMotionPreferred` - Current user motion preference
* `accessibility.browserCapabilities` - Detailed browser feature detection
* `accessibility.shouldDisableTransitions` - Whether transitions are disabled

### 🛠️ New Utility Functions (exported)

* `prefersReducedMotion()` - Check user's motion preference
* `prefersHighContrast()` - Check high contrast mode
* `supportsMaskImage()` - CSS mask-image feature detection
* `supportsTransitions()` - CSS transitions support check
* `getMotionPreference()` - Get detailed motion preference
* `watchMotionPreference()` - Monitor preference changes
* `getBrowserCapabilities()` - Comprehensive browser info

### 📖 Documentation

* Enhanced documentation with complete accessibility guide
* Browser compatibility matrix
* Feature detection examples and progressive enhancement patterns

# [2.1.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v2.0.1...v2.1.0) (2025-08-11)

### Features

* implement advanced scroll hijacking and enhance demo site ([58c7ce6](https://github.com/cosmicThreePointO/use-scroll-fades/commit/58c7ce69ddedae2d8989c43ff42939a49290b006))

## [2.0.1](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v2.0.0...v2.0.1) (2025-08-10)


### Bug Fixes

* ensure documentation updates are published to npm ([6e1ca39](https://github.com/cosmicThreePointO/use-scroll-fades/commit/6e1ca39e0d103e026dc10fa785258fc808389346))

# [2.0.0](https://github.com/cosmicThreePointO/use-scroll-fades/compare/v1.1.0...v2.0.0) (2025-08-10)


### Features

* revolutionary mask-image approach for true transparency ([760bc9f](https://github.com/cosmicThreePointO/use-scroll-fades/commit/760bc9f1d337d689ca09bd5c7e6b1b5d48fd5e33))
* revolutionary mask-image approach with true transparency ([5ac07f4](https://github.com/cosmicThreePointO/use-scroll-fades/commit/5ac07f462acbd24fd725d4aac096803623ab130e))


### BREAKING CHANGES

* getOverlayStyle() is now deprecated and returns empty styles. Use getContainerStyle() directly on your scrollable container instead.

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
