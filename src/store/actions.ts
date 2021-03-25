import friendsActions from './actions/friendsActions';
import web3Actions from './actions/web3Actions';
import stickersActions from './actions/stickersActions';
import threadActions from './actions/threadActions';

export default {
  ...friendsActions,
  ...web3Actions,
  ...stickersActions,
  ...threadActions
};
