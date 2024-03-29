const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index/home');
});

router.get('/contact', (req, res) => {
    res.render('index/contact');
});

router.get('/request', (req, res) => {
    res.render('index/newfeature');
});

module.exports = router;