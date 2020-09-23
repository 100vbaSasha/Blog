const express = require('express');
const router = express.Router();

const models = require('../models');

//comment is add
router.post('/add', async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    console.log(req.body);
    
    if(!userId || !userLogin) {
        res.json({
            ok: false
        });
    } else {
        const post = req.body.post;
        const body = req.body.body;
        const parent = req.body.parent;

        try {
            if(!parent) {
                await models.Comment.create({
                    post,
                    body,
                    owner: userId
                })
            }
        } catch (error) {
            res.json({
                ok: false
            });
        }
    }
});
module.exports = router;