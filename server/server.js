const express = require("express");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 9000;
// init express
const app = express();

// enable cors
app.use(cors());

// for parsing JSON requests
app.use(express.json());

// routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cred', require('./routes/credentials'));
app.use('/api/user', require('./routes/user'));

app.listen(PORT, () =>
    console.log(`Back-end server running. Visit http://localhost:${PORT}`));

// Database stuff
const mongo = require('./mongo/mongoBot').init;

async function setupDB() { await mongo();}
setupDB().then(r => {});
