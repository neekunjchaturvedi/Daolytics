import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  GovernorBravo,
  ProposalCreated,
  VoteCast,
} from "../generated/GovernorBravo/GovernorBravo";
import { DAO, Proposal, Vote } from "../generated/schema";

// Helper function to load or create our main DAO entity
function getOrCreateDAO(): DAO {
  let dao = DAO.load("1"); // Using a constant ID '1' since we're tracking one DAO
  if (dao == null) {
    dao = new DAO("1");
    dao.proposalCount = BigInt.fromI32(0);
    dao.delegateCount = BigInt.fromI32(0); // Note: We'd need another event to track this accurately
  }
  return dao;
}

export function handleProposalCreated(event: ProposalCreated): void {
  // --- 1. Load or Create DAO ---
  let dao = getOrCreateDAO();
  dao.proposalCount = dao.proposalCount.plus(BigInt.fromI32(1));

  // --- 2. Create Proposal Entity ---
  let proposal = new Proposal(event.params.id.toString());
  proposal.dao = dao.id;
  proposal.proposer = event.params.proposer;
  proposal.description = event.params.description;
  proposal.creationTimestamp = event.block.timestamp;
  proposal.state = "Pending"; // Initial state
  proposal.votesFor = BigInt.fromI32(0);
  proposal.votesAgainst = BigInt.fromI32(0);

  // --- 3. Save Entities ---
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
