"use client";
import PropTypes from "prop-types";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export default function Providers(props) {
  return (
    <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
