import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "wouter";
import { ProposalCard, type Proposal } from "../components/ProposalCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Header } from "../components/Header";

const GET_PROPOSALS = gql`
  query GetProposals {
    proposals(first: 10, orderBy: creationTimestamp, orderDirection: desc) {
      id
      proposer
      description
      state
      creationTimestamp
      votesFor
      votesAgainst
    }
  }
`;

export function ProposalList() {
  const [, setLocation] = useLocation();
  const { loading, error, data, refetch } = useQuery(GET_PROPOSALS);

  const handleProposalClick = (proposalId: string) => {
    setLocation(`/proposal/${proposalId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="DAOlytics" />
        <LoadingSpinner text="Loading proposals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="DAOlytics" />
        <ErrorMessage 
          title="Failed to load proposals"
          message={error.message} 
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="DAOlytics" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" data-testid="text-subtitle">
            Latest Uniswap Proposals
          </h2>
          <p className="text-muted-foreground" data-testid="text-description">
            Track governance proposals and community voting in real-time
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-proposals">
          {(data as any)?.proposals?.map((proposal: Proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onClick={() => handleProposalClick(proposal.id)}
            />
          ))}
        </div>

        {(data as any)?.proposals?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-proposals">
              No proposals found.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}