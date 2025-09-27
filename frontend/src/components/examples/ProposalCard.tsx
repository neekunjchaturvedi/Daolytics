import { ProposalCard } from '../ProposalCard';

export default function ProposalCardExample() {
  const mockProposal = {
    id: "1",
    description: "Increase fee tier to 0.3% for better liquidity provision and reduced impermanent loss for LPs",
    proposer: "0x1234567890abcdef1234567890abcdef12345678",
    state: "Active",
    creationTimestamp: "1640995200", // Example timestamp
    votesFor: "15000000000000000000000", // 15K votes
    votesAgainst: "8000000000000000000000"  // 8K votes
  };

  return (
    <ProposalCard 
      proposal={mockProposal} 
      onClick={() => console.log('Proposal clicked:', mockProposal.id)}
    />
  );
}