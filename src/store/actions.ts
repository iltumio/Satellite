import friendsActions from './actions/friendsActions';
import web3Actions from './actions/web3Actions';
import stickersActions from './actions/stickersActions';
import threadActions from './actions/threadActions';
import p2pActions from "./actions/p2pActions";
import databaseActions from "./actions/databaseActions";
import startup from "./actions/startupActions";
import walletActions from "./actions/walletActions";

export default {
  ...friendsActions,
  ...web3Actions,
  ...stickersActions,
  ...threadActions,
  ...p2pActions,
  ...databaseActions,
  ...walletActions,
  ...startup,
};
