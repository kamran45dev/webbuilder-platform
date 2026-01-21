// src/polyfills.js
globalThis.debug = function(namespace) {
  return function(...args) {
    // Silent no-op
  };
};
globalThis.debug.enable = () => {};
globalThis.debug.disable = () => {};
globalThis.debug.enabled = () => false;
globalThis.debug.coerce = (val) => val;
globalThis.debug.formatters = {};