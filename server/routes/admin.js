const router = require('express').Router();
const mongo = require('../mongo/mongo');

router.delete('/dropPOIs', async (req, res) => {
    await mongo.purge('POIs');
    console.log('Dropped collection POIs collection.');
    res.status(200).send({status: "ok", data: `Purged.`});
})

router.post('/upload', async (req, res) => {
    await mongo.POIs.addPOI(req.body);
    res.status(200).send({status: "ok", data: `Added.`});
})

router.get('/data', async (req, res) => {

})

module.exports = router;
