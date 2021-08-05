require('dotenv').config()
const mongoose = require('mongoose')

// MongoDB connect
mongoose.connect(process.env.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true})

// Schemas
const urlSchema = new mongoose.Schema({
    originalUrl: {type: String, required: true, unique: true},
    shortUrl: {type: String, required: true, unique: true},
})

const URL = mongoose.model('URL',urlSchema)

const shortNewUrl = async (originalUrl) => {
    const dbQuery = await findOriginalUrl(originalUrl)
    if(dbQuery) return dbQuery
    const storedUrls = await getStoredUrls()
    const newUrl = await addNewUrl(originalUrl,storedUrls+1)
    return newUrl
}

const addNewUrl = (originalUrl, shortUrl) => {
    return URL.create({
        originalUrl: originalUrl,
        shortUrl: shortUrl
    })
}

const findOriginalUrl = originalUrl => {
    return URL.findOne({originalUrl: originalUrl})
}

const findShortenedUrl = shortUrl => {
    return URL.findOne({shortUrl: shortUrl})
}

const getStoredUrls = async () => {
    return URL.countDocuments({})
}

exports.URLModel = URL
exports.shortNewUrl = shortNewUrl
exports.findShortenedUrl = findShortenedUrl
exports.getStoredUrls = getStoredUrls