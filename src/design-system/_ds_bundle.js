/* @ds-bundle: {"format":4,"namespace":"CodeBoxxDesignSystem_fb1e23","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Hero","sourcePath":"components/brand/Hero.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"TopTitle","sourcePath":"components/brand/TopTitle.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"820010ce2e89","components/brand/Hero.jsx":"b729c00d41d1","components/brand/Logo.jsx":"430761759c8b","components/brand/TopTitle.jsx":"286b58844c62","components/display/Avatar.jsx":"33d6af9b23af","components/display/Badge.jsx":"f0b634971be6","components/display/Card.jsx":"4cf209c061d8","components/forms/Checkbox.jsx":"ac6c5ebde8c2","components/forms/Input.jsx":"1805e4c03bdc","components/forms/Toggle.jsx":"ea7ac0cfc52c","components/icons/Icon.jsx":"07daa6c778ae","ui_kits/component-specs/Panel.jsx":"8cb647dae488","ui_kits/component-specs/SpecsPanels.jsx":"fd0aaa0a23b6","ui_kits/component-specs/SpecsScreen.jsx":"901ff7f25e27","ui_kits/marketing-hero/HeroScreen.jsx":"82385d4a2a3e"},"inlinedExternals":[],"unexposedExports":[{"name":"iconNames","sourcePath":"components/icons/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.CodeBoxxDesignSystem_fb1e23 = window.CodeBoxxDesignSystem_fb1e23 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
// figma: Button (Style=Primary|Secondary|Ghost|Destructive × Size=SM|MD|LG)
const SIZES = {
  sm: {
    height: 32,
    fontSize: 14,
    fontWeight: 500
  },
  md: {
    height: 40,
    fontSize: 14,
    fontWeight: 500
  },
  lg: {
    height: 48,
    fontSize: 16,
    fontWeight: 600
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--blue-500)',
    color: 'var(--neutral-0)',
    boxShadow: 'none'
  },
  secondary: {
    background: 'var(--neutral-0)',
    color: 'var(--blue-500)',
    boxShadow: 'inset 0 0 0 1px var(--blue-500)'
  },
  ghost: {
    background: 'rgba(0,0,0,0)',
    color: 'var(--blue-500)',
    boxShadow: 'none'
  },
  destructive: {
    background: 'var(--red-500)',
    color: 'var(--neutral-0)',
    boxShadow: 'none'
  }
};
const HOVER = {
  primary: 'var(--blue-600)',
  secondary: 'var(--blue-50)',
  ghost: 'var(--blue-50)',
  destructive: 'var(--red-600)'
};
function Button({
  children,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className,
  style
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const bg = disabled ? 'var(--color-interactive-disabled)' : hover ? HOVER[variant] : v.background;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    className: className,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      height: s.height,
      width: 'fit-content',
      borderRadius: 9999,
      border: 'none',
      padding: '0 16px',
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: '100%',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: bg,
      color: disabled ? 'var(--neutral-0)' : v.color,
      boxShadow: disabled ? 'none' : v.boxShadow,
      transform: press && !disabled ? 'scale(0.98)' : 'none',
      transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, children ?? label ?? 'Primary');
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
// Source: Figma node 1:63 "logo" (Theme=Light | Theme=Dark).
// The circular mark is always CodeBoxx blue (#43B4F0); the inner flow glyph and
// the CODEBOXX wordmark invert with the theme.
const GEO = {
  full: {
    vb: '0 0 1235.15 238.59',
    ratio: 1235.15 / 238.59,
    body: "<g transform=\"translate(278.770 52.380)\"><path d=\"M 51.9 134.02 C 40.5 134.02 31.05 131.91 23.54 127.68 C 16.03 123.47 10.37 117.58 6.52 110 C 2.67 102.43 0.57 93.63 0.19 83.57 C 0.07 78.48 0 73.02 0 67.2 C 0 61.38 0.07 55.79 0.19 50.45 C 0.57 40.41 2.67 31.6 6.52 24.02 C 10.37 16.47 16.03 10.55 23.54 6.34 C 31.05 2.13 40.5 0 51.9 0 C 60.45 0 67.95 1.18 74.4 3.54 C 80.84 5.9 86.21 9.05 90.48 13.03 C 94.75 17 98.01 21.43 100.24 26.34 C 102.47 31.24 103.71 36.3 103.97 41.5 C 104.09 42.61 103.75 43.54 102.95 44.3 C 102.15 45.04 101.19 45.41 100.06 45.41 L 89.84 45.41 C 88.73 45.41 87.77 45.1 86.95 44.48 C 86.15 43.87 85.55 42.75 85.2 41.14 C 83.1 31.46 79.15 24.83 73.39 21.23 C 67.63 17.63 60.47 15.84 51.91 15.84 C 41.88 15.84 33.93 18.67 28.1 24.31 C 22.28 29.95 19.17 38.99 18.81 51.38 C 18.43 61.55 18.43 71.98 18.81 82.65 C 19.19 95.06 22.28 104.08 28.1 109.72 C 33.93 115.36 41.86 118.19 51.91 118.19 C 60.46 118.19 67.63 116.4 73.39 112.8 C 79.15 109.2 83.09 102.57 85.2 92.89 C 85.58 91.27 86.15 90.16 86.95 89.55 C 87.76 88.93 88.71 88.62 89.84 88.62 L 100.06 88.62 C 101.17 88.62 102.13 88.96 102.95 89.64 C 103.75 90.31 104.09 91.22 103.97 92.34 C 103.72 97.56 102.47 102.63 100.24 107.6 C 98.01 112.57 94.76 117.03 90.48 121 C 86.21 124.97 80.84 128.14 74.4 130.49 C 67.95 132.85 60.45 134.02 51.9 134.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(402.630 52.390)\"><path d=\"M 51.88 134.01 C 41.22 134.01 32.11 132.17 24.55 128.52 C 16.98 124.86 11.16 119.22 7.07 111.58 C 2.97 103.94 0.68 94.37 0.19 82.82 C 0.06 77.37 0 72.12 0 67.09 C 0 62.06 0.06 56.83 0.19 51.36 C 0.68 39.95 3.08 30.43 7.35 22.8 C 11.62 15.16 17.57 9.46 25.2 5.67 C 32.83 1.88 41.72 0 51.88 0 C 62.04 0 70.75 1.9 78.39 5.67 C 86.02 9.46 91.99 15.16 96.34 22.8 C 100.68 30.44 103.03 39.96 103.41 51.36 C 103.66 56.83 103.79 62.06 103.79 67.09 C 103.79 72.12 103.66 77.35 103.41 82.82 C 103.03 94.35 100.77 103.94 96.63 111.58 C 92.47 119.21 86.61 124.86 79.06 128.52 C 71.49 132.18 62.44 134.01 51.91 134.01 L 51.89 134.01 L 51.88 134.01 Z M 51.88 118.18 C 61.31 118.18 69.02 115.32 75.04 109.62 C 81.06 103.91 84.31 94.68 84.81 81.88 C 85.06 76.3 85.19 71.31 85.19 66.9 C 85.19 62.49 85.06 57.57 84.81 52.12 C 84.56 43.56 82.97 36.61 80.07 31.29 C 77.15 25.96 73.28 22.05 68.45 19.56 C 63.62 17.07 58.1 15.84 51.9 15.84 C 45.7 15.84 40.19 17.08 35.35 19.56 C 30.52 22.04 26.64 25.96 23.73 31.29 C 20.81 36.63 19.18 43.57 18.8 52.12 C 18.68 57.57 18.61 62.51 18.61 66.9 C 18.61 71.29 18.68 76.3 18.8 81.88 C 19.29 94.66 22.59 103.89 28.66 109.62 C 34.74 115.32 42.48 118.18 51.9 118.18 L 51.88 118.18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(533.540 54.270)\"><path d=\"M 4.27 130.27 C 2.9 130.27 1.85 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.84 0.41 2.9 0 4.27 0 L 46.48 0 C 59.24 0 69.53 1.93 77.35 5.77 C 85.15 9.62 90.85 15.3 94.47 22.81 C 98.06 30.32 99.92 39.53 100.04 50.45 C 100.17 56.03 100.23 60.93 100.23 65.16 C 100.23 69.39 100.17 74.21 100.04 79.68 C 99.79 91.1 97.9 100.55 94.37 108.06 C 90.83 115.57 85.26 121.14 77.63 124.81 C 70 128.47 59.93 130.3 47.4 130.3 L 4.26 130.3 L 4.28 130.28 L 4.27 130.27 Z M 18.21 114.45 L 46.48 114.45 C 55.03 114.45 61.85 113.27 66.94 110.92 C 72.03 108.56 75.7 104.77 78.01 99.57 C 80.3 94.35 81.51 87.47 81.64 78.91 C 81.89 75.18 82.02 71.93 82.02 69.14 L 82.02 60.76 C 82.02 57.96 81.9 54.77 81.64 51.17 C 81.39 39.13 78.55 30.24 73.08 24.47 C 67.62 18.7 58.45 15.82 45.56 15.82 L 18.22 15.82 L 18.22 114.45 L 18.21 114.45 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(661.670 54.270)\"><path d=\"M 4.27 130.27 C 2.9 130.27 1.85 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.85 0.41 2.9 0 4.27 0 L 81.07 0 C 82.44 0 83.49 0.41 84.23 1.21 C 84.97 2.02 85.34 3.1 85.34 4.47 L 85.34 11.54 C 85.34 12.91 84.96 13.96 84.23 14.7 C 83.49 15.44 82.43 15.82 81.07 15.82 L 17.84 15.82 L 17.84 56.58 L 76.97 56.58 C 78.34 56.58 79.39 56.99 80.13 57.79 C 80.87 58.59 81.24 59.68 81.24 61.04 L 81.24 67.92 C 81.24 69.16 80.86 70.18 80.13 70.99 C 79.4 71.79 78.33 72.2 76.97 72.2 L 17.84 72.2 L 17.84 114.44 L 82.55 114.44 C 83.91 114.44 84.97 114.82 85.7 115.55 C 86.44 116.29 86.81 117.35 86.81 118.71 L 86.81 125.97 C 86.81 127.21 86.43 128.23 85.7 129.03 C 84.97 129.83 83.9 130.24 82.55 130.24 L 4.26 130.24 L 4.28 130.27 L 4.27 130.27 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(774.350 54.270)\"><path d=\"M 4.26 130.27 C 2.9 130.27 1.84 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.84 0.41 2.9 0 4.26 0 L 55.21 0 C 64.51 0 72.11 1.52 78 4.56 C 83.89 7.61 88.22 11.72 91.02 16.94 C 93.81 22.16 95.19 27.98 95.19 34.43 C 95.19 39.52 94.36 43.89 92.68 47.55 C 91 51.21 88.93 54.18 86.45 56.48 C 83.97 58.77 81.55 60.55 79.19 61.79 C 84.02 64.15 88.33 68 92.11 73.32 C 95.89 78.66 97.78 85.1 97.78 92.68 C 97.78 99.5 96.22 105.77 93.13 111.47 C 90.03 117.18 85.42 121.73 79.28 125.14 C 73.14 128.55 65.62 130.27 56.69 130.27 L 4.25 130.27 L 4.26 130.27 Z M 18.21 55.1 L 52.43 55.1 C 60.36 55.1 66.38 53.28 70.47 49.61 C 74.57 45.95 76.61 40.95 76.61 34.64 C 76.61 28.33 74.57 23.46 70.47 20.12 C 66.38 16.77 60.36 15.09 52.43 15.09 L 18.21 15.09 L 18.21 55.09 L 18.21 55.1 Z M 18.21 115.2 L 54.29 115.2 C 62.22 115.2 68.36 113.03 72.69 108.68 C 77.02 104.35 79.21 99 79.21 92.69 C 79.21 86.38 77.04 80.68 72.69 76.41 C 68.36 72.13 62.22 69.98 54.29 69.98 L 18.21 69.98 L 18.21 115.21 L 18.21 115.2 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(893.530 52.390)\"><path d=\"M 51.89 134.01 C 41.23 134.01 32.12 132.17 24.55 128.52 C 16.98 124.86 11.16 119.22 7.07 111.58 C 2.98 103.94 0.68 94.37 0.19 82.82 C 0.06 77.37 0 72.12 0 67.09 C 0 62.06 0.06 56.83 0.19 51.36 C 0.68 39.95 3.08 30.43 7.35 22.8 C 11.62 15.16 17.57 9.46 25.2 5.67 C 32.83 1.88 41.72 0 51.88 0 C 62.04 0 70.75 1.9 78.39 5.67 C 86.02 9.46 91.99 15.16 96.34 22.8 C 100.67 30.44 103.03 39.96 103.4 51.36 C 103.65 56.83 103.78 62.06 103.78 67.09 C 103.78 72.12 103.66 77.35 103.4 82.82 C 103.02 94.35 100.76 103.94 96.62 111.58 C 92.46 119.21 86.6 124.86 79.05 128.52 C 71.48 132.18 62.44 134.01 51.9 134.01 L 51.88 134.01 L 51.89 134.01 Z M 51.89 118.18 C 61.31 118.18 69.02 115.32 75.05 109.62 C 81.07 103.91 84.32 94.68 84.82 81.88 C 85.07 76.3 85.2 71.31 85.2 66.9 C 85.2 62.49 85.07 57.57 84.82 52.12 C 84.57 43.56 82.98 36.61 80.08 31.29 C 77.16 25.96 73.3 22.05 68.46 19.56 C 63.63 17.08 58.11 15.84 51.92 15.84 C 45.73 15.84 40.2 17.08 35.37 19.56 C 30.53 22.04 26.66 25.96 23.75 31.29 C 20.83 36.63 19.2 43.57 18.82 52.12 C 18.69 57.57 18.63 62.51 18.63 66.9 C 18.63 71.29 18.69 76.3 18.82 81.88 C 19.31 94.66 22.6 103.89 28.68 109.62 C 34.76 115.32 42.49 118.18 51.92 118.18 L 51.9 118.18 L 51.89 118.18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1010.860 54.280)\"><path d=\"M 33.98 54.4 L 41.37 43.79 C 43.22 41.15 43.22 37.63 41.37 34.97 L 19.15 3.15 C 18.66 2.16 18 1.4 17.2 0.83 C 16.4 0.26 15.45 0 14.31 0 L 3.71 0 C 2.72 0 1.86 0.38 1.11 1.11 C 0.37 1.85 0 2.73 0 3.72 C 0 4.59 0.25 5.4 0.74 6.14 L 33.96 54.4 L 33.98 54.4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1008.440 128.910)\"><path d=\"M 35.75 0.02 L 0.75 49.48 C 0.5 49.73 0.31 50.08 0.19 50.5 C 0.06 50.94 0 51.4 0 51.9 C 0 52.89 0.38 53.75 1.11 54.51 C 1.84 55.24 2.79 55.62 3.9 55.62 L 15.24 55.62 C 16.35 55.62 17.31 55.31 18.13 54.69 C 18.93 54.08 19.65 53.32 20.27 52.45 L 43.64 19.96 C 45.57 17.27 45.57 13.66 43.64 10.97 L 35.74 0 L 35.76 0 L 35.75 0.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1054.316 54.280)\"><path d=\"M 62.924 125.14 C 62.804 124.7 62.614 124.37 62.364 124.12 L 19.974 64.2 L 59.954 6.14 C 60.444 5.41 60.694 4.59 60.694 3.72 C 60.694 2.73 60.314 1.85 59.584 1.11 C 58.844 0.37 57.964 0 56.974 0 L 46.374 0 C 45.264 0 44.304 0.28 43.484 0.83 C 42.664 1.4 42.024 2.17 41.534 3.15 L 1.384 60.65 C -0.486 63.32 -0.456 66.89 1.444 69.55 L 42.844 127.09 C 43.454 127.95 44.174 128.71 44.974 129.32 C 45.784 129.95 46.734 130.25 47.864 130.25 L 59.204 130.25 C 60.314 130.25 61.244 129.87 62.004 129.14 C 62.734 128.4 63.114 127.52 63.114 126.53 C 63.114 126.04 63.044 125.57 62.924 125.13 L 62.934 125.13 L 62.924 125.14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1189.973 54.280)\"><path d=\"M 8.778 54.4 L 1.388 43.79 C -0.462 41.15 -0.462 37.63 1.388 34.97 L 23.607 3.15 C 24.097 2.16 24.758 1.4 25.558 0.83 C 26.358 0.26 27.318 0 28.448 0 L 39.048 0 C 40.038 0 40.898 0.38 41.648 1.11 C 42.388 1.85 42.757 2.73 42.757 3.72 C 42.757 4.59 42.508 5.4 42.028 6.14 L 8.798 54.4 L 8.778 54.4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1190.052 128.910)\"><path d=\"M 9.338 0.02 L 44.338 49.48 C 44.588 49.73 44.777 50.08 44.897 50.5 C 45.027 50.94 45.088 51.4 45.088 51.9 C 45.088 52.89 44.708 53.75 43.978 54.51 C 43.238 55.24 42.297 55.62 41.177 55.62 L 29.838 55.62 C 28.728 55.62 27.767 55.31 26.948 54.69 C 26.148 54.08 25.427 53.32 24.807 52.45 L 1.447 19.96 C -0.482 17.27 -0.482 13.66 1.447 10.97 L 9.348 0 L 9.328 0 L 9.338 0.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(1126.160 54.280)\"><path d=\"M 0.19 125.14 C 0.31 124.7 0.5 124.37 0.75 124.12 L 43.14 64.2 L 3.16 6.14 C 2.67 5.41 2.43 4.59 2.43 3.72 C 2.43 2.73 2.81 1.85 3.54 1.11 C 4.27 0.37 5.16 0 6.14 0 L 16.74 0 C 17.85 0 18.81 0.28 19.63 0.83 C 20.45 1.4 21.09 2.17 21.58 3.15 L 61.73 60.65 C 63.6 63.32 63.57 66.89 61.67 69.55 L 20.28 127.09 C 19.67 127.95 18.94 128.71 18.14 129.32 C 17.34 129.95 16.38 130.25 15.25 130.25 L 3.91 130.25 C 2.8 130.25 1.87 129.87 1.11 129.14 C 0.38 128.4 0 127.52 0 126.53 C 0 126.04 0.07 125.57 0.19 125.13 L 0.17 125.13 L 0.19 125.14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(0.000 0.000)\"><path d=\"M 119.3 0 C 53.41 0 0 53.41 0 119.3 C 0 185.19 53.41 238.6 119.3 238.6 C 185.19 238.6 238.59 185.19 238.59 119.3 C 238.59 53.41 185.18 0 119.3 0 Z\" fill=\"#43B4F0\" fill-rule=\"nonzero\"/></g><g transform=\"translate(32.757 40.510)\"><path d=\"M 78.223 156.87 L 114.043 157.09 C 124.543 157.09 134.233 151.52 139.463 142.56 L 171.093 88.33 C 173.023 85.02 173.043 80.89 171.143 77.56 C 169.243 74.23 165.673 72.15 161.843 72.13 L 94.713 71.83 C 91.763 71.81 89.033 70.22 87.573 67.67 L 56.623 13.52 L 114.663 13.77 C 120.273 13.8 125.493 16.84 128.283 21.72 L 146.043 52.82 C 147.893 56.05 152.033 57.18 155.263 55.34 C 158.503 53.49 159.633 49.35 157.783 46.12 L 140.023 15.02 C 134.843 5.96 125.153 0.31 114.723 0.26 L 51.933 0 C 50.103 0 48.523 0.35 47.173 1.05 C 44.393 2.48 42.403 4.85 41.563 7.71 C 40.733 10.52 41.083 13.58 42.533 16.12 L 75.833 74.39 C 77.293 76.95 77.283 80.11 75.793 82.65 L 44.373 136.52 L 15.573 86.12 C 12.783 81.24 12.813 75.2 15.643 70.35 L 33.743 39.32 C 35.623 36.1 34.523 31.95 31.313 30.08 C 28.093 28.21 23.943 29.3 22.073 32.51 L 3.973 63.54 C -1.277 72.55 -1.327 83.77 3.843 92.82 L 35.003 147.34 C 36.903 150.67 40.473 152.75 44.303 152.77 C 48.163 152.77 51.733 150.72 53.653 147.42 L 87.473 89.45 C 88.943 86.92 91.683 85.35 94.613 85.35 L 94.643 85.35 L 157.023 85.62 L 127.783 135.76 C 124.973 140.58 119.763 143.57 114.173 143.57 L 78.303 143.35 C 75.333 143.35 72.763 145.14 71.893 147.81 C 71.173 150 71.493 152.26 72.773 154.05 C 74.033 155.8 76.073 156.85 78.233 156.87 L 78.213 156.89 L 78.223 156.87 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g>"
  },
  mark: {
    vb: '0 0 238.59 238.6',
    ratio: 1,
    body: "<g transform=\"translate(0.000 0.000)\"><path d=\"M 119.3 0 C 53.41 0 0 53.41 0 119.3 C 0 185.19 53.41 238.6 119.3 238.6 C 185.19 238.6 238.59 185.19 238.59 119.3 C 238.59 53.41 185.18 0 119.3 0 Z\" fill=\"#43B4F0\" fill-rule=\"nonzero\"/></g><g transform=\"translate(32.757 40.510)\"><path d=\"M 78.223 156.87 L 114.043 157.09 C 124.543 157.09 134.233 151.52 139.463 142.56 L 171.093 88.33 C 173.023 85.02 173.043 80.89 171.143 77.56 C 169.243 74.23 165.673 72.15 161.843 72.13 L 94.713 71.83 C 91.763 71.81 89.033 70.22 87.573 67.67 L 56.623 13.52 L 114.663 13.77 C 120.273 13.8 125.493 16.84 128.283 21.72 L 146.043 52.82 C 147.893 56.05 152.033 57.18 155.263 55.34 C 158.503 53.49 159.633 49.35 157.783 46.12 L 140.023 15.02 C 134.843 5.96 125.153 0.31 114.723 0.26 L 51.933 0 C 50.103 0 48.523 0.35 47.173 1.05 C 44.393 2.48 42.403 4.85 41.563 7.71 C 40.733 10.52 41.083 13.58 42.533 16.12 L 75.833 74.39 C 77.293 76.95 77.283 80.11 75.793 82.65 L 44.373 136.52 L 15.573 86.12 C 12.783 81.24 12.813 75.2 15.643 70.35 L 33.743 39.32 C 35.623 36.1 34.523 31.95 31.313 30.08 C 28.093 28.21 23.943 29.3 22.073 32.51 L 3.973 63.54 C -1.277 72.55 -1.327 83.77 3.843 92.82 L 35.003 147.34 C 36.903 150.67 40.473 152.75 44.303 152.77 C 48.163 152.77 51.733 150.72 53.653 147.42 L 87.473 89.45 C 88.943 86.92 91.683 85.35 94.613 85.35 L 94.643 85.35 L 157.023 85.62 L 127.783 135.76 C 124.973 140.58 119.763 143.57 114.173 143.57 L 78.303 143.35 C 75.333 143.35 72.763 145.14 71.893 147.81 C 71.173 150 71.493 152.26 72.773 154.05 C 74.033 155.8 76.073 156.85 78.233 156.87 L 78.213 156.89 L 78.223 156.87 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g>"
  },
  wordmark: {
    vb: '0 0 956.33 132.15',
    ratio: 956.33 / 132.15,
    body: "<g transform=\"translate(0.000 0.000)\"><path d=\"M 51.9 134.02 C 40.5 134.02 31.05 131.91 23.54 127.68 C 16.03 123.47 10.37 117.58 6.52 110 C 2.67 102.43 0.57 93.63 0.19 83.57 C 0.07 78.48 0 73.02 0 67.2 C 0 61.38 0.07 55.79 0.19 50.45 C 0.57 40.41 2.67 31.6 6.52 24.02 C 10.37 16.47 16.03 10.55 23.54 6.34 C 31.05 2.13 40.5 0 51.9 0 C 60.45 0 67.95 1.18 74.4 3.54 C 80.84 5.9 86.21 9.05 90.48 13.03 C 94.75 17 98.01 21.43 100.24 26.34 C 102.47 31.24 103.71 36.3 103.97 41.5 C 104.09 42.61 103.75 43.54 102.95 44.3 C 102.15 45.04 101.19 45.41 100.06 45.41 L 89.84 45.41 C 88.73 45.41 87.77 45.1 86.95 44.48 C 86.15 43.87 85.55 42.75 85.2 41.14 C 83.1 31.46 79.15 24.83 73.39 21.23 C 67.63 17.63 60.47 15.84 51.91 15.84 C 41.88 15.84 33.93 18.67 28.1 24.31 C 22.28 29.95 19.17 38.99 18.81 51.38 C 18.43 61.55 18.43 71.98 18.81 82.65 C 19.19 95.06 22.28 104.08 28.1 109.72 C 33.93 115.36 41.86 118.19 51.91 118.19 C 60.46 118.19 67.63 116.4 73.39 112.8 C 79.15 109.2 83.09 102.57 85.2 92.89 C 85.58 91.27 86.15 90.16 86.95 89.55 C 87.76 88.93 88.71 88.62 89.84 88.62 L 100.06 88.62 C 101.17 88.62 102.13 88.96 102.95 89.64 C 103.75 90.31 104.09 91.22 103.97 92.34 C 103.72 97.56 102.47 102.63 100.24 107.6 C 98.01 112.57 94.76 117.03 90.48 121 C 86.21 124.97 80.84 128.14 74.4 130.49 C 67.95 132.85 60.45 134.02 51.9 134.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(123.860 0.010)\"><path d=\"M 51.88 134.01 C 41.22 134.01 32.11 132.17 24.55 128.52 C 16.98 124.86 11.16 119.22 7.07 111.58 C 2.97 103.94 0.68 94.37 0.19 82.82 C 0.06 77.37 0 72.12 0 67.09 C 0 62.06 0.06 56.83 0.19 51.36 C 0.68 39.95 3.08 30.43 7.35 22.8 C 11.62 15.16 17.57 9.46 25.2 5.67 C 32.83 1.88 41.72 0 51.88 0 C 62.04 0 70.75 1.9 78.39 5.67 C 86.02 9.46 91.99 15.16 96.34 22.8 C 100.68 30.44 103.03 39.96 103.41 51.36 C 103.66 56.83 103.79 62.06 103.79 67.09 C 103.79 72.12 103.66 77.35 103.41 82.82 C 103.03 94.35 100.77 103.94 96.63 111.58 C 92.47 119.21 86.61 124.86 79.06 128.52 C 71.49 132.18 62.44 134.01 51.91 134.01 L 51.89 134.01 L 51.88 134.01 Z M 51.88 118.18 C 61.31 118.18 69.02 115.32 75.04 109.62 C 81.06 103.91 84.31 94.68 84.81 81.88 C 85.06 76.3 85.19 71.31 85.19 66.9 C 85.19 62.49 85.06 57.57 84.81 52.12 C 84.56 43.56 82.97 36.61 80.07 31.29 C 77.15 25.96 73.28 22.05 68.45 19.56 C 63.62 17.07 58.1 15.84 51.9 15.84 C 45.7 15.84 40.19 17.08 35.35 19.56 C 30.52 22.04 26.64 25.96 23.73 31.29 C 20.81 36.63 19.18 43.57 18.8 52.12 C 18.68 57.57 18.61 62.51 18.61 66.9 C 18.61 71.29 18.68 76.3 18.8 81.88 C 19.29 94.66 22.59 103.89 28.66 109.62 C 34.74 115.32 42.48 118.18 51.9 118.18 L 51.88 118.18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(254.770 1.890)\"><path d=\"M 4.27 130.27 C 2.9 130.27 1.85 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.84 0.41 2.9 0 4.27 0 L 46.48 0 C 59.24 0 69.53 1.93 77.35 5.77 C 85.15 9.62 90.85 15.3 94.47 22.81 C 98.06 30.32 99.92 39.53 100.04 50.45 C 100.17 56.03 100.23 60.93 100.23 65.16 C 100.23 69.39 100.17 74.21 100.04 79.68 C 99.79 91.1 97.9 100.55 94.37 108.06 C 90.83 115.57 85.26 121.14 77.63 124.81 C 70 128.47 59.93 130.3 47.4 130.3 L 4.26 130.3 L 4.28 130.28 L 4.27 130.27 Z M 18.21 114.45 L 46.48 114.45 C 55.03 114.45 61.85 113.27 66.94 110.92 C 72.03 108.56 75.7 104.77 78.01 99.57 C 80.3 94.35 81.51 87.47 81.64 78.91 C 81.89 75.18 82.02 71.93 82.02 69.14 L 82.02 60.76 C 82.02 57.96 81.9 54.77 81.64 51.17 C 81.39 39.13 78.55 30.24 73.08 24.47 C 67.62 18.7 58.45 15.82 45.56 15.82 L 18.22 15.82 L 18.22 114.45 L 18.21 114.45 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(382.900 1.890)\"><path d=\"M 4.27 130.27 C 2.9 130.27 1.85 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.85 0.41 2.9 0 4.27 0 L 81.07 0 C 82.44 0 83.49 0.41 84.23 1.21 C 84.97 2.02 85.34 3.1 85.34 4.47 L 85.34 11.54 C 85.34 12.91 84.96 13.96 84.23 14.7 C 83.49 15.44 82.43 15.82 81.07 15.82 L 17.84 15.82 L 17.84 56.58 L 76.97 56.58 C 78.34 56.58 79.39 56.99 80.13 57.79 C 80.87 58.59 81.24 59.68 81.24 61.04 L 81.24 67.92 C 81.24 69.16 80.86 70.18 80.13 70.99 C 79.4 71.79 78.33 72.2 76.97 72.2 L 17.84 72.2 L 17.84 114.44 L 82.55 114.44 C 83.91 114.44 84.97 114.82 85.7 115.55 C 86.44 116.29 86.81 117.35 86.81 118.71 L 86.81 125.97 C 86.81 127.21 86.43 128.23 85.7 129.03 C 84.97 129.83 83.9 130.24 82.55 130.24 L 4.26 130.24 L 4.28 130.27 L 4.27 130.27 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(495.580 1.890)\"><path d=\"M 4.26 130.27 C 2.9 130.27 1.84 129.86 1.11 129.06 C 0.37 128.26 0 127.24 0 126 L 0 4.47 C 0 3.1 0.38 2.02 1.11 1.21 C 1.84 0.41 2.9 0 4.26 0 L 55.21 0 C 64.51 0 72.11 1.52 78 4.56 C 83.89 7.61 88.22 11.72 91.02 16.94 C 93.81 22.16 95.19 27.98 95.19 34.43 C 95.19 39.52 94.36 43.89 92.68 47.55 C 91 51.21 88.93 54.18 86.45 56.48 C 83.97 58.77 81.55 60.55 79.19 61.79 C 84.02 64.15 88.33 68 92.11 73.32 C 95.89 78.66 97.78 85.1 97.78 92.68 C 97.78 99.5 96.22 105.77 93.13 111.47 C 90.03 117.18 85.42 121.73 79.28 125.14 C 73.14 128.55 65.62 130.27 56.69 130.27 L 4.25 130.27 L 4.26 130.27 Z M 18.21 55.1 L 52.43 55.1 C 60.36 55.1 66.38 53.28 70.47 49.61 C 74.57 45.95 76.61 40.95 76.61 34.64 C 76.61 28.33 74.57 23.46 70.47 20.12 C 66.38 16.77 60.36 15.09 52.43 15.09 L 18.21 15.09 L 18.21 55.09 L 18.21 55.1 Z M 18.21 115.2 L 54.29 115.2 C 62.22 115.2 68.36 113.03 72.69 108.68 C 77.02 104.35 79.21 99 79.21 92.69 C 79.21 86.38 77.04 80.68 72.69 76.41 C 68.36 72.13 62.22 69.98 54.29 69.98 L 18.21 69.98 L 18.21 115.21 L 18.21 115.2 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(614.760 0.010)\"><path d=\"M 51.89 134.01 C 41.23 134.01 32.12 132.17 24.55 128.52 C 16.98 124.86 11.16 119.22 7.07 111.58 C 2.98 103.94 0.68 94.37 0.19 82.82 C 0.06 77.37 0 72.12 0 67.09 C 0 62.06 0.06 56.83 0.19 51.36 C 0.68 39.95 3.08 30.43 7.35 22.8 C 11.62 15.16 17.57 9.46 25.2 5.67 C 32.83 1.88 41.72 0 51.88 0 C 62.04 0 70.75 1.9 78.39 5.67 C 86.02 9.46 91.99 15.16 96.34 22.8 C 100.67 30.44 103.03 39.96 103.4 51.36 C 103.65 56.83 103.78 62.06 103.78 67.09 C 103.78 72.12 103.66 77.35 103.4 82.82 C 103.02 94.35 100.76 103.94 96.62 111.58 C 92.46 119.21 86.6 124.86 79.05 128.52 C 71.48 132.18 62.44 134.01 51.9 134.01 L 51.88 134.01 L 51.89 134.01 Z M 51.89 118.18 C 61.31 118.18 69.02 115.32 75.05 109.62 C 81.07 103.91 84.32 94.68 84.82 81.88 C 85.07 76.3 85.2 71.31 85.2 66.9 C 85.2 62.49 85.07 57.57 84.82 52.12 C 84.57 43.56 82.98 36.61 80.08 31.29 C 77.16 25.96 73.3 22.05 68.46 19.56 C 63.63 17.08 58.11 15.84 51.92 15.84 C 45.73 15.84 40.2 17.08 35.37 19.56 C 30.53 22.04 26.66 25.96 23.75 31.29 C 20.83 36.63 19.2 43.57 18.82 52.12 C 18.69 57.57 18.63 62.51 18.63 66.9 C 18.63 71.29 18.69 76.3 18.82 81.88 C 19.31 94.66 22.6 103.89 28.68 109.62 C 34.76 115.32 42.49 118.18 51.92 118.18 L 51.9 118.18 L 51.89 118.18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(732.090 1.900)\"><path d=\"M 33.98 54.4 L 41.37 43.79 C 43.22 41.15 43.22 37.63 41.37 34.97 L 19.15 3.15 C 18.66 2.16 18 1.4 17.2 0.83 C 16.4 0.26 15.45 0 14.31 0 L 3.71 0 C 2.72 0 1.86 0.38 1.11 1.11 C 0.37 1.85 0 2.73 0 3.72 C 0 4.59 0.25 5.4 0.74 6.14 L 33.96 54.4 L 33.98 54.4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(729.670 76.530)\"><path d=\"M 35.75 0.02 L 0.75 49.48 C 0.5 49.73 0.31 50.08 0.19 50.5 C 0.06 50.94 0 51.4 0 51.9 C 0 52.89 0.38 53.75 1.11 54.51 C 1.84 55.24 2.79 55.62 3.9 55.62 L 15.24 55.62 C 16.35 55.62 17.31 55.31 18.13 54.69 C 18.93 54.08 19.65 53.32 20.27 52.45 L 43.64 19.96 C 45.57 17.27 45.57 13.66 43.64 10.97 L 35.74 0 L 35.76 0 L 35.75 0.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(775.546 1.900)\"><path d=\"M 62.924 125.14 C 62.804 124.7 62.614 124.37 62.364 124.12 L 19.974 64.2 L 59.954 6.14 C 60.444 5.41 60.694 4.59 60.694 3.72 C 60.694 2.73 60.314 1.85 59.584 1.11 C 58.844 0.37 57.964 0 56.974 0 L 46.374 0 C 45.264 0 44.304 0.28 43.484 0.83 C 42.664 1.4 42.024 2.17 41.534 3.15 L 1.384 60.65 C -0.486 63.32 -0.456 66.89 1.444 69.55 L 42.844 127.09 C 43.454 127.95 44.174 128.71 44.974 129.32 C 45.784 129.95 46.734 130.25 47.864 130.25 L 59.204 130.25 C 60.314 130.25 61.244 129.87 62.004 129.14 C 62.734 128.4 63.114 127.52 63.114 126.53 C 63.114 126.04 63.044 125.57 62.924 125.13 L 62.934 125.13 L 62.924 125.14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(911.203 1.900)\"><path d=\"M 8.778 54.4 L 1.388 43.79 C -0.462 41.15 -0.462 37.63 1.388 34.97 L 23.607 3.15 C 24.097 2.16 24.758 1.4 25.558 0.83 C 26.358 0.26 27.318 0 28.448 0 L 39.048 0 C 40.038 0 40.898 0.38 41.648 1.11 C 42.388 1.85 42.757 2.73 42.757 3.72 C 42.757 4.59 42.508 5.4 42.028 6.14 L 8.798 54.4 L 8.778 54.4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(911.282 76.530)\"><path d=\"M 9.338 0.02 L 44.338 49.48 C 44.588 49.73 44.777 50.08 44.897 50.5 C 45.027 50.94 45.088 51.4 45.088 51.9 C 45.088 52.89 44.708 53.75 43.978 54.51 C 43.238 55.24 42.297 55.62 41.177 55.62 L 29.838 55.62 C 28.728 55.62 27.767 55.31 26.948 54.69 C 26.148 54.08 25.427 53.32 24.807 52.45 L 1.447 19.96 C -0.482 17.27 -0.482 13.66 1.447 10.97 L 9.348 0 L 9.328 0 L 9.338 0.02 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g><g transform=\"translate(847.390 1.900)\"><path d=\"M 0.19 125.14 C 0.31 124.7 0.5 124.37 0.75 124.12 L 43.14 64.2 L 3.16 6.14 C 2.67 5.41 2.43 4.59 2.43 3.72 C 2.43 2.73 2.81 1.85 3.54 1.11 C 4.27 0.37 5.16 0 6.14 0 L 16.74 0 C 17.85 0 18.81 0.28 19.63 0.83 C 20.45 1.4 21.09 2.17 21.58 3.15 L 61.73 60.65 C 63.6 63.32 63.57 66.89 61.67 69.55 L 20.28 127.09 C 19.67 127.95 18.94 128.71 18.14 129.32 C 17.34 129.95 16.38 130.25 15.25 130.25 L 3.91 130.25 C 2.8 130.25 1.87 129.87 1.11 129.14 C 0.38 128.4 0 127.52 0 126.53 C 0 126.04 0.07 125.57 0.19 125.13 L 0.17 125.13 L 0.19 125.14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\"/></g>"
  }
};
function Logo({
  theme = 'light',
  variant = 'full',
  height = 48,
  width,
  className,
  style
}) {
  const geo = GEO[variant] || GEO.full;
  const h = width ? width / geo.ratio : height;
  const w = width || h * geo.ratio;
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    viewBox: geo.vb,
    width: w,
    height: h,
    fill: "none",
    role: "img",
    "aria-label": "CodeBoxx",
    style: {
      display: 'block',
      color: theme === 'dark' ? 'var(--neutral-0)' : 'var(--neutral-950)',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: geo.body
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Hero.jsx
try { (() => {
// figma: Hero (standalone symbol 5:56) — photographic header under a navy wash
function Hero({
  eyebrow = 'AI-First, Human-Built',
  children,
  backgroundImage = 'assets/hero-bg.png',
  showLogo = true,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: 1440,
      height: 640,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: 64,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      background: `linear-gradient(rgba(0,47,67,0.82), rgba(0,47,67,0.82)), url(${backgroundImage}) center / cover no-repeat`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start'
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 9999,
      background: 'rgba(0,0,0,0)',
      boxShadow: 'inset 0 0 0 1.5px var(--blue-500)',
      padding: '8px 16px',
      display: 'inline-flex',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '100%',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      color: 'var(--neutral-0)',
      whiteSpace: 'nowrap'
    }
  }, eyebrow) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      width: 820,
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontWeight: 900,
      fontSize: 64,
      lineHeight: '72px',
      color: 'var(--neutral-0)'
    }
  }, children ?? /*#__PURE__*/React.createElement(React.Fragment, null, "We build ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--blue-500)'
    }
  }, "AI-Native"), " teams and software that outwork the old way.")), showLogo ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280,
      height: 54,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    theme: "dark",
    width: 280
  })) : null));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Hero.jsx", error: String((e && e.message) || e) }); }

