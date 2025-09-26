import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import "./App.css";

// 1. Define your GraphQL query
const GET_PROPOSALS = gql`
  query GetProposals {
    proposals(first: 5, orderBy: creationTimestamp, orderDirection: desc) {
      id
      proposer
      description
      votesFor
      votesAgainst
    }
  }
`;

function App() {
  // 2. Execute the query
  const { loading, error, data } = useQuery(GET_PROPOSALS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  // 3. Render the data
  return (
    <div>
      <h1>DAOlytics</h1>
      <h2>Latest Uniswap Proposals</h2>
      {data.proposals.map((proposal: any) => (
        <div
          key={proposal.id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{proposal.description.slice(0, 50)}...</h3>
          <p>Proposer: {proposal.proposer}</p>
          <p>Votes For: {proposal.votesFor}</p>
          <p>Votes Against: {proposal.votesAgainst}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
