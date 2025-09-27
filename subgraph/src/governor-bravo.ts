import { BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts"; // <-- Import dataSource
import {
  ProposalCreated,
  VoteCast,
} from "../generated/UniswapGovernor/GovernorBravo"; // This will work for both if ABIs are compatible
import { DAO, Proposal, Vote } from "../generated/schema";

// This function now creates a DAO entity for each unique data source
function getOrCreateDAO(dataSourceName: string): DAO {
  // Use the contract address as the unique ID
  let daoId = dataSource.address().toHexString();
  let dao = DAO.load(daoId);

  if (dao == null) {
    dao = new DAO(daoId);
    if (dataSourceName == "UniswapGovernor") {
      dao.name = "Uniswap";
    } else if (dataSourceName == "ArbitrumGovernor") {
      dao.name = "Arbitrum";
    }
    dao.proposalCount = BigInt.fromI32(0);
    dao.delegateCount = BigInt.fromI32(0);
  }
  return dao;
}

export function handleProposalCreated(event: ProposalCreated): void {
  // Get the name of the data source this event came from
  let dao = getOrCreateDAO(dataSource.name());
  dao.proposalCount = dao.proposalCount.plus(BigInt.fromI32(1));

  // The rest of the logic is the same
  let proposal = new Proposal(event.params.id.toString());
  proposal.dao = dao.id; // Link to the correct DAO
  proposal.proposer = event.params.proposer;
  proposal.description = event.params.description;
  // ... etc

  dao.save();
  proposal.save();
}

export function handleVoteCast(event: VoteCast): void {
  let proposalId = event.params.proposalId.toString();
  let voterAddress = event.params.voter;

  // --- 1. Load the corresponding Proposal ---
  let proposal = Proposal.load(proposalId);
  if (proposal == null) {
    // This should not happen in a real scenario, but it's good practice
    return;
  }

  // --- 2. Create a new Vote entity ---
  // Create a unique ID for the vote: "proposalId-voterAddress"
  let voteId = proposalId + "-" + voterAddress.toHexString();
  let vote = new Vote(voteId);
  vote.proposal = proposal.id;
  vote.voter = voterAddress;
  vote.weight = event.params.votes;
  vote.reason = event.params.reason;

  // support: 0 = Against, 1 = For, 2 = Abstain
  // We'll treat Abstain as "against" for simplicity, or you can add another field
  if (event.params.support == 1) {
    vote.support = true;
    proposal.votesFor = proposal.votesFor.plus(event.params.votes);
  } else {
    vote.support = false;
    proposal.votesAgainst = proposal.votesAgainst.plus(event.params.votes);
  }

  // --- 3. Save Entities ---
  vote.save();
  proposal.save(); // Save the updated vote counts on the proposal
}
