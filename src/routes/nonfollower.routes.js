const express = require('express');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name GET/api/nonfollowers
*/
router.post('/', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;