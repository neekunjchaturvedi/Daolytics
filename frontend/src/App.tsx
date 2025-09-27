import { Switch, Route } from "wouter";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apollo";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProposalList } from "./pages/ProposalList";
import { ProposalDetail } from "./pages/ProposalDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProposalList} />
      <Route path="/proposal/:proposalId" component={ProposalDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider defaultTheme="light" storageKey="daolytics-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
