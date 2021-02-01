export const AvailableProviders = {
  NOT_PRESENT: {
    check: null,
    id: 'injected',
    logo: null,
    name: 'NOT_PRESENT',
    type: 'NOT_PRESENT',
  },
  VAULT_74: {
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGxWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDMgNzkuMTY0NTI3LCAyMDIwLzEwLzE1LTE3OjQ4OjMyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTItMDdUMjA6MjM6NTUtMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEyLTIzVDAwOjM1OjMyLTA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEyLTIzVDAwOjM1OjMyLTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNjMzQwY2E1LTFmNDctNDRmNS04YmJkLTFmNGM5MGZjZWI4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozZTI4ZWMwZS1jYWZlLTQzZDQtYWYzMi0yYjkzNzBlZWEzNDkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozZTI4ZWMwZS1jYWZlLTQzZDQtYWYzMi0yYjkzNzBlZWEzNDkiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MWExYmM4NTAtM2M2NS0yNDRmLTkxNTItYzkwY2FlY2JiOGRiPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpiOTBlOGE3Mi0xNjZiLTRlNWUtODkxYi02OTE2NTc0ZjgxYWY8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozZTI4ZWMwZS1jYWZlLTQzZDQtYWYzMi0yYjkzNzBlZWEzNDkiIHN0RXZ0OndoZW49IjIwMjAtMTItMDdUMjA6MjM6NTUtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYzM0MGNhNS0xZjQ3LTQ0ZjUtOGJiZC0xZjRjOTBmY2ViODYiIHN0RXZ0OndoZW49IjIwMjAtMTItMjNUMDA6MzU6MzItMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlPxz+EA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',
    name: 'Vault74',
    type: 'vault74',
  },
};

export default {
  clearInjectedProvider(state: any) {
    // eslint-disable-next-line
    state.injectedProvider = null;
  },
  setInjectedProvider(state: any, injectedProvider: any) {
    // eslint-disable-next-line
    state.availableProviders = state.availableProviders.filter(
      availableProvider => availableProvider.type !== 'injected');

    if (injectedProvider) {
      // eslint-disable-next-line
      state.injectedProvider = injectedProvider;
      // eslint-disable-next-line
      state.availableProviders.push(injectedProvider);
    } else {
      // eslint-disable-next-line
      state.injectedProvider = AvailableProviders.NOT_PRESENT;
    }
  },
  setSelectedProvider(state: any, provider: any) {
    // eslint-disable-next-line
    state.selectedProvider = provider;
  },
};
