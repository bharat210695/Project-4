const express = require('express');
const router = express.Router();
const UrlController = require('../controllers/urlController')


// test-api
router.get('/test', function(req, res) {
    res.status(200).send({ status: true, message: "test api working fine" })
})

// 1. create short url
router.post('/url/shorten', UrlController.createUrl)

// 2. get url code
router.get('/:urlCode', UrlController.getUrlCode)

module.exports = router;