// components/brand/TopTitle.jsx
try { (() => {
// figma: TopTitle (Theme=Light|Dark)
function TopTitle({
  children,
  label,
  theme = 'light',
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      width: 'fit-content',
      borderRadius: 60,
      boxShadow: 'inset 0 0 0 2px var(--blue-500)',
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 10,
      padding: '15px 35px',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '100%',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
      color: theme === 'dark' ? 'var(--neutral-0)' : 'rgb(0,0,0)',
      ...style
    }
  }, children ?? label ?? 'Section Top Title');
}
Object.assign(__ds_scope, { TopTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/TopTitle.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
// figma: Badge (Variant=Default|Brand|Success|Warning|Error)
const VARIANTS = {
  default: {
    background: 'var(--ui-badge-default-bg)',
    color: 'var(--ui-badge-default-fg)'
  },
  brand: {
    background: 'var(--ui-badge-brand-bg)',
    color: 'var(--ui-badge-brand-fg)'
  },
  success: {
    background: 'var(--ui-badge-success-bg)',
    color: 'var(--ui-badge-success-fg)'
  },
  warning: {
    background: 'var(--ui-badge-warning-bg)',
    color: 'var(--ui-badge-warning-fg)'
  },
  error: {
    background: 'var(--ui-badge-error-bg)',
    color: 'var(--ui-badge-error-fg)'
  }
};
function Badge({
  children,
  label,
  variant = 'default',
  className,
  style
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      width: 'fit-content',
      borderRadius: 999,
      padding: '4px 10px',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '100%',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    }
  }, children ?? label ?? 'Default');
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
// figma: Input (State=Default|Focused|Error|Disabled)
function Input({
  label = 'API Endpoint',
  value,
  placeholder = 'https://api.codeboxx.io/v1',
  state = 'default',
  helperText,
  onChange,
  id,
  className,
  style
}) {
  const disabled = state === 'disabled';
  const error = state === 'error';
  const focused = state === 'focused';
  const ring = error ? 'inset 0 0 0 1px var(--red-500)' : focused ? 'inset 0 0 0 1px var(--blue-500)' : 'inset 0 0 0 1px var(--ui-slate-300)';
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: 612,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'flex-start',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      alignSelf: 'stretch',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 13,
      lineHeight: '100%',
      color: disabled ? 'var(--ui-slate-400)' : 'var(--ui-slate-900)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      height: 40,
      borderRadius: 8,
      background: disabled ? 'var(--ui-slate-50)' : 'var(--neutral-0)',
      boxShadow: ring,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0 12px',
      transition: 'box-shadow var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: id,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    style: {
      flexGrow: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '100%',
      color: disabled ? 'var(--ui-slate-400)' : 'var(--ui-slate-900)'
    }
  }), focused ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1.5,
      height: 18,
      background: 'var(--blue-500)',
      flexShrink: 0
    }
  }) : null), error && (helperText ?? 'Invalid connection protocol string. Missing authentication key.') ? /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'stretch',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 12,
      lineHeight: '100%',
      color: 'var(--red-500)'
    }
  }, helperText ?? 'Invalid connection protocol string. Missing authentication key.') : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
