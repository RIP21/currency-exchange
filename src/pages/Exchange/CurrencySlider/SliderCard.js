import React from 'react';
import { Flex, Input, Heading, Small } from 'rebass';
import styled from 'styled-components';

const StyledInput = Input.extend`
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
`;

class SliderCard extends React.PureComponent {
  render() {
    const { currency, reverseRate, onChange, name, value } = this.props;
    return (
      <Page>
        <Heading>{currency}</Heading>
        <Flex align="flex-end" direction="column">
          <StyledInput
            name={name}
            placeholder={0}
            value={value}
            onChange={onChange}
          />
          <Small>{reverseRate}</Small>
        </Flex>
      </Page>
    );
  }
}

export default SliderCard;
