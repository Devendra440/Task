// import React from 'react'

// const Registrtion = () => {
//   return (
//     <div>
//       <form>
//         <h1>Registration</h1>
//         <input type="text" placeholder="First Name" id='name' />
//         <input type="text" placeholder="Last Name" id ='last' />
//         <input type="email" placeholder="Email" id='mail' />
//         <input type="password" placeholder="Password" id='password'/>
//         <input type="password" placeholder="Confirm Password" id='confirm'/>
//         <button>Register</button>
//         </form>
// </div>
//   )
// }

// export default Registrtion;


import { useState, useEffect } from "react";
import axios from "axios";

export default function VotingApp() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/candidates").then((response) => {
      setCandidates(response.data);
    });
  }, []);

  const vote = () => {
    if (!selectedCandidate) return;
    axios.post("http://localhost:5000/vote", { candidate: selectedCandidate })
      .then(() => alert("Vote submitted successfully!"))
      .catch(() => alert("Error submitting vote"));
  };

  return (
    <div className="p-4 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Vote for Your Candidate</h1>
      <ul className="mb-4">
        {candidates.map((candidate) => (
          <li key={candidate._id} className="mb-2">
            <label>
              <input
                type="radio"
                name="candidate"
                value={candidate.name}
                onChange={() => setSelectedCandidate(candidate.name)}
              />
              {" "}
              {candidate.name}
            </label>
          </li>
        ))}
      </ul>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={vote}
      >
        Submit Vote
      </button>
    </div>
  );
}