// figma: Toggle (State=On|Off)
function Toggle({
  on = false,
  label,
  disabled = false,
  onChange,
  className,
  style
}) {
  const track = /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    "aria-disabled": disabled || undefined,
    onClick: disabled ? undefined : () => onChange && onChange(!on),
    style: {
      width: 40,
      height: 20,
      flexShrink: 0,
      borderRadius: 999,
      background: on ? 'var(--blue-500)' : 'var(--ui-slate-300)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
      padding: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'var(--neutral-0)'
    }
  }));
  if (!label) return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, track);
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, track, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '100%',
      color: 'var(--ui-slate-900)'
    }
  }, label));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
// Glyphs transcribed from the CodeBoxx Figma file. The kit uses exactly two
// icons — the avatar "user-circle" and the checkbox "check-circle" — so this is
// the whole set. Both paint with currentColor.
const GLYPHS = {
  'user-circle': {
    viewBox: '-2.666 -2.666 32 32',
    d: "M 5.667 24.885 C 5.667 25.437 6.115 25.885 6.667 25.885 C 7.219 25.885 7.667 25.437 7.667 24.885 L 6.667 24.885 L 5.667 24.885 Z M 19.002 24.885 C 19.002 25.437 19.449 25.885 20.002 25.885 C 20.554 25.885 21.002 25.437 21.002 24.885 L 20.002 24.885 L 19.002 24.885 Z M 6.667 24.885 L 7.667 24.885 L 7.667 22.668 L 6.667 22.668 L 5.667 22.668 L 5.667 24.885 L 6.667 24.885 Z M 6.667 22.668 L 7.667 22.668 C 7.667 22.226 7.843 21.802 8.155 21.49 L 7.448 20.783 L 6.741 20.076 C 6.054 20.763 5.667 21.696 5.667 22.668 L 6.667 22.668 Z M 7.448 20.783 L 8.155 21.49 C 8.468 21.177 8.892 21.002 9.334 21.002 L 9.334 20.002 L 9.334 19.002 C 8.362 19.002 7.429 19.388 6.741 20.076 L 7.448 20.783 Z M 9.334 20.002 L 9.334 21.002 L 17.335 21.002 L 17.335 20.002 L 17.335 19.002 L 9.334 19.002 L 9.334 20.002 Z M 17.335 20.002 L 17.335 21.002 C 17.777 21.002 18.201 21.177 18.513 21.49 L 19.22 20.783 L 19.928 20.076 C 19.24 19.388 18.307 19.002 17.335 19.002 L 17.335 20.002 Z M 19.22 20.783 L 18.513 21.49 C 18.826 21.802 19.002 22.226 19.002 22.668 L 20.002 22.668 L 21.002 22.668 C 21.002 21.696 20.615 20.763 19.928 20.076 L 19.22 20.783 Z M 20.002 22.668 L 19.002 22.668 L 19.002 24.885 L 20.002 24.885 L 21.002 24.885 L 21.002 22.668 L 20.002 22.668 Z M 26.669 13.334 L 25.669 13.334 C 25.669 20.147 20.147 25.669 13.334 25.669 L 13.334 26.669 L 13.334 27.669 C 21.251 27.669 27.669 21.251 27.669 13.334 L 26.669 13.334 Z M 13.334 26.669 L 13.334 25.669 C 6.522 25.669 1 20.147 1 13.334 L 0 13.334 L -1 13.334 C -1 21.251 5.418 27.669 13.334 27.669 L 13.334 26.669 Z M 0 13.334 L 1 13.334 C 1 6.522 6.522 1 13.334 1 L 13.334 0 L 13.334 -1 C 5.418 -1 -1 5.418 -1 13.334 L 0 13.334 Z M 13.334 0 L 13.334 1 C 20.147 1 25.669 6.522 25.669 13.334 L 26.669 13.334 L 27.669 13.334 C 27.669 5.418 21.251 -1 13.334 -1 L 13.334 0 Z M 17.335 10.668 L 16.335 10.668 C 16.335 12.325 14.991 13.668 13.334 13.668 L 13.334 14.668 L 13.334 15.668 C 16.096 15.668 18.335 13.429 18.335 10.668 L 17.335 10.668 Z M 13.334 14.668 L 13.334 13.668 C 11.677 13.668 10.334 12.325 10.334 10.668 L 9.334 10.668 L 8.334 10.668 C 8.334 13.429 10.573 15.668 13.334 15.668 L 13.334 14.668 Z M 9.334 10.668 L 10.334 10.668 C 10.334 9.01 11.677 7.667 13.334 7.667 L 13.334 6.667 L 13.334 5.667 C 10.573 5.667 8.334 7.906 8.334 10.668 L 9.334 10.668 Z M 13.334 6.667 L 13.334 7.667 C 14.991 7.667 16.335 9.01 16.335 10.668 L 17.335 10.668 L 18.335 10.668 C 18.335 7.906 16.096 5.667 13.334 5.667 L 13.334 6.667 Z"
  },
  'check-circle': {
    viewBox: '-1.001 -0.998 12 12',
    d: "M 10.879 3.802 C 10.769 3.261 10.241 2.912 9.7 3.022 C 9.159 3.132 8.809 3.66 8.919 4.201 L 9.899 4.002 L 10.879 3.802 Z M 6.999 1.535 C 7.477 1.811 8.089 1.647 8.365 1.169 C 8.641 0.691 8.477 0.079 7.999 -0.197 L 7.499 0.669 L 6.999 1.535 Z M 4.206 3.794 C 3.816 3.404 3.182 3.404 2.792 3.794 C 2.401 4.185 2.401 4.818 2.792 5.209 L 3.499 4.501 L 4.206 3.794 Z M 4.999 6.001 L 4.292 6.709 L 4.999 7.416 L 5.706 6.709 L 4.999 6.001 Z M 10.706 1.709 C 11.097 1.318 11.097 0.685 10.706 0.294 C 10.316 -0.096 9.682 -0.096 9.292 0.294 L 9.999 1.001 L 10.706 1.709 Z M 9.899 4.002 L 8.919 4.201 C 9.102 5.098 8.972 6.03 8.551 6.842 L 9.438 7.303 L 10.326 7.763 C 10.958 6.545 11.153 5.147 10.879 3.802 L 9.899 4.002 Z M 9.438 7.303 L 8.551 6.842 C 8.129 7.654 7.442 8.297 6.604 8.664 L 7.005 9.58 L 7.406 10.496 C 8.663 9.946 9.694 8.981 10.326 7.763 L 9.438 7.303 Z M 7.005 9.58 L 6.604 8.664 C 5.766 9.031 4.827 9.1 3.945 8.858 L 3.681 9.823 L 3.417 10.787 C 4.741 11.15 6.149 11.047 7.406 10.496 L 7.005 9.58 Z M 3.681 9.823 L 3.945 8.858 C 3.062 8.617 2.289 8.08 1.754 7.338 L 0.943 7.922 L 0.132 8.507 C 0.934 9.62 2.093 10.425 3.417 10.787 L 3.681 9.823 Z M 0.943 7.922 L 1.754 7.338 C 1.22 6.596 0.956 5.692 1.006 4.779 L 0.008 4.723 L -0.991 4.668 C -1.067 6.038 -0.671 7.393 0.132 8.507 L 0.943 7.922 Z M 0.008 4.723 L 1.006 4.779 C 1.057 3.865 1.419 2.997 2.033 2.318 L 1.291 1.647 L 0.549 0.977 C -0.371 1.995 -0.915 3.298 -0.991 4.668 L 0.008 4.723 Z M 1.291 1.647 L 2.033 2.318 C 2.646 1.639 3.474 1.191 4.377 1.049 L 4.222 0.061 L 4.066 -0.927 C 2.711 -0.713 1.469 -0.041 0.549 0.977 L 1.291 1.647 Z M 4.222 0.061 L 4.377 1.049 C 5.281 0.906 6.207 1.078 6.999 1.535 L 7.499 0.669 L 7.999 -0.197 C 6.81 -0.883 5.422 -1.14 4.066 -0.927 L 4.222 0.061 Z M 3.499 4.501 L 2.792 5.209 L 4.292 6.709 L 4.999 6.001 L 5.706 5.294 L 4.206 3.794 L 3.499 4.501 Z M 4.999 6.001 L 5.706 6.709 L 10.706 1.709 L 9.999 1.001 L 9.292 0.294 L 4.292 5.294 L 4.999 6.001 Z"
  }
};
const iconNames = Object.keys(GLYPHS);
function Icon({
  name = 'user-circle',
  size = 20,
  className,
  style
}) {
  const glyph = GLYPHS[name] || GLYPHS['user-circle'];
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: glyph.viewBox,
    fill: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: glyph.d,
    fill: "currentColor",
    fillRule: "nonzero"
  }));
}
Object.assign(__ds_scope, { iconNames, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
// figma: Avatar (Size=SM|MD|LG|XL)
const SIZES = {
  sm: {
    box: 24,
    icon: 12
  },
  md: {
    box: 32,
    icon: 16
  },
  lg: {
    box: 40,
    icon: 20
  },
  xl: {
    box: 64,
    icon: 32
  }
};
function Avatar({
  size = 'md',
  className,
  style
}) {
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      width: s.box,
      height: s.box,
      flexShrink: 0,
      overflow: 'hidden',
      borderRadius: 999,
      background: 'var(--navy-500)',
      color: 'var(--blue-500)',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "user-circle",
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
// figma: Card (standalone symbol 4:474)
function Card({
  title = 'Deploy v1.4.2 Successful',
  status = 'Active',
  statusVariant = 'success',
  body = 'Automated canary deployment completed successfully in 2.4s. 0 errors detected. 100% of network traffic routed to the optimized node cluster.',
  actor = 'Triggered by dev-agent-04',
  meta = 'SHA: 7be1af8',
  children,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: 612,
      borderRadius: 12,
      background: 'var(--neutral-0)',
      boxShadow: 'inset 0 0 0 1px var(--ui-slate-200), 0 1px 2px 0 rgba(0,0,0,0.0392)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 24,
      alignItems: 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 16,
      lineHeight: '100%',
      color: 'var(--ui-slate-900)'
    }
  }, title), status ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: statusVariant
  }, status) : null), children ?? /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'stretch',
      fontFamily: 'var(--font-sans)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--ui-slate-500)'
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      height: 1,
      background: 'var(--ui-slate-200)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '100%',
      color: 'var(--ui-slate-900)'
    }
  }, actor)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 11,
      lineHeight: '100%',
      color: 'var(--ui-slate-400)'
    }
  }, meta)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
