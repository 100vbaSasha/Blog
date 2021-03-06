const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is register
router.post('/register', (req, res) => {
    const login = req.body.login;
    const name = req.body.name;
    const surname = req.body.surname;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if(!login || !name || !surname || !password || !passwordConfirm) {
        const fields = [];
        if(!login) fields.push('login');
        if(!name) fields.push('name');
        if(!surname) fields.push('surname');
        if(!password) fields.push('password');
        if(!passwordConfirm) fields.push('passwordConfirm');
        res.json({
            ok: false,
            error: 'All fields must be filled!',
            fields
        });

    } else if (!/^[a-zA-Z0-0]+$/.test(login)){ //login has only numbers and latin words
        res.json({
            ok: false,
            error: 'Try another login!',
            fields: ['login']
        });
    }else if (login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: 'Login length must be from 3 to 16 characters!',
            fields: ['login']
        });
    } else if(password !== passwordConfirm) {
        res.json({
            ok: false,
            error: 'Passwords do not match!',
            fields: ['password', 'passwordConfirm']
        });
    } else if(password.length < 5) {
        res.json({
            ok: false,
            error: 'The minimum password length is 5 characters!',
            fields: ['password']
        });
    } else {

        models.User.findOne({
            login
        }).then(user => {
            if(!user){
                bcrypt.hash(password, null, null, (err, hash) => {
                    models.User.create({
                        login,
                        name,
                        surname,
                        password: hash
                    }).then(user => {
                        console.log(user);
                        req.session.userId = user.id;
                        req.session.userLogin = user.login;
                        res.json({
                            ok: true
                        });
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            ok: false,
                            error: 'Error, please try again later!'
                        })
                    })
                });
            } else {
                res.json({
                    ok: false,
                    error: 'Try another login!',
                    fields: ['login']
                });
            }
        });        
    }
});

// POST is authorized
router.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    if(!login || !password) {
        const fields = [];
        if(!login) fields.push('login');
        if(!password) fields.push('password');
        res.json({
            ok: false,
            error: 'All fields must be filled!',
            fields
        });

    } else {
        models.User.findOne({
            login
        }).then(user => {
            if(!user) {
                res.json({
                    ok: false,
                    error: 'Login and password are incorrect!',
                    fields: ['login', 'password']
                });
            } else {
                bcrypt.compare(password, user.password, function(err, result) {
                    if(!result) {
                        res.json({
                            ok: false,
                            error: 'Login and password are incorrect!',
                            fields: ['login', 'password']
                        });
                    } else {
                        req.session.userId = user.id;
                        req.session.userLogin = user.login;
                        res.json({
                            ok: true
                        });
                    }
                });
            }
        })
        .catch(arr => {
            console.log(err);
            res.json({
                ok: false,
                error: 'Error, please try again later!'
            })
        })
    }
});

// GET for logout
router.get('/logout', (req, res) => {
    if(req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;