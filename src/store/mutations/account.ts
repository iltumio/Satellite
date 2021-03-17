import { IState } from '../createState';

export default {
  localAccount(state: IState) {
    state.localAccount = true;
  },
  // Update the accounts provided from the web3 provider
  accounts(state: IState, accounts: string[]) {
    state.accounts = accounts;
  },
  // Update the default account we should use for transactions
  defaultAccount(state: IState) {
    state.activeAccount = state.activeAccount || state.accounts?.[0];
    if (!state.accounts?.includes(state.activeAccount)) {
      // Detect account changes
      state.activeAccount = state.accounts?.[0];
    }
  },
  // Update the balance of the active web3 account
  balance(state: IState, balance: number) {
    state.balance = balance;
  },
  // Update the dweller address used for profile information
  dwellerAddress(state: IState, address: string) {
    state.dwellerAddress = address;
  },
  // Updates the username for the authenticated user
  username(state: IState, username: string) {
    state.username = username;
  },
  // Updates the profile picture hash for the authenticated user
  profilePictureHash(state: IState, hash: string) {
    state.profilePictureHash = hash;
  },
  // Update the application status
  setStatus(state: IState, status: string) {
    state.status = status;
  }
};