// figma: Checkbox (State=Checked|Unchecked)
function Checkbox({
  checked = false,
  label,
  disabled = false,
  onChange,
  id,
  className,
  style
}) {
  const box = /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: 4,
      background: checked ? 'var(--blue-500)' : 'var(--neutral-0)',
      boxShadow: checked ? 'inset 0 0 0 1px var(--blue-500)' : 'inset 0 0 0 1px var(--ui-slate-300)',
      color: 'var(--neutral-0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background var(--duration-fast) var(--ease-standard)'
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check-circle",
    size: 12
  }) : null);
  if (!label) {
    return /*#__PURE__*/React.createElement("span", {
      id: id,
      role: "checkbox",
      "aria-checked": checked,
      "aria-disabled": disabled || undefined,
      onClick: disabled ? undefined : () => onChange && onChange(!checked),
      className: className,
      style: {
        display: 'inline-flex',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style
      }
    }, box);
  }
  return /*#__PURE__*/React.createElement("label", {
    className: className,
    style: {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": checked,
    onClick: disabled ? undefined : () => onChange && onChange(!checked),
    style: {
      display: 'inline-flex'
    }
  }, box), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '100%',
      color: 'var(--ui-slate-900)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/component-specs/Panel.jsx
try { (() => {
// Panel shell used by every block of the Component Specs screen.
// figma: Panel-Buttons / Panel-Inputs / … (radius 12, 24px padding, 1px slate ring)
function Panel({
  title,
  eyebrow,
  gap = 20,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      alignSelf: 'stretch',
      borderRadius: 12,
      background: 'var(--neutral-0)',
      boxShadow: 'inset 0 0 0 1px var(--ui-slate-200)',
      display: 'flex',
      flexDirection: 'column',
      gap,
      padding: 24,
      alignItems: 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '700 18px/1 var(--font-sans)',
      color: 'var(--ui-slate-900)'
    }
  }, title), eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px/1 var(--font-sans)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--ui-slate-400)',
      whiteSpace: 'nowrap'
    }
  }, eyebrow) : null), children);
}
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px/1 var(--font-sans)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--ui-slate-400)'
    }
  }, children);
}
Object.assign(window, {
  Panel,
  Eyebrow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/component-specs/Panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/component-specs/SpecsPanels.jsx
try { (() => {
// The six panels of the Component Specs screen (figma node 4:177).
const {
  Button,
  Input,
  Toggle,
  Checkbox,
  Card,
  Badge,
  Avatar
} = window.CodeBoxxDesignSystem_fb1e23;
const BUTTON_ROWS = [{
  label: 'Small (Height: 32px)',
  size: 'sm',
  texts: ['Primary', 'Secondary', 'Ghost', 'Destructive']
}, {
  label: 'Medium (Height: 40px - Default)',
  size: 'md',
  texts: ['Primary Control', 'Secondary Action', 'Ghost Link', 'Delete Resource']
}, {
  label: 'Large (Height: 48px)',
  size: 'lg',
  texts: ['Submit Build', 'Cancel Order', 'Learn More', 'Terminate Server']
}];
function PanelButtons({
  onAction
}) {
  return /*#__PURE__*/React.createElement(Panel, {
    title: "01. Buttons",
    eyebrow: "Primary, Secondary, Ghost, Destructive"
  }, BUTTON_ROWS.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.size,
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, r.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: r.size,
    variant: "primary",
    onClick: () => onAction(r.texts[0])
  }, r.texts[0]), /*#__PURE__*/React.createElement(Button, {
    size: r.size,
    variant: "secondary",
    onClick: () => onAction(r.texts[1])
  }, r.texts[1]), /*#__PURE__*/React.createElement(Button, {
    size: r.size,
    variant: "ghost",
    onClick: () => onAction(r.texts[2])
  }, r.texts[2]), /*#__PURE__*/React.createElement(Button, {
    size: r.size,
    variant: "destructive",
    onClick: () => onAction(r.texts[3])
  }, r.texts[3])))));
}
function PanelInputs() {
  const [endpoint, setEndpoint] = React.useState('https://api.codeboxx.io/v1');
  const [branch, setBranch] = React.useState('feature/canary-deployment');
  const [uri, setUri] = React.useState('mongodb://localhost:27017');
  const valid = /^mongodb\+srv:\/\//.test(uri);
  return /*#__PURE__*/React.createElement(Panel, {
    title: "02. Input Fields",
    eyebrow: "State Validation"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "API Endpoint",
    value: endpoint,
    onChange: e => setEndpoint(e.target.value),
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Canary Branch",
    state: "focused",
    value: branch,
    onChange: e => setBranch(e.target.value),
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Database Connection URI",
    state: valid ? 'default' : 'error',
    value: uri,
    onChange: e => setUri(e.target.value),
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Platform Organization",
    state: "disabled",
    value: "codeboxx-enterprise-primary",
    style: {
      width: '100%'
    }
  }));
}
function PanelControls({
  enabled,
  setEnabled,
  second,
  setSecond,
  selected,
  setSelected,
  unselected,
  setUnselected
}) {
  return /*#__PURE__*/React.createElement(Panel, {
    title: "03. Toggles & Checkboxes",
    eyebrow: "Binary Triggers",
    gap: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Toggle States"), /*#__PURE__*/React.createElement(Toggle, {
    on: enabled,
    label: "Enabled",
    onChange: setEnabled
  }), /*#__PURE__*/React.createElement(Toggle, {
    on: second,
    label: "Disabled",
    onChange: setSecond
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Checkbox States"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: selected,
    label: "Selected",
    onChange: setSelected
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: unselected,
    label: "Unselected",
    onChange: setUnselected
  })));
}
function PanelCard({
  deployed
}) {
  return /*#__PURE__*/React.createElement(Panel, {
    title: "04. Standard Card",
    eyebrow: "Blueprint Card",
    gap: 16
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      width: '100%'
    },
    title: deployed ? 'Deploy v1.4.3 Queued' : 'Deploy v1.4.2 Successful',
    status: deployed ? 'Pending' : 'Active',
    statusVariant: deployed ? 'warning' : 'success',
    body: deployed ? 'Build submitted to the canary lane. Waiting on the optimized node cluster to drain existing traffic before promotion.' : 'Automated canary deployment completed successfully in 2.4s. 0 errors detected. 100% of network traffic routed to the optimized node cluster.',
    meta: deployed ? 'SHA: c04d1e2' : 'SHA: 7be1af8'
  }));
}
function PanelBadgesAvatars() {
  return /*#__PURE__*/React.createElement(Panel, {
    title: "05. Badges & Avatars",
    eyebrow: "Status & Identity",
    gap: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Pill Badges"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, null, "Default"), /*#__PURE__*/React.createElement(Badge, {
    variant: "brand"
  }, "Brand"), /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "Success"), /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, "Warning"), /*#__PURE__*/React.createElement(Badge, {
    variant: "error"
  }, "Error"))), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Avatar Sizes (SM, MD, LG, XL)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: "sm"
  }), /*#__PURE__*/React.createElement(Avatar, {
    size: "md"
  }), /*#__PURE__*/React.createElement(Avatar, {
    size: "lg"
  }), /*#__PURE__*/React.createElement(Avatar, {
    size: "xl"
  }))));
}
const SWATCHES = [{
  name: 'Primary',
  value: '#000000'
}, {
  name: 'Secondary',
  value: '#43B4F0'
}, {
  name: 'Tertiary',
  value: '#2D78A0'
}, {
  name: 'Fourth',
  value: '#002F43'
}, {
  name: 'Accent 1',
  value: '#F2D114'
}, {
  name: 'Accent 2',
  value: '#BC2325'
}];
function PanelPalette({
  onPick,
  picked
}) {
  return /*#__PURE__*/React.createElement(Panel, {
    title: "06. Brand Palette Swatches",
    gap: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, SWATCHES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.name,
    onClick: () => onPick(s),
    style: {
      width: 100,
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'flex-start',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'stretch',
      height: 60,
      borderRadius: 6,
      background: s.value,
      boxShadow: picked === s.name ? 'inset 0 0 0 3px var(--blue-500)' : 'inset 0 0 0 1px var(--ui-slate-200)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 11px/1 var(--font-sans)',
      color: 'var(--ui-slate-900)'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 10px/1 var(--font-sans)',
      color: 'var(--ui-slate-500)'
    }
  }, s.value)))));
}
Object.assign(window, {
  PanelButtons,
  PanelInputs,
  PanelControls,
  PanelCard,
  PanelBadgesAvatars,
  PanelPalette
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/component-specs/SpecsPanels.jsx", error: String((e && e.message) || e) }); }

// ui_kits/component-specs/SpecsScreen.jsx
try { (() => {
// figma node 4:177 "codeboxx-components" — 1440px, slate-50 page, 48px padding, 32px gap.
const {
  Logo,
  TopTitle
} = window.CodeBoxxDesignSystem_fb1e23;
function SpecsHeader({
  toast
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      alignSelf: 'stretch',
      minHeight: 152,
      borderRadius: 16,
      background: 'var(--navy-500)',
      display: 'flex',
      flexDirection: 'row',
      padding: 32,
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(TopTitle, {
    theme: "dark"
  }, "Section Top Title"), /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 99,
      background: 'var(--yellow-500)',
      padding: '4px 12px',
      font: '700 12px/1 var(--font-sans)',
      color: 'rgb(0,0,0)',
      whiteSpace: 'nowrap'
    }
  }, "v1.0.0 Stable")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      alignSelf: 'stretch',
      font: '400 16px/1 var(--font-sans)',
      color: 'var(--blue-500)'
    }
  }, toast || 'CodeBoxx component specifications and interactive controls library. Built for real-time developer metrics and container platforms.')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280,
      height: 54,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    theme: "dark",
    width: 280
  })));
}
function SpecsScreen() {
  const [toast, setToast] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const [second, setSecond] = React.useState(false);
  const [selected, setSelected] = React.useState(true);
  const [unselected, setUnselected] = React.useState(false);
  const [picked, setPicked] = React.useState(null);
  const flash = msg => {
    setToast(msg);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast(''), 2400);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1440,
      minHeight: 1500,
      background: 'var(--ui-slate-50)',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      padding: 48,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(SpecsHeader, {
    toast: toast
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      gap: 24,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      flexBasis: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PanelButtons, {
    onAction: label => flash(`"${label}" dispatched to the build queue.`)
  }), /*#__PURE__*/React.createElement(PanelInputs, null), /*#__PURE__*/React.createElement(PanelControls, {
    enabled,
    setEnabled,
    second,
    setSecond,
    selected,
    setSelected,
    unselected,
    setUnselected
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      flexBasis: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PanelCard, {
    deployed: !enabled
  }), /*#__PURE__*/React.createElement(PanelBadgesAvatars, null), /*#__PURE__*/React.createElement(PanelPalette, {
    picked: picked,
    onPick: s => {
      setPicked(s.name);
      flash(`${s.name} — ${s.value} copied to the palette.`);
    }
  }))));
}
Object.assign(window, {
  SpecsScreen,
  SpecsHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/component-specs/SpecsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-hero/HeroScreen.jsx
try { (() => {
// figma node 5:56 "Hero" — the only marketing surface the file defines.
const {
  Hero
} = window.CodeBoxxDesignSystem_fb1e23;
const HEADLINES = [{
  eyebrow: 'AI-First, Human-Built',
  before: 'We build ',
  highlight: 'AI-Native',
  after: ' teams and software that outwork the old way.'
}];
function HeroScreen() {
  const h = HEADLINES[0];
  return /*#__PURE__*/React.createElement(Hero, {
    eyebrow: h.eyebrow,
    backgroundImage: "../../assets/hero-bg.png"
  }, h.before, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--blue-500)'
    }
  }, h.highlight), h.after);
}
Object.assign(window, {
  HeroScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-hero/HeroScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.TopTitle = __ds_scope.TopTitle;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.Icon = __ds_scope.Icon;

})();
