const crypto = require('crypto');

const key = crypto.randomBytes(256)

module.exports = key

