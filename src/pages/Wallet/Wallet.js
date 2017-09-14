import React from 'react';
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
                {wallet.amount} {wallet.currency} <br />
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
export default Wallet;
