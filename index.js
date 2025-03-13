const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));


const VoteSchema = new mongoose.Schema({
    candidate: String,
    votes: { type: Number, default: 0 }
});

const Vote = mongoose.model("Vote", VoteSchema);


app.get("/votes", async (req, res) => {
    const votes = await Vote.find();
    res.json(votes);
});

app.post("/vote", async (req, res) => {
    const { candidate } = req.body;
    const vote = await Vote.findOneAndUpdate(
        { candidate },
        { $inc: { votes: 1 } },
        { new: true, upsert: true }
    );
    io.emit("voteUpdate", vote);
    res.json(vote);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
