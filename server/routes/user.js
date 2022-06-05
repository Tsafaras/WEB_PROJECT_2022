const router = require('express').Router();
const {connectOff, connectOn} = require('../mongo/mongoBot');
const {declareCase, caseHistory} = require('../mongo/Cases')

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

module.exports = router;
