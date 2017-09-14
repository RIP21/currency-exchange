import React from 'react';
import { Flex, Input as RInput, Heading, Small } from 'rebass';
import styled from 'styled-components';
import { FIELDS } from 'constants/exchange';

const Input = styled(RInput).attrs({
  autoComplete: 'off',
  placeholder: 0
})`
  text-align: right; 
  box-shadow: none;
  font-size: 40px;
  padding: 20px;
  &:focus {
    box-shadow: none;
  }
`;

const Page = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 200px;
  max-height: 100%;
  padding: 20px;
  cursor: move;
`;

class SliderCard extends React.PureComponent {
  render() {
    const { currency, forOneMessage, onChange, name, value } = this.props;
    const prefix = name === FIELDS.TO ? '+' : '-';
    return (
      <Page>
        <Heading>{currency}</Heading>
        <Flex align="flex-end" direction="column">
          <Input
            name={name}
            value={value ? prefix + value : value}
            onChange={onChange}
          />
          <Small>{forOneMessage}</Small>
        </Flex>
      </Page>
    );
  }
}

export default SliderCard;
