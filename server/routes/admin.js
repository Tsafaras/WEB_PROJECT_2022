const router = require('express').Router();
const {purge, connectOff, connectOn, generate} = require('../mongo/mongoBot');
const multer = require('multer');
const {add_POI} = require("../mongo/POIs");
const uploadDest = multer({storage: multer.memoryStorage()});

router.route('/data')
    .post(uploadDest.single('file'), async (req, res) => {
        try {
            const file = JSON.parse(req.file.buffer.toString('utf-8'));
            await connectOn();
            await add_POI(file);
            await connectOff();
            res.status(200).send({uploaded: true});
        } catch (err) {
                return res.status(200).send({wrong_schema: true});
        }
    })
    .delete(async (req, res) => {
        await connectOn();
        await purge();
        await connectOff();
        res.status(200).send({purged: true});
    })

router.route('/generate').post(async (req, res) => {
    await connectOn();
    await generate(req.body.num_of_users, req.body.date_start, req.body.date_end);
    await connectOff();
    res.status(200).send({generated: true})
})

module.exports = router;
