import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Flex, Spacer, Heading } from "@chakra-ui/react";

function Navbar() {
  return (
    <Box bg="blue.900" p={4} color="white">
      <Flex align="center">
        {/* App Name or Logo */}
        <Heading size="md">HandTalk AI</Heading>

        <Spacer /> {/* Pushes buttons to the right */}

        {/* Navigation Buttons */} 
        <Button colorScheme="teal" mr={2}>
          <Link to="/register">Register</Link>
        </Button>
        <Button colorScheme="teal">
          <Link to="/signin">SignIn</Link>
        </Button>
      </Flex>
    </Box>
  );
}

export default Navbar;
