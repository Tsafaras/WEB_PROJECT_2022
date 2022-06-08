const router = require('express').Router();
const {connectOn, connectOff} = require('../mongo/mongoBot');
const {changeCred, login, signup} = require("../mongo/Users");

router.route('/login').post(async (req, res) => {
    try {
        await connectOn();
        let password = req.body.password;
        let username = req.body.username;
        let match = await login(username, password) ? username : false ;
        await connectOff();
        return res.status(200).send({success: match });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.route('/signup').post(async (req, res) => {
    try {
        await connectOn();
        const password = req.body.password;
        const username = req.body.username;
        const email = req.body.email;
        const newUser = await signup(username, password, email);
        await connectOff();
        if (typeof newUser === "string") {
            return res.status(200).send({success: false, duplicate: newUser});
        }
        return res.status(200).send({success: newUser});
    } catch (err) {
        if (err.code === 11000) // Error for a duplicate key in MongoDB, based on index.
        {
            return res.status(200).send({
                success: false,
                duplicate: `${Object.keys(err.keyValue)}`});
        }
        res.status(500).json({error: err.message});
    }
})

router.route('/change').post(async (req, res) => {
    await connectOn();
    const result = await changeCred(req.body.username, req.body.field, req.body.value);
    await connectOff();
    return res.status(200).send({result: true});
})

module.exports = router;
