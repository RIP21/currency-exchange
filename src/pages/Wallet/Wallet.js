import React from 'react';
import PT from 'prop-types';
import { ButtonCircle, Flex, Box } from 'rebass';
import map from 'lodash/map';

class Wallet extends React.Component {
  render() {
    const { wallets, onExchangeOpen } = this.props;
    return (
      <Flex align="center" direction="column" justify="center">
        <Box m={10}>
          {map(wallets, wallet => {
            return (
              <Box key={wallet.id} m={10}>
                {wallet.amount.toFixed(2)} {wallet.currency} <br />
              </Box>
            );
          })}
        </Box>
        <Box>
          <ButtonCircle onClick={onExchangeOpen}>Exchange</ButtonCircle>
        </Box>
      </Flex>
    );
  }
}

Wallet.propTypes = {
  error: PT.object,
  isLoaded: PT.bool.isRequired,
  wallets: PT.object.isRequired,
  onExchangeOpen: PT.func.isRequired
};

export default Wallet;
