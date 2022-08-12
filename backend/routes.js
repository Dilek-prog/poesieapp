const express = require('express');
const router = express.Router();

// eine GET-Anfrage
router.get('/', async(req, res) => {

    res.send({ message: "Hello Poesie!" });
});

module.exports = router;