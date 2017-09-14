import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Exchange from './Exchange';
import { getRates, getIsLoaded, getError } from 'redux/selectors/data';
import { branch, compose, renderNothing } from 'recompose';

const mapStateToProps = createStructuredSelector({
  rates: getRates,
  isLoaded: getIsLoaded,
  error: getError
});

export default compose(
  connect(mapStateToProps, {}),
  branch(props => !props.isLoaded, renderNothing)
)(Exchange);
