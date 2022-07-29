const router = require('express').Router();
const {connectOff, connectOn, possibleContact} = require('../mongo/mongoBot');
const {declareCase, caseHistory} = require('../mongo/Cases')
const {checkIn, visitHistory} = require("../mongo/Visits");

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
        res.status(200).send(found);
    })

router.route('/visit')
    .post(async (req, res) => {
        await connectOn();
        const result = await checkIn(req.body.username, req.body.date, req.body.poi);
        await connectOff();
        res.status(200).send({result: result});
    })
    .get(async (req, res) => {
        await connectOn();
        const found = await visitHistory(req.query.username);
        await connectOff();
        res.status(200).send(found);
    })

router.route('/contacts').get(async (req, res) => {
    await connectOn();
    const found = await possibleContact(req.query.username, new Date(req.query.date));
    await connectOff();
    res.status(200).send(found);
})

module.exports = router;
