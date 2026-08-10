// The CodeBoxx design system ships as a compiled UMD-style bundle that calls
// React.createElement and publishes on window. React must exist first, so the
// bundle is loaded with a dynamic import after the globals are set.
import React from 'react';
import ReactDOM from 'react-dom/client';

window.React = React;
window.ReactDOM = ReactDOM;

await import('./_ds_bundle.js');

const ds = window.CodeBoxxDesignSystem_fb1e23;

export const {
  Button, Input, Checkbox, Toggle, Badge, Avatar, Card, Logo, TopTitle, Hero, Icon,
} = ds;

export default ds;
