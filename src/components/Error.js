import React from 'react';
import { Flex, Box, ButtonCircle, Text } from 'rebass';

const refreshPage = () => {
  window.location.reload();
};
const Error = () => {
  return (
    <Flex align="center" direction="column" justify="center">
      <Box>
        <Text align="center" m={2}>
          Something wrong with an endpoints. Please try again, or wait 10 sec
          for next attempt
        </Text>
      </Box>
      <Flex align="center" justify="center">
        <ButtonCircle onClick={refreshPage}>Try Again</ButtonCircle>
      </Flex>
    </Flex>
  );
};

export default Error;
