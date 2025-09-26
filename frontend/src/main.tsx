// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo-client.ts"; // <-- Import the client
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      {" "}
      {/* <-- Wrap your App */}
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
