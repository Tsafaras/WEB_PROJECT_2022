const router = require('express').Router();
const mongo = require('../mongo/mongoBot');

router.route('/data')
    .post(async (req, res) => {
        // await mongo.POIs.addPOI(req.body);
        res.status(200).send({status: "ok", data: `Added.`});
    })
    .delete(async (req, res) => {
        await mongo.purge();
        console.log('Dropped collection POIs collection.');
        res.status(200).send({status: "ok", data: `Purged.`});
    })
    .get(async (req, res) => {
    //    TODO Definition
    })

module.exports = router;
