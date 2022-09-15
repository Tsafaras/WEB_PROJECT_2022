const router = require('express').Router();
const {connectOff, connectOn, possibleContact} = require('../mongo/mongoBot');
const {declareCase, caseHistory} = require('../mongo/Cases')
const {checkIn, visitHistory} = require("../mongo/Visits");
const {searchPOI} = require("../mongo/POIs");

router.route('/covid')
    .post(async (req, res) => {
        await connectOn();
        const result = await declareCase(req.body.username, req.body.date);
        await connectOff();
        res.status(200).send({result: result});
    })
    .get(async (req, res) => {
        await connectOn();
        const found = await caseHistory(req.query.username);
        await connectOff();
        res.set('Cache-Control', 'private, max-age=3600');
        res.status(200).send(found);
    })

router.route('/visit')
    .post(async (req, res) => {
        await connectOn();
        const result = await checkIn(req.body.username, req.body.poiID, req.body.date, req.body.people);
        await connectOff();
        res.status(200).send({result: result});
    })
    .get(async (req, res) => {
        await connectOn();
        const found = await visitHistory(req.query.username);
        await connectOff();
        res.set('Cache-Control', 'private, max-age=3600');
        res.status(200).send(found);
    })

router.route('/contacts').get(async (req, res) => {
    await connectOn();
    const found = await possibleContact(req.query.username, new Date(req.query.date));
    await connectOff();
    res.set('Cache-Control', 'private, max-age=3600');
    res.status(200).send(found);
})

router.route('/searchPOIs')
    .get(async (req, res) => {
        try {
            await connectOn();
            const results = await searchPOI(req.query.query, req.query.day, req.query.hour, JSON.parse(req.query.bounds));
            await connectOff();
            res.set('Cache-Control', 'private, max-age=900');
            res.status(200).send(results);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    })

module.exports = router;
