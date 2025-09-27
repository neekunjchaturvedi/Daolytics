import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Configure the GraphQL endpoint for Uniswap subgraph
const httpLink = createHttpLink({
  uri: "https://api.studio.thegraph.com/query/121734/uniswap/version/latest", // Example endpoint
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "ignore",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
