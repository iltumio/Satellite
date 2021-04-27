import { IState } from '../createState';

export default {
  toggleStickers(state: IState) {
    if (state.stickerPack) {
      state.stickersOpen = false;
      state.stickerPack = false;
    } else {
      state.stickersOpen = !state.stickersOpen;
    }
  },
  showStickerPack(state: IState, pack: any) {
    state.stickerPack = pack;
  },
  authenticated(state: IState) {
    state.authenticated = true;
  },
  buckets(state: IState) {
    state.buckets = true;
  },
  // Used to hotswitch dark mode from anywhere in the app
  toggleDarkMode(state: IState) {
    state.settings.darkMode = !state.settings.darkMode;
  },
  toggleSidebar(state: IState) {
    state.sidebarOpen = !state.sidebarOpen;
  },
  setMobileSidebar(state: IState, data) {
    state.sidebarMobileOpen = data;
  },
  setSidebar(state: IState, data) {
    state.sidebarOpen = data;
  },
  toggleMobileSidebar(state: IState) {
    state.sidebarMobileOpen = !state.sidebarMobileOpen;
  },
  activeChat(state: IState, address: string) {
    state.activeChat = address;
    state.group = false;
  },
  // Change the mian route of the application
  changeRoute(state: IState, route: string) {
    state.mainRoute = route;
  },

  chatWith(state: IState, address: string) {
    const { activeChats } = state;
    const filteredOutAddy = activeChats.filter((a: string) => a !== address);
    filteredOutAddy.unshift(address);

    state.activeChats = filteredOutAddy;
  },
  toggleUserInfo(state: IState) {
    state.showUser = !state.showUser;
  },
  showCreateGroup(state: IState, shown: boolean) {
    state.showCreateGroup = shown;
  },
  toggleGroupInfo(state: IState) {
    state.showGroupInfo = !state.showGroupInfo;
  },
};
