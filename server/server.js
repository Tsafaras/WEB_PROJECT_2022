const express = require("express");
const cors = require("cors");
const searchResults = require('./routes/searchResults')

require("dotenv").config();

const PORT = process.env.PORT || 9000;
// init express
const app = express();

// enable cors
app.use(cors());

// routes
// path of use case - require ( relevant file )
app.use('/api/search', searchResults);

// app.get('/api/search', (req, res) => {
//     res.json({success: "true"});
// })

// Handle Production
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(`${__dirname}/public`));
// }

app.listen(PORT, () =>
    console.log(`Back-end server running. Visit http://localhost:${PORT}`));

// Database stuff
const mongo = require('./mongo/mongo');

async function setupDB() { await mongo.init();}
setupDB().then(r => {});
