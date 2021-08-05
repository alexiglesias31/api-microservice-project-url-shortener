const linkCheck = require('link-check')

const verifyUrl = function(req,res,next) {
    linkCheck(req.body.url, function(err,result) {
        if(err) {
            res.json({error: 'invalid url'})
            return
        }
        if(result.status === 'dead') {
            res.json({error: 'invalid hostname'}).end()
            return
        }
        next()
    })
}

module.exports = verifyUrl