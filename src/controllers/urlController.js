const UrlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const shortid = require('shortid')

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

// create a short URL====================================//
const createUrl = async function(req, res) {
    try {
        let data = req.body
        let { longUrl } = data

        if (Object.keys(data).length = 0) {
            return res.status(400).send({ status: false, message: "request body is empty, BAD request" })
        }
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "longUrl is required in body" })
        }

        if (!(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(longUrl))) {
            return res.status(400).send({ status: false, message: "longUrl is not a valid URL" })
        }

        let urlCode = shortid.generate()
        let urlAlreadyUsed = await UrlModel.findOne({ urlCode })
        if (urlAlreadyUsed) {
            return res.status(400).send({ status: false, message: "url already used" })
        }

        let baseUrl = 'http://localhost:3000'
        let shortUrl = baseUrl + '/' + urlCode

        let urlCreated = { urlCode: urlCode, longUrl, shortUrl: shortUrl }
        let newUrl = await UrlModel.create(urlCreated)
        return res.status(201).send({ status: true, message: "url created successfully", data: newUrl })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: error.message })
    }
}

// get url code
const getUrlCode = async function(req, res) {
    try {
        let urlCode = req.params.urlCode

        if (!isValid(urlCode)) {
            return res.status(400).send({ status: false, message: "urlCode is required" })
        }
        let url = await UrlModel.findOne({ urlCode: urlCode })
        if (!url) {
            return res.status(404).send({ status: false, message: "urlCode not exist" })
        }
        return res.status(200).redirect({ status: true, data: url.length })


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: error.message })
    }
}

module.exports.createUrl = createUrl
module.exports.getUrlCode = getUrlCode