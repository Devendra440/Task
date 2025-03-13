import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        fetchVotes();
        socket.on("voteUpdate", (updatedVote) => {
            setVotes(prevVotes =>
                prevVotes.map(vote =>
                    vote.candidate === updatedVote.candidate ? updatedVote : vote
                )
            );
        });
    }, []);

    const fetchVotes = async () => {
        const { data } = await axios.get("http://localhost:5000/votes");
        setVotes(data);
    };

    const handleVote = async (candidate) => {
        await axios.post("http://localhost:5000/vote", { candidate });
    };

    return (
        <div className="App">
            <h1>Real-Time Voting</h1>
            {votes.map((vote) => (
                <div key={vote.candidate}>
                    <h3>{vote.candidate}: {vote.votes}</h3>
                    <button onClick={() => handleVote(vote.candidate)}>Vote</button>
                </div>
            ))}
        </div>
    );
}

export default App;
