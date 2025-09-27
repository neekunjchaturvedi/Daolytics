import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Header } from "../components/Header";
import { VoteIndicator } from "../components/VoteIndicator";
import { formatVoteCount, truncateAddress, formatTimestamp } from "../utils/formatters";
import { User, Vote, Clock, TrendingUp } from "lucide-react";

const GET_SINGLE_PROPOSAL = gql`
  query GetSingleProposal($id: ID!) {
    proposal(id: $id) {
      id
      description
      proposer
      state
      creationTimestamp
      votesFor
      votesAgainst
      votes(first: 100, orderBy: weight, orderDirection: desc) {
        id
        voter
        support
        weight
        reason
      }
    }
  }
`;

interface Vote {
  id: string;
  voter: string;
  support: boolean;
  weight: string;
  reason?: string;
}

export function ProposalDetail() {
  const [, setLocation] = useLocation();
  const { proposalId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_SINGLE_PROPOSAL, {
    variables: { id: proposalId },
  });

  const handleBack = () => {
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Proposal Details" 
          showBackButton 
          onBack={handleBack}
        />
        <LoadingSpinner text="Loading proposal..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Proposal Details" 
          showBackButton 
          onBack={handleBack}
        />
        <ErrorMessage 
          title="Failed to load proposal"
          message={error.message} 
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!(data as any)?.proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Proposal Details" 
          showBackButton 
          onBack={handleBack}
        />
        <ErrorMessage 
          title="Proposal not found"
          message="The requested proposal could not be found." 
        />
      </div>
    );
  }

  const { proposal } = data as any;
  const totalVotes = BigInt(proposal.votesFor || "0") + BigInt(proposal.votesAgainst || "0");
  const forPercentage = totalVotes > 0 
    ? Number((BigInt(proposal.votesFor || "0") * BigInt(100)) / totalVotes)
    : 0;

  const getStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case "active":
        return "bg-chart-2 text-white";
      case "succeeded":
        return "bg-chart-2 text-white";
      case "executed":
        return "bg-primary text-primary-foreground";
      case "defeated":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-chart-4 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Proposal Details" 
        showBackButton 
        onBack={handleBack}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8 overflow-hidden">
        {/* Proposal Overview */}
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold w-9/10" data-testid="text-proposal-title">
                {proposal.description}
              </h1>
              <Badge className={getStateColor(proposal.state)} data-testid="badge-proposal-state">
                {proposal.state}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Proposer:</span>
                <span className="font-mono" data-testid="text-proposer">
                  {truncateAddress(proposal.proposer)}
                </span>
              </div>
              
              {proposal.creationTimestamp && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span data-testid="text-creation-time">
                    {formatTimestamp(proposal.creationTimestamp)}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Vote Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Vote Summary</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-chart-2/10 rounded-lg">
                  <div className="text-2xl font-bold text-chart-2" data-testid="text-votes-for">
                    {formatVoteCount(proposal.votesFor || "0")}
                  </div>
                  <div className="text-sm text-muted-foreground">For ({forPercentage}%)</div>
                </div>
                
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive" data-testid="text-votes-against">
                    {formatVoteCount(proposal.votesAgainst || "0")}
                  </div>
                  <div className="text-sm text-muted-foreground">Against ({100 - forPercentage}%)</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Votes</span>
                  <span data-testid="text-total-votes">
                    {formatVoteCount(totalVotes.toString())}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-chart-2 transition-all duration-500"
                    style={{ width: `${forPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Top Voters</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proposal.votes.slice(0, 3).map((vote: Vote) => (
                  <div key={vote.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VoteIndicator support={vote.support} size="sm" />
                      <span className="font-mono text-sm" data-testid={`text-voter-${vote.id}`}>
                        {truncateAddress(vote.voter)}
                      </span>
                    </div>
                    <span className="text-sm font-medium" data-testid={`text-vote-weight-${vote.id}`}>
                      {formatVoteCount(vote.weight)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Votes */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">All Votes ({proposal.votes.length})</h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96" data-testid="scroll-votes">
              <div className="space-y-3">
                {proposal.votes.map((vote: Vote) => (
                  <Card key={vote.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <VoteIndicator support={vote.support} />
                          <span className="font-mono text-sm" data-testid={`text-voter-detail-${vote.id}`}>
                            {truncateAddress(vote.voter)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`text-weight-detail-${vote.id}`}>
                            {formatVoteCount(vote.weight)}
                          </div>
                          <div className="text-xs text-muted-foreground">voting power</div>
                        </div>
                      </div>
                      
                      {vote.reason && (
                        <div className="pt-2 border-t">
                          <div className="text-sm font-medium mb-1">Reason:</div>
                          <p className="text-sm text-muted-foreground" data-testid={`text-reason-${vote.id}`}>
                            {vote.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}