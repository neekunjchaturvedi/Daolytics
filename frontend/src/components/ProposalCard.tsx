import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Vote } from "lucide-react";
import { formatVoteCount, truncateAddress, formatTimestamp } from "../utils/formatters";

export interface Proposal {
  id: string;
  description: string;
  proposer: string;
  state?: string;
  creationTimestamp?: string;
  votesFor?: string;
  votesAgainst?: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
  const getStateColor = (state?: string) => {
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

  const totalVotes = proposal.votesFor && proposal.votesAgainst 
    ? BigInt(proposal.votesFor) + BigInt(proposal.votesAgainst)
    : BigInt(0);

  const forPercentage = totalVotes > 0 && proposal.votesFor
    ? Number((BigInt(proposal.votesFor) * BigInt(100)) / totalVotes)
    : 0;

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={onClick}
      data-testid={`card-proposal-${proposal.id}`}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold line-clamp-2 flex-1" data-testid={`text-title-${proposal.id}`}>
            {proposal.description.length > 80 
              ? `${proposal.description.slice(0, 80)}...` 
              : proposal.description}
          </h3>
          {proposal.state && (
            <Badge className={getStateColor(proposal.state)} data-testid={`badge-state-${proposal.id}`}>
              {proposal.state}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span data-testid={`text-proposer-${proposal.id}`}>
              {truncateAddress(proposal.proposer)}
            </span>
          </div>
          
          {proposal.creationTimestamp && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span data-testid={`text-timestamp-${proposal.id}`}>
                {formatTimestamp(proposal.creationTimestamp)}
              </span>
            </div>
          )}
        </div>

        {proposal.votesFor && proposal.votesAgainst && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Vote className="h-4 w-4" />
                <span>Votes</span>
              </div>
              <span className="text-muted-foreground">
                {formatVoteCount(totalVotes.toString())} total
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-chart-2">For ({forPercentage}%)</span>
                <span className="text-destructive">Against ({100 - forPercentage}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-chart-2 transition-all duration-500"
                  style={{ width: `${forPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}