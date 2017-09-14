import React from 'react';
import { Flex } from 'rebass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import Exchange from './pages/Exchange';
import Wallet from './pages/Wallet';

const Container = Flex.extend`height: 100vh;`;

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: inset 0 0 0 1px #dee1e3;
  border-radius: 4px;
  width: 400px;
  padding: 10px;
  height: 540px;
`;

class App extends React.Component {
  state = {
    exchangeOpen: false
  };

  onExchangeOpen = () => {
    this.setState({ exchangeOpen: true });
  };

  onExchangeClose = () => {
    this.setState({ exchangeOpen: false });
  };

  render() {
    const { exchangeOpen } = this.state;
    return (
      <Container align="center" justify="center">
        <Screen>
          {exchangeOpen ? (
            <Exchange onExchangeClose={this.onExchangeClose} />
          ) : (
            <Wallet onExchangeOpen={this.onExchangeOpen} />
          )}
        </Screen>
      </Container>
    );
  }
}
export default App;
