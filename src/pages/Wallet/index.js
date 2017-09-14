import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Wallet from './Wallet';
import { getIsLoaded, getError } from 'redux/selectors/data';
import { getWallets } from 'redux/selectors/wallet';
import { branch, compose, renderNothing, renderComponent } from 'recompose';
import Error from 'components/Error';

const mapStateToProps = createStructuredSelector({
  wallets: getWallets,
  isLoaded: getIsLoaded,
  error: getError
});

const withRenderNothingUntilLoaded = branch(
  props => !props.isLoaded,
  renderNothing
);

const withRenderErrorMessageIfError = branch(
  props => props.error !== null,
  renderComponent(Error)
);

export default compose(
  connect(mapStateToProps, {}),
  withRenderErrorMessageIfError,
  withRenderNothingUntilLoaded
)(Wallet);
