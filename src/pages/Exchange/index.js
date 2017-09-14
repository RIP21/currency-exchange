import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Exchange from './Exchange';
import { getRates, getIsLoaded, getError } from 'redux/selectors/data';
import { branch, compose, renderNothing, renderComponent } from 'recompose';
import Error from 'components/Error';

const mapStateToProps = createStructuredSelector({
  rates: getRates,
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
)(Exchange);
