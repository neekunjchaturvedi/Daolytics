// src/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/121734/uniswap/1", // Your API Endpoint
});

// Create the Apollo Client
const client = new ApolloClient({
  link: httpLink, // Use the 'link' property
  cache: new InMemoryCache(),
});

export default client;
