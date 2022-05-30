const express = require("express");
const cors = require("cors");
const searchResults = require('./routes/searchResults')

require("dotenv").config();

const PORT = process.env.PORT || 9000;
// init express
const app = express();

// enable cors
app.use(cors());

// for parsing JSON requests
app.use(express.json());

// routes
app.use('/api/search', searchResults);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cred', require('./routes/credentials'));

app.listen(PORT, () =>
    console.log(`Back-end server running. Visit http://localhost:${PORT}`));

// Database stuff
const mongo = require('./mongo/mongoBot');

async function setupDB() { await mongo.init();}
setupDB().then(r => {});
