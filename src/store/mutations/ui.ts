export default {
  authenticated(state: any) {
    state.authenticated = true;
  },
  buckets(state: any) {
    state.buckets = true;
    console.log('buckets done');
  },
  // Used to hotswitch dark mode from anywhere in the app
  toggleDarkMode(state: any) {
    // eslint-disable-next-line no-param-reassign
    state.settings.darkMode = !state.settings.darkMode;
  },
  toggleSidebar(state: any) {
    // eslint-disable-next-line
    state.sidebarOpen = !state.sidebarOpen;
  },
  activeChat(state: any, address: string) {
    // eslint-disable-next-line no-param-reassign
    state.activeChat = address;
  },
  // Change the mian route of the application
  changeRoute(state: any, route: string) {
    // eslint-disable-next-line no-param-reassign
    state.mainRoute = route;
  },
  // eslint-disable-next-line
  chatWith(state: any, address: string) {
    const { activeChats } = state;
    const filteredOutAddy = activeChats.filter((a: string) => a !== address);
    filteredOutAddy.unshift(address);
    // eslint-disable-next-line
    state.activeChats = filteredOutAddy;
  },
  toggleUserInfo(state: any) {
    // eslint-disable-next-line
    state.showUser = !state.showUser;
  },
};
