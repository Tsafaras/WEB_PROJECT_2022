const router = require('express').Router();
const {purge, connectOff, connectOn, upload} = require('../mongo/mongoBot');
const multer = require('multer');
const fs = require("fs");
const buffer = require("buffer");
const uploadDest = multer({storage: multer.memoryStorage()});

router.route('/data')
    .post(uploadDest.single('file'), async (req, res) => {
        try {
            const file = JSON.parse(req.file.buffer.toString('utf-8'));
            await connectOn();
            await upload(file);
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

module.exports = router